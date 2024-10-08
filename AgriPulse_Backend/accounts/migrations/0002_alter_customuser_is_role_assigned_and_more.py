# Generated by Django 5.1 on 2024-08-22 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='is_role_assigned',
            field=models.BooleanField(default=False, help_text='User under a role of other user'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='sub_role',
            field=models.CharField(blank=True, choices=[('staff', 'Staff'), ('manager', 'Manager'), ('supervisor', 'Supervisor')], help_text='Sub role for user', max_length=20, null=True),
        ),
    ]
