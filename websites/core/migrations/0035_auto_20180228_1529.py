# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-02-28 08:29
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0034_promotion_promotion_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='promotion',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Promotion'),
        ),
        migrations.AddField(
            model_name='promotion',
            name='user_implementer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_implementer_rel', to=settings.AUTH_USER_MODEL),
        ),
    ]
