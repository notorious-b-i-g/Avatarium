# Generated by Django 5.1.2 on 2024-10-31 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0036_rename_visit_time_users_week_start_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='users',
            name='phone',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='uservisit',
            name='visit_time',
            field=models.DateField(blank=True, null=True),
        ),
    ]
