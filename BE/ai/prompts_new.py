import json
import os
from abc import ABC, abstractmethod
from typing import Optional

from django.contrib.contenttypes.models import ContentType
from langchain.base_language import BaseLanguageModel
from langchain_community.callbacks import get_openai_callback
from langchain_core.output_parsers import StrOutputParser
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from ai.util import get_flag
from dao.models import Memory, MappingSetup, DbSetup
from vectordb import get_vectordb_model

import cohere

VectorModel = get_vectordb_model()
# co = cohere.Client(os.environ.get('COHERE_API_KEY'))


def show_costs(fp: staticmethod):
    def wrapper(*args, **kwargs):
        with get_openai_callback() as cb:
            result = fp(*args, **kwargs)
            if get_flag('DEBUG'):
                print(cb)
            return result

    return wrapper


class BasePrompt(ABC):
    """Abstract Prompt"""

    debug = os.environ.get('DEBUG') == 'true'

    def __init__(self, llm: BaseLanguageModel = None):
        self.first_llm = llm or ChatOpenAI(model_name=os.environ.get('MODEL_NAME'),
                                           temperature=float(os.environ.get('TEMPERATURE')),
                                           openai_api_key=os.environ.get('OPENAI_API_KEY'),
                                           verbose=self.debug)
        self.fallback_llm = ChatOpenAI(model_name=os.environ.get('MODEL_NAME_FALLBACK'),
                                       temperature=float(os.environ.get('TEMPERATURE')),
                                       openai_api_key=os.environ.get('OPENAI_API_KEY'),
                                       verbose=self.debug)
        self.llm = self.first_llm.with_fallbacks([self.fallback_llm])

    @abstractmethod
    def query(self, text: str = '', **kwargs):
        """query the llm"""


class ContextPrompt(BasePrompt):
    """A prompt with some input and context"""

    template = """
{header}
CONTEXT:
{context}
INPUT:
{input}

{schema}
"""

    def __init__(self,
                 schema,
                 context: dict or list,
                 header: str = '',
                 mapping_setup: MappingSetup = None,
                 db_setup: DbSetup = None,
                 **kwargs):
        super().__init__(**kwargs)
        self.context = context
        self.header = header
        self.schema = schema
        self.mapping_setup = mapping_setup
        self.db_setup = db_setup

    def query(self, text: str = '', **kwargs):
        output_parser = StructuredOutputParser.from_response_schemas(self.schema)
        self.schema = output_parser.get_format_instructions()
        prompt = ChatPromptTemplate.from_template(self.template)
        chain = prompt | self.llm | StrOutputParser()
        response = chain.invoke({"header": self.header, "context": self.context, "input": text,
                                 "schema": self.schema})
        parsed_response = output_parser.parse(response)
        if self.debug:
            print(response, '\n')
        return parsed_response


class AnalystPrompt(ContextPrompt):
    """Extract prompt"""

    header = """
You are tasked reading the INPUT section and using the values in the CONTEXT section, map the OUTPUT accordingly.
For every attribute pick a value for the attribute from the values in the CONTEXT corresponding to that attribute.
If there are no values provided in context, feel free to map as you see fit.
Consider the descriptions for the attributes if provided.
"""

    def __init__(self, embeddings: Optional[dict], mapping_setup: MappingSetup, db_setup: DbSetup, **kwargs):
        context = {}
        self.header = f"You are an expert analyst in the field of {mapping_setup.field_of_activity}" + self.header
        self.schema = [ResponseSchema(name=attribute.name, type=attribute.type, description=attribute.description) for
                       attribute in mapping_setup.attributes.all()]
        if db_setup.use_attribute_values:
            for attribute in mapping_setup.attributes.all():
                attribute_values = [
                    {'name': e.name, 'description': e.description} if mapping_setup.use_descriptions else {'name': e.name}
                    for e in embeddings.get(attribute.name)]
                context[attribute.name] = attribute_values
        else:
            context = ''
        super().__init__(
            header=self.header,
            schema=self.schema,
            context=context,
            mapping_setup=mapping_setup,
            db_setup=db_setup,
            **kwargs
        )


