from django.urls import include, re_path
from tastypie.api import Api

from api.resources import *

api_version = 'v1'
v1_api = Api(api_name=api_version)
v1_api.register(AttributeResource())
v1_api.register(AttributeValueResource())
v1_api.register(MemoryResource())
v1_api.register(MappingTemplateResource())
v1_api.register(CustomUserResource())
v1_api.register(DbSetupResource())
v1_api.register(MappingSetupResource())

urlpatterns = [
    re_path(r'^api/', include(v1_api.urls)),
]
