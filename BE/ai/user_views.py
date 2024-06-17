import json

from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
from django.conf import settings
from django.core.mail import send_mail, BadHeaderError

from pydantic import ValidationError

from ai.views import execute_chain_v5
from dao.models import CustomUser, Attribute, AttributeValue, Memory, MappingTemplate, \
    MappingSetup, DbSetup
from ai.serializers import MyTokenObtainPairSerializer, RegisterSerializer, ProfileSerializer, AttributeSerializer, \
    AttributeValueSerializer, AttributeListSerializer, MemorySerializer, \
    MappingTemplateSerializer, MappingSetupSerializer, MappingTemplateListSerializer, DbSetupListSerializer, \
    MemoryListSerializer, DbSetupSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser


class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = ([AllowAny])
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = ([AllowAny])
    serializer_class = RegisterSerializer


class AttributeView(generics.CreateAPIView):
    queryset = Attribute.objects.all()
    permission_classes = ([IsAuthenticated])
    serializer_class = AttributeSerializer


class MemoryView(generics.CreateAPIView):
    queryset = Memory.objects.all()
    permission_classes = ([IsAuthenticated])
    serializer_class = MemorySerializer


class MappingSetupView(generics.CreateAPIView):
    queryset = MappingSetup.objects.all()
    permission_classes = ([IsAuthenticated])
    serializer_class = MappingSetupSerializer


class MappingTemplateView(generics.CreateAPIView):
    queryset = MappingTemplate.objects.all()
    permission_classes = ([IsAuthenticated])
    serializer_class = MappingTemplateSerializer


class DbSetupView(generics.CreateAPIView):
    queryset = DbSetup.objects.all()
    permission_classes = ([IsAuthenticated])
    serializer_class = DbSetupSerializer
    parser_classes = (MultiPartParser, FormParser)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    serializer = ProfileSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    users = CustomUser.objects.all()
    serialized_data = ProfileSerializer(users, many=True).data
    return Response(serialized_data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    serializer = ProfileSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_memory(request):
    memory = Memory.objects.get(id=request.data['id'])
    memory.delete()
    serialized_data = MemoryListSerializer(Memory.objects.filter(user=request.user.id), many=True).data
    return Response(serialized_data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_template(request):
    template = MappingTemplate.objects.get(id=request.data['id'])
    template.delete()
    serialized_data = MappingTemplateListSerializer(MappingTemplate.objects.filter(user=request.user.id), many=True).data
    return Response(serialized_data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_attribute(request):
    attr = Attribute.objects.get(id=request.data['id'])
    attr.delete()
    serialized_data = AttributeListSerializer(Attribute.objects.filter(user=request.user.id), many=True).data
    return Response(serialized_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_attribute(request):
    user = request.user
    serializer = AttributeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    serialized_data = AttributeListSerializer(Attribute.objects.filter(user=user.id), many=True).data
    return Response(serialized_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_template(request):
    user = request.user
    serializer = MappingTemplateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    serialized_data = MappingTemplateListSerializer(MappingTemplate.objects.filter(user=user.id), many=True).data
    return Response(serialized_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attributes(request):
    user = request.user
    attributes = Attribute.objects.filter(user=user).values()
    serialized_data = AttributeListSerializer(attributes, many=True).data
    return Response(serialized_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mapping_templates(request):
    user = request.user
    templates = MappingTemplate.objects.filter(user=user).values()
    serialized_data = MappingTemplateListSerializer(templates, many=True).data
    return Response(serialized_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attributeValues(request):
    user = request.user
    attributeValues = AttributeValue.objects.filter(user=user, attribute=Attribute.objects.get(
        id=request.query_params.get('attribute'))).values()
    serialized_data = AttributeValueSerializer(attributeValues, many=True).data
    return Response(serialized_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_memories(request):
    user = request.user
    memories = Memory.objects.filter(user=user).values()
    serialized_data = MemoryListSerializer(memories, many=True).data
    return Response(serialized_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mapping_setup(request):
    user = request.user
    mapping_setup = MappingSetup.objects.filter(user=user).values().first()
    mapping_setup['attributes'] = AttributeListSerializer(
        list(MappingSetup.objects.filter(user=user).first().attributes.all()), many=True).data
    return Response(mapping_setup)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_db_setup(request):
    user = request.user
    mapping_setup = DbSetupListSerializer(DbSetup.objects.filter(user=user).values().first(), many=False).data
    return Response(mapping_setup)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def query_text(request):
    responses = []
    user = request.user
    text = request.data['input']
    try:
        response = execute_chain_v5(text, user)
        if not response:
            response = {"AI": "The AI failed to map."}
        response['input'] = text
        responses.append(response)
        return JsonResponse(responses, safe=False)
    except (ValueError, ValidationError,) as e:
        return HttpResponseBadRequest(e)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def query_file(request):
    responses = []
    user = request.user
    keys = request.data.keys()
    files = request.data
    for key in keys:
        for text in json.loads(files[key].file.getvalue()):
            try:
                response = execute_chain_v5(text.get('input'), user)
                if not response:
                    response = {"AI": "The AI failed to map."}
                response['input'] = text.get('input')
                responses.append(response)
            except (ValueError, ValidationError,) as e:
                return HttpResponseBadRequest(e)
    return JsonResponse(responses, safe=False)


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_support(request):
    data = request.data
    try:
        send_mail(
            "Support AiClassification " + data.get('first_name') + " " + data.get('last_name'),
            data.get('message') + '\n' + data.get('phone') + '\n' + data.get('email'),
            settings.EMAIL_HOST,
            ["imbru.adelin@yahoo.com"],
        )
    except BadHeaderError:
        return HttpResponse("Invalid header found.")
    return Response("Request sent successfully!")

