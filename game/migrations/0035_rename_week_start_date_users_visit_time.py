# Generated by Django 5.1.2 on 2024-10-27 03:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0034_users_week_start_date'),
    ]

    operations = [
        migrations.RenameField(
            model_name='users',
            old_name='week_start_date',
            new_name='visit_time',
        ),
    ]
