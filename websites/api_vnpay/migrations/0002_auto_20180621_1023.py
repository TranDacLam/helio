# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-06-21 03:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api_vnpay', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reloadinfomation',
            name='amount',
            field=models.IntegerField(verbose_name='Amount'),
        ),
        migrations.AlterField(
            model_name='reloadinfomation',
            name='barcode',
            field=models.CharField(default=django.utils.timezone.now, max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='reloadinfomation',
            name='full_name',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='reloadinfomation',
            name='phone',
            field=models.CharField(default='', max_length=255, verbose_name='Phone'),
            preserve_default=False,
        ),
    ]