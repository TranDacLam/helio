# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-11 10:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20170509_0244'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='code',
            field=models.TextField(blank=True, null=True, verbose_name='Code Verify'),
        ),
    ]
