"""
URL configuration for aiclassification project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView, TokenBlacklistView

from ai import user_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
                  path('admin/', admin.site.urls),
                  # path('', include('api.urls')),
                  # path('', include('ai.urls')),
                  path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
                  path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
                  path('api/v1/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
                  path('api/v1/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
                  path('api/v1/profile', user_views.get_profile, name='profile'),
                  path('api/v1/profile/update/', user_views.update_profile, name='update-profile'),
                  path('api/v1/register/', user_views.RegisterView.as_view(), name='create-user'),
                  path('api/v1/users', user_views.get_all_users, name='user-list'),
                  path('api/v1/attributes', user_views.get_attributes, name='user-attributes'),
                  path('api/v1/attributes/', user_views.create_attribute, name='create-attribute'),
                  path('api/v1/attribute-values', user_views.get_attributeValues, name='user-attribute-values'),
                  path('api/v1/mapping-templates/', user_views.create_template,
                       name='create-mapping-template'),
                  path('api/v1/addmemory/', user_views.MemoryView.as_view(), name='create-memory'),
                  path('api/v1/saveall/', user_views.save_all, name='save-all'),
                  path('api/v1/memories', user_views.get_memories, name='get-memories'),
                  path('api/v1/mapping-setup/', user_views.MappingSetupView.as_view(), name='mapping-setup'),
                  path('api/v1/mapping-setup', user_views.get_mapping_setup, name='get-mapping-setup'),
                  path('api/v1/mapping-template', user_views.get_mapping_templates, name='mapping-templates'),
                  path('api/v1/query-text/', user_views.query_text, name='query-text'),
                  path('api/v1/query-file/', user_views.query_file, name='query-file'),
                  path('api/v1/dbsetup/', user_views.DbSetupView.as_view(), name='db-setup'),
                  path('api/v1/dbsetup', user_views.get_db_setup, name='db-setup'),
                  path('api/v1/contact/', user_views.contact_support, name='contact'),
                  path('api/v1/delete-memory/', user_views.delete_memory, name='delete-memory'),
                  path('api/v1/delete-attribute/', user_views.delete_attribute, name='delete-attribute'),
                  path('api/v1/delete-template/', user_views.delete_template, name='delete-template'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
