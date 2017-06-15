# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-15 03:54
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_auto_20170606_1647'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category_Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Modified Date')),
                ('name', models.CharField(max_length=255, unique=True)),
            ],
            options={
                'verbose_name': 'Category Notification',
                'verbose_name_plural': 'Category Notification',
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Modified Date')),
                ('subject', models.CharField(max_length=255, unique=True)),
                ('message', models.TextField()),
                ('sub_url', models.CharField(blank=True, max_length=255, null=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notification_category_rel', to='core.Category')),
            ],
            options={
                'verbose_name': 'Notification',
                'verbose_name_plural': 'Notification',
            },
        ),
        migrations.CreateModel(
            name='User_Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Modified Date')),
                ('is_read', models.BooleanField(default=False, verbose_name='Is Read')),
                ('notification', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Notification')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='gift',
            name='device_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]