# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-01-23 08:17
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0029_user_token_last_expired'),
    ]

    operations = [
        migrations.CreateModel(
            name='Denomination',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Modified Date')),
                ('denomination', models.IntegerField(default=0, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Fee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Modified Date')),
                ('fee', models.IntegerField(default=0)),
                ('fee_type', models.CharField(choices=[('%', '%'), ('vnd', 'VND')], default='%', max_length=20)),
                ('position', models.CharField(choices=[('tickets', 'Ticket transfer fee'), ('deposit', 'Deposit fee')], default='tickets', max_length=50)),
                ('is_apply', models.BooleanField(default=False, verbose_name='Is Apply')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='feedback',
            name='answer',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='feedback',
            name='feedback_type',
            field=models.CharField(choices=[('feedback', 'Feedback'), ('contact', 'Contact')], default='feedback', max_length=50),
        ),
        migrations.AddField(
            model_name='feedback',
            name='sent_date',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Sent Date'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='feedback',
            name='status',
            field=models.CharField(choices=[('no_process', 'No Process'), ('answered', 'Answered'), ('moved', 'Moved to related department')], default='no_process', max_length=50),
        ),
        migrations.AddField(
            model_name='notification',
            name='is_QR_code',
            field=models.BooleanField(default=False, verbose_name='Is QR Code'),
        ),
        migrations.AddField(
            model_name='notification',
            name='location',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='promotion',
            name='QR_code',
            field=models.ImageField(blank=True, null=True, upload_to='qrcode'),
        ),
        migrations.AddField(
            model_name='promotion',
            name='apply_date',
            field=models.DateField(blank=True, null=True, verbose_name='Apply Date'),
        ),
        migrations.AddField(
            model_name='promotion',
            name='end_date',
            field=models.DateField(blank=True, null=True, verbose_name='End Date'),
        ),
        migrations.AddField(
            model_name='promotion',
            name='image_thumbnail',
            field=models.ImageField(blank=True, max_length=1000, null=True, upload_to='promotions', verbose_name='Image Thumbnail'),
        ),
        migrations.AddField(
            model_name='promotion',
            name='promotion_type',
            field=models.CharField(choices=[('popular', 'Popular'), ('users', 'Users')], default='popular', max_length=50),
        ),
        migrations.AddField(
            model_name='user',
            name='barcode',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='username_mapping',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]