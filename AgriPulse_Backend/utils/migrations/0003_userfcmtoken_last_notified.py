# Generated by Django 5.1 on 2024-09-15 08:10

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('utils', '0002_alter_userfcmtoken_fcm_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfcmtoken',
            name='last_notified',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
