# Generated by Django 5.1 on 2024-08-28 20:32

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fields', '0003_rename_coordinates_field_geometry'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='field',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterUniqueTogether(
            name='field',
            unique_together={('user', 'name')},
        ),
    ]
