# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-30 07:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0025_auto_20170629_1037'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='device_unique',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
