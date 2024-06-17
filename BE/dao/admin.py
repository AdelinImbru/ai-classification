from django.contrib import admin

from dao.models import Attribute, AttributeValue, Memory, MappingTemplate, CustomUser, MappingSetup, DbSetup


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('username', 'email', 'first_name', 'last_name')


@admin.register(MappingTemplate)
class MappingTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'user', 'field_of_activity']
    search_fields = ['name', 'field_of_activity']
    list_filter = ['user', 'field_of_activity']


@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    list_display = ['input', 'output', 'user', 'field_of_activity']
    search_fields = ['input', 'output']
    list_filter = ['user', 'field_of_activity']


class ResourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'description',)
    search_fields = ('name', 'description',)
    fieldsets = (
        (None, {
            'fields': ('name',)
        }),
        ('details', {
            'fields': ('description',)
        }),
    )


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'type', 'user')
    search_fields = ('name', 'description', 'user')


@admin.register(AttributeValue)
class AttributeValueAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'attribute', 'user')
    search_fields = ['name']
    list_filter = ['attribute', 'user']


@admin.register(MappingSetup)
class MappingSetupAdmin(admin.ModelAdmin):
    list_display = ['user', 'field_of_activity', 'number_of_attribute_values', 'mapping_template', 'use_descriptions',
                    'number_of_memory_values', 'use_check_prompt']
    search_fields = ['user']
    list_filter = ['user']


@admin.register(DbSetup)
class DbSetupAdmin(admin.ModelAdmin):
    list_display = ['user', 'field_of_activity', 'use_attribute_values', 'use_memory', 'attribute_file', 'attribute_values_file', 'memory_file']
    search_fields = ['user']
    list_filter = ['user']
