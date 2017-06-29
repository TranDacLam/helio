# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-29 03:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0024_auto_20170622_1539'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='subject',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='notification',
            name='subject_en',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='subject_vi',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
