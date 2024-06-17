from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.paginator import Paginator
from tastypie.resources import ModelResource

from dao.models import Attribute, AttributeValue, Memory, MappingTemplate, CustomUser, MappingSetup, DbSetup

authorization = Authorization()


class AttributeResource(ModelResource):
    user = fields.ForeignKey(CustomUser, 'user')

    class Meta:
        queryset = Attribute.objects.all()
        resource_name = 'attribute'
        paginator_class = Paginator
        authorization = authorization
        filtering = {
            'name': ALL,
            'user': ['exact']
        }


class AttributeValueResource(ModelResource):
    attribute = fields.ForeignKey(AttributeResource, 'attribute')
    user = fields.ForeignKey(CustomUser, 'user')

    class Meta:
        queryset = AttributeValue.objects.all()
        resource_name = 'attribute-value'
        paginator_class = Paginator
        authorization = authorization
        filtering = {
            'name': ALL,
            'user': ['exact']
        }


class MemoryResource(ModelResource):
    user = fields.ForeignKey(CustomUser, 'user')

    class Meta:
        queryset = Memory.objects.all()
        resource_name = 'memory'
        paginator_class = Paginator
        authorization = authorization
        filtering = {
            'input': ALL,
            'user': ['exact']
        }


class MappingTemplateResource(ModelResource):
    user = fields.ForeignKey(CustomUser, 'user')
    attributes = fields.ManyToManyField(Attribute, 'attribute')

    class Meta:
        queryset = MappingTemplate.objects.all()
        resource_name = 'mapping-template'
        paginator_class = Paginator
        authorization = authorization
        filtering = {
            'name': ALL,
            'user': ['exact']
        }


class CustomUserResource(ModelResource):
    class Meta:
        queryset = CustomUser.objects.all()
        resource_name = 'user'
        paginator_class = Paginator
        authorization = authorization
        filtering = {
            'input': ALL,
            'username': ['exact']
        }


class MappingSetupResource(ModelResource):
    user = fields.ForeignKey(CustomUser, 'user')
    attributes = fields.ManyToManyField(Attribute, 'attribute')
    mapping_template = fields.ForeignKey(MappingTemplate, 'mapping-template')

    class Meta:
        queryset = MappingSetup.objects.all()
        resource_name = 'mapping-setup'
        paginator_class = Paginator
        authorization = authorization
        filtering = {
            'input': ALL,
            'user': ['exact']
        }


class DbSetupResource(ModelResource):
    user = fields.ForeignKey(CustomUser, 'user')

    class Meta:
        queryset = DbSetup.objects.all()
        resource_name = 'database-setup'
        paginator_class = Paginator
        authorization = authorization
        filtering = {
            'input': ALL,
            'user': ['exact']
        }
