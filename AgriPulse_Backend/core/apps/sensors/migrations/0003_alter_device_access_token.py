# Generated by Django 5.1 on 2024-08-31 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sensors', '0002_alter_device_device_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='device',
            name='access_token',
            field=models.CharField(editable=False, max_length=255, unique=True),
        ),
    ]
