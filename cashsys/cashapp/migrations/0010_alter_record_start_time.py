# Generated by Django 3.2.12 on 2022-04-18 07:34

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cashapp', '0009_auto_20220418_0110'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='start_time',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2022, 4, 18, 7, 34, 43, 867598), null=True),
        ),
    ]
