# Generated by Django 5.1.2 on 2024-12-11 22:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0048_alter_taskitem_options_remove_taskitem_is_completed'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskitem',
            name='completed',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
