# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-04-11 07:18
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0046_auto_20180411_1134'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Mode_Name',
            new_name='Model_Name',
        ),
    ]