from django.contrib.auth.password_validation import validate_password

from dao.models import CustomUser, Attribute, AttributeValue, MappingTemplate, Memory, \
    MappingSetup, DbSetup
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import json


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        my_user = CustomUser.objects.filter(pk=self.user.id).first()
        if my_user:
            my_user = ProfileSerializer(my_user).data
            data['user'] = my_user

        return data


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'last_login', 'is_superuser', 'is_staff', 'is_active',
            'date_joined', 'groups', 'user_permissions')


class AttributeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    type = serializers.CharField(required=True)
    user = serializers.PrimaryKeyRelatedField(many=False, queryset=CustomUser.objects.all())

    class Meta:
        model = Attribute
        fields = ('id', 'name', 'description', 'type', 'user')

    def create(self, attrs):
        attr = Attribute.objects.create(
            name=attrs['name'],
            description=attrs['description'],
            type=attrs['type'],
            user=attrs['user']
        )
        attr.save()
        return attr


class AttributeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = ('id', 'name', 'description', 'type')


class MappingTemplateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MappingTemplate
        fields = ('id', 'name', 'description', 'field_of_activity')


class AttributeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeValue
        fields = ('id', 'name', 'description')


class MemorySerializer(serializers.ModelSerializer):
    input = serializers.CharField(required=True)
    output = serializers.CharField(required=True)
    field_of_activity = serializers.CharField(required=True)
    user = serializers.PrimaryKeyRelatedField(many=False, queryset=CustomUser.objects.all())

    class Meta:
        model = Memory
        fields = ('id', 'user', 'input', 'output', 'field_of_activity')

    def create(self, attrs):
        attr = Memory.objects.create(
            input=attrs['input'],
            output=attrs['output'],
            field_of_activity=attrs['field_of_activity'],
            user=attrs['user']
        )
        attr.save()
        return attr


class MemoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Memory
        fields = ('id', 'input', 'output', 'field_of_activity')


class MappingTemplateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    description = serializers.CharField(required=False)
    field_of_activity = serializers.CharField(required=True)
    user = serializers.PrimaryKeyRelatedField(many=False, queryset=CustomUser.objects.all())
    attributes = serializers.PrimaryKeyRelatedField(many=True, queryset=Attribute.objects.all(), required=True)

    class Meta:
        model = MappingTemplate
        fields = ('id', 'name', 'description', 'field_of_activity', 'attributes', 'user')

    def create(self, attrs):
        attr = MappingTemplate.objects.update_or_create(
            user=attrs['user'],
            name=attrs['name'] if 'name' in attrs else '',
            defaults={
                'description': attrs['description'],
                'field_of_activity': attrs['field_of_activity'],
            }
        )
        attr[0].attributes.set(attrs['attributes'])
        attr[0].save()
        return attr[0]


class MappingSetupSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, queryset=CustomUser.objects.all())
    field_of_activity = serializers.CharField(required=True)
    attributes = serializers.PrimaryKeyRelatedField(many=True, required=False, queryset=Attribute.objects.all())
    number_of_attribute_values = serializers.IntegerField(required=False)
    mapping_template = serializers.PrimaryKeyRelatedField(many=False, queryset=MappingTemplate.objects.all(),
                                                          required=False)
    use_descriptions = serializers.BooleanField(required=False)
    number_of_memory_values = serializers.IntegerField(required=False)
    use_check_prompt = serializers.BooleanField(required=False)

    class Meta:
        model = MappingSetup
        fields = ('id', 'user', 'field_of_activity', 'attributes', 'number_of_attribute_values', 'mapping_template',
                  'use_descriptions', 'number_of_memory_values', 'use_check_prompt')

    def create(self, attrs):
        attr = MappingSetup.objects.update_or_create(
            user=attrs['user'],
            defaults={
                'field_of_activity': attrs['field_of_activity'],
                'number_of_attribute_values': attrs['number_of_attribute_values'],
                'use_descriptions': attrs['use_descriptions'],
                'number_of_memory_values': attrs['number_of_memory_values'],
                'use_check_prompt': attrs['use_check_prompt']
            }
        )
        if 'mapping_template' in attrs and attrs['mapping_template']:
            attr[0].mapping_template = (attrs['mapping_template'])
            attrib = Attribute.objects.filter(user=attrs['user'], templates=attrs['mapping_template']).values()
            attr[0].attributes.set([a.get('id') for a in attrib])
        elif 'attributes' in attrs and attrs['attributes']:
            attr[0].attributes.set(attrs['attributes'])
        attr[0].save()
        return attr[0]


class MappingSetupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MappingSetup
        fields = 'field_of_activity', 'attributes', 'number_of_attribute_values', 'mapping_template', 'use_descriptions', 'number_of_memory_values', 'use_check_prompt',


class DbSetupSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, queryset=CustomUser.objects.all())
    use_attribute_values = serializers.BooleanField(required=True)
    use_memory = serializers.BooleanField(required=True)
    attribute_file = serializers.FileField(required=False)
    attribute_values_file = serializers.FileField(required=False)
    memory_file = serializers.FileField(required=False)
    field_of_activity = serializers.CharField(required=False)

    class Meta:
        model = DbSetup
        fields = (
            'user', 'use_attribute_values', 'use_memory', 'attribute_file', 'attribute_values_file', 'memory_file',
            'field_of_activity')

    def create(self, attrs):
        setup = DbSetup.objects.update_or_create(
            user=attrs['user'],
            defaults={
                'use_attribute_values': attrs['use_attribute_values'],
                'use_memory': attrs['use_memory'],
                'attribute_file': attrs['attribute_file'] if 'attribute_file' in attrs else None,
                'attribute_values_file': attrs['attribute_values_file'] if 'attribute_values_file' in attrs else None,
                'memory_file': attrs['memory_file'] if 'memory_file' in attrs else None,
            })
        if 'attribute_file' in attrs and attrs['attribute_file']:
            attributes = json.loads(attrs['attribute_file'].file.getvalue())
            for a in attributes:
                Attribute.objects.update_or_create(
                    name=a.get('name'),
                    defaults={
                        'description': a.get('description'),
                        'type': a.get('type'),
                        'user': attrs['user']
                    })
        if attrs['use_attribute_values'] and 'attribute_values_file' in attrs:
            attribute_values = json.loads(attrs['attribute_values_file'].file.getvalue())
            for value in attribute_values:
                attribute_name = value.get('attribute')
                attribute = Attribute.objects.filter(name=attribute_name).first()
                if attribute:
                    AttributeValue.objects.update_or_create(
                        name=value.get('name'),
                        defaults={
                            'description': value.get('description'),
                            'user': attrs['user'],
                            'attribute': attribute,
                        }
                    )
        if attrs['use_memory'] and 'memory_file' in attrs:
            memories = json.loads(attrs['memory_file'].file.getvalue())
            for memory in memories:
                Memory.objects.update_or_create(
                    input=memory['memory'].get('input'),
                    output=memory['memory'].get('output'),
                    defaults={
                        'field_of_activity': attrs['field_of_activity'],
                        'user': attrs['user']
                    }
                )

        setup[0].save()
        return setup[0]


class DbSetupListSerializer(serializers.ModelSerializer):

    class Meta:
        model = DbSetup
        fields = ('use_attribute_values', 'use_memory')