class CheckPrompt(BasePrompt):
    """Check prompt with GPT4"""

    template = """You are a professional analyst in the field of {field_of_activity}.
    Your job is to extract data from unstructured inputs.
    For the input {ai_input}, this is how you mapped it the first time: {first_mapping}.
    Take it step by step and look for any mistakes or uncertainties.
    If you find anything wrong please fix and return only the corrected mapping.
    {context}
    Do not assume anything.
    Do not return synonyms.
    HISTORY:
    Relevant pieces of previous conversation:
    {history}

    (You do not need to use these pieces of information if not relevant)

    {schema}
    Do not add any text or description for the mapped fields."""

    def __init__(self, embeddings: Optional[dict], mapping_setup: MappingSetup, db_setup: DbSetup, **kwargs):
        self.mapping_setup = mapping_setup
        self.context = ''
        self.db_setup=db_setup
        super().__init__()
        self.schema = [ResponseSchema(name=attribute.name, type=attribute.type, description=attribute.description) for
                       attribute in mapping_setup.attributes.all()]
        if db_setup.use_attribute_values:
            for attribute in mapping_setup.attributes.all():
                attribute_values = [
                    {'name': e.name, 'description': e.description} if mapping_setup.use_descriptions else {'name': e.name}
                    for e in embeddings.get(attribute.name)]
                self.context += f"The value for {attribute.name} should be from {attribute_values}"
        else:
            self.context = ''
        self.first_llm.model_name = os.environ.get('CHECK_PROMPT_MODEL_NAME')
        self.output_parser = StructuredOutputParser.from_response_schemas(self.schema)
        self.schema = self.output_parser.get_format_instructions()
        self.prompt = ChatPromptTemplate.from_template(template=self.template)

    @show_costs
    def query(self, text: str = '', **kwargs):
        history = ''
        input_vals = self.get_input(input=text, **kwargs, schema=self.schema)
        formatted_prompt = self.prompt.format_prompt(**input_vals).messages[0].content
        if self.db_setup.use_memory:
            history = [h.metadata.get('memory') for h in VectorModel.objects.filter(
                content_type=ContentType.objects.get_for_model(Memory),
                metadata__field_of_activity__exact=self.mapping_setup.field_of_activity,
                metadata__user__exact=self.mapping_setup.user.id
            ).search(formatted_prompt, k=self.mapping_setup.number_of_memory_values)]
        # reranked_history = [h.document.get('text') for h in
        #                     co.rerank(query=formatted_prompt, documents=history, top_n=1,
        #                               model='rerank-multilingual-v2.0')]
        # rerank = ", ".join(reranked_history)
        chain = self.prompt | self.llm | StrOutputParser()
        response = chain.invoke(
            {"field_of_activity": self.mapping_setup.field_of_activity, "ai_input": text,
             "first_mapping": kwargs["first_mapping"],
             "context": self.context,
             "history": history, "schema": self.schema})
        parsed_response = self.output_parser.parse(response)
        if self.debug:
            print(response, '\n')
        return parsed_response

    def get_input(self, **kwargs):
        result = {}
        for k in self.prompt.input_variables:
            val = getattr(self, k) if hasattr(self, k) else kwargs.get(k)
            result[k] = val if type(val) is str else json.dumps(val)
        return result


class SummarizePrompt(BasePrompt):
    """Extract a summary of the job announcement"""

    def __init__(self):
        self.prompt_template = ChatPromptTemplate.from_template("""You are a professional Job Analyst.
Take it step by step and extract only the information that is related to the job position,
the type of employment for the job and the tasks and responsibilities that come with the job in the following job offer:

            {text}""")
        super().__init__()

    @show_costs
    def query(self, text: str = '', **kwargs):
        chain = self.prompt_template | self.llm | StrOutputParser()
        response = chain.invoke({"text": text})
        if self.debug:
            print(response)
        return response
