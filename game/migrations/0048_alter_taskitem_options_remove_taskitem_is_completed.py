# Generated by Django 5.1.2 on 2024-12-11 20:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0047_merge_20241211_2224'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='taskitem',
            options={},
        ),
        migrations.RemoveField(
            model_name='taskitem',
            name='is_completed',
        ),
    ]
