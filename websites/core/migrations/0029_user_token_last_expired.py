# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-07-24 08:29
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0028_auto_20170718_0856'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='token_last_expired',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]