# Generated by Django 5.1.2 on 2024-10-15 23:11

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0020_useractivity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useractivity',
            name='activity_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
