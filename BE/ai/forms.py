from typing import Optional

from bs4 import BeautifulSoup
from pydantic import Field, field_serializer, BaseModel


class CompanyAi(BaseModel):
    """Company Headquarters."""

    name: Optional[str] = Field(description="""
    Company name.""", default=None)
    address: Optional[str] = Field(description="""
    Company Address.
    """, default=None, many=False)
    city: Optional[str] = Field(description="""
    City where the company is located, it should be next after address.
    """, default=None, many=False)
    state: Optional[str] = Field(description="""
    State or county where the company is located.
    """, default=None, many=False)
    country: Optional[str] = Field(description="""
    Country where the company is located.
    """, default=None, many=False)
    zip: Optional[str] = Field(description="""
    Company Postal or ZIP code.
    """, default=None, many=False)
    trade_category: Optional[str] = Field(description="""
    Field of activity, domain, trade category.
    """, default=None, many=False)

    def __str__(self):
        return f"""
        {self.name or ''}
        {self.address or ''}
        {self.zip or ''} {self.city or ''}
        {self.state or ''} {self.country or ''}
        """


class JobOptionals(BaseModel):
    """Job mapping body"""

    qualification: Optional[str] = Field(description=f"""
    The qualification required for the position in the listed job description.
    This can be a degree or a student in an industry. Empty if unknown.
    """, default=None, many=False)
    employment_mode: Optional[str] = Field(description=f"""
    Employment mode like part time or full time or both. Empty if unknown.
    """, default=None, many=False)
    company_office: Optional[CompanyAi] = Field(description="""
    The hiring company. Empty if unknown.
    """, default=None, many=False)
    messages: Optional[dict] = {}

    def __str__(self):
        return f"""
        {self.qualification or ''}
        {self.employment_mode or ''}
        {str(self.company_office) if self.company_office else ''}
        """


class JobQueryForm(JobOptionals):
    """Job request body form"""

    title: str = Field(description="""
    job title.
    """, many=False)
    content: Optional[str] = Field(description="""
    job description.
    """, default=None, many=False)
    trade_category: Optional[str] = Field(description="""
    Field of activity, domain, trade category.
    """, default=None, many=False)

    @field_serializer('content')
    def serialize_dt(self, content):
        if not content:
            return
        return BeautifulSoup(content, 'html.parser').get_text(separator=' ')

    def __str__(self):
        value = self.model_dump()
        return f"""
        {value.get('title') or ''}
        {value.get('content') or ''}
        {super().__str__()}
        {value.get('trade_category') or ''}
        """


class AttributeForm(BaseModel):
    """Attribute"""

    name: str = Field(description="""
    The name of the attribute.
    """, many=False)
    description: Optional[str] = Field(description="""
    The description or synonyms of the attribute.
    """, default=None, many=False)
    type: str = Field(description="""
    The type of the attribute""", default=None, many=False)
    user_id: int = Field(description="""
    The id of the user that uploaded this attribute""", default=None, many=False)



