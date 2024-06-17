from typing import Optional

from django.contrib.contenttypes.models import ContentType
from vectordb import get_vectordb_model
from ai.prompts_new import AnalystPrompt, CheckPrompt
from dao.models import AttributeValue, CustomUser, MappingSetup, DbSetup

VectorModel = get_vectordb_model()

EMBEDDINGS_EMPTY = 'No match in embeddings.'
AI_EMPTY = 'Not mapped by ai.'
AI_IGNORE = 'Ai value not from embeddings.'


def search_embeddings_generic(text: str, mapping_setup: MappingSetup):
    result = {}
    for attribute in mapping_setup.attributes.all():
        values = VectorModel.objects.filter(
            content_type=ContentType.objects.get_for_model(AttributeValue),
            metadata__attribute__name__exact=attribute.name,
            metadata__user__exact=mapping_setup.user.id
        ).search(text, k=mapping_setup.number_of_attribute_values)
        result[attribute.name] = [value.content_object for value in values]
    return result


def get_messages_generic(response: dict, embeddings: Optional[dict]):
    messages = {}
    if not embeddings:
        return messages
    for key in response:
        attribute_names = [e.name for e in embeddings.get(key)]
        if not messages.get(key):
            messages[str(key)] = ''
        if not response.get(key):
            messages[str(key)] += AI_EMPTY
        if not attribute_names:
            messages[str(key)] += EMBEDDINGS_EMPTY
        if response.get(key) not in attribute_names:
            messages[str(key)] += AI_IGNORE
    return messages


def execute_chain_v5(text: str, user: CustomUser):
    mapping_setup = MappingSetup.objects.filter(user=user.id).first()
    db_setup = DbSetup.objects.filter(user=user.id).first()
    if db_setup.use_attribute_values:
        embeddings = search_embeddings_generic(text, mapping_setup)
    else:
        embeddings = {}
    response = AnalystPrompt(embeddings, mapping_setup, db_setup).query(text)
    response['messages'] = get_messages_generic(response, embeddings)
    if mapping_setup.use_check_prompt:
        for attribute in mapping_setup.attributes.all():
            if response['messages'].get(attribute.name) and AI_IGNORE in response['messages'].get(attribute.name):
                response = CheckPrompt(embeddings, mapping_setup, db_setup).query(text, first_mapping=response)
                response['messages'] = get_messages_generic(response, embeddings)
    return response


execute_chain = execute_chain_v5

