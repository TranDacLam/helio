# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-06-29 04:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_vnpay', '0003_auto_20180626_1518'),
    ]

    operations = [
        migrations.AddField(
            model_name='reloadinfomation',
            name='transaction_no',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Transaction No'),
        ),
    ]
