# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-03-16 04:26
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0040_auto_20180316_1006'),
    ]

    operations = [
        migrations.CreateModel(
            name='Roles_Permission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Modified Date')),
                ('model_name', models.CharField(max_length=255)),
                ('permission', models.CharField(choices=[('full', 'Full'), ('change', 'Change'), ('read', 'Read')], max_length=255)),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='permission_roles_rel', to='core.Roles')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
