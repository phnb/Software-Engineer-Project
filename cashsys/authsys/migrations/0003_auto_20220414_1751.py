# Generated by Django 3.2.12 on 2022-04-14 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authsys', '0002_auto_20220414_1711'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='first_name',
            field=models.CharField(blank=True, max_length=100, unique=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='last_name',
            field=models.CharField(blank=True, max_length=100, unique=True),
        ),
    ]