# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-16 07:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_auto_20170516_0736'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='device_uid',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]