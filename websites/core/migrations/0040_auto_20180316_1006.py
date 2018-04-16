# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-03-16 03:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0039_remove_notification_is_draft'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advertisement',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='advertisement',
            name='name_en',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='advertisement',
            name='name_vi',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='subject',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='subject_en',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='subject_vi',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='promotion_label',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='promotion_label',
            name='name_en',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='promotion_label',
            name='name_vi',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='promotion_type',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='roles',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
