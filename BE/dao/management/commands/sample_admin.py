from django.contrib.auth import get_user_model
from django.core.management import BaseCommand

usr = 'admin'
pwd = 'nimda'


class Command(BaseCommand):

    def handle(self, *args, **options):
        print('Create default admin')
        m_user = get_user_model()
        m_user.objects.create_superuser(usr, password=pwd)
