# Generated by Django 5.1 on 2024-08-28 20:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fields', '0002_field_description'),
    ]

    operations = [
        migrations.RenameField(
            model_name='field',
            old_name='coordinates',
            new_name='geometry',
        ),
    ]