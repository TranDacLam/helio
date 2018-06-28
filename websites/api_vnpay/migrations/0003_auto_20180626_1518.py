# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-06-26 08:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_vnpay', '0002_auto_20180621_1023'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reloadinfomation',
            name='order_status',
            field=models.CharField(choices=[('cancel', 'Cancel'), ('reload_error', 'Reload Error'), ('payment_error', 'Payment Error'), ('pendding', 'Pendding'), ('done', 'Done')], default='pendding', max_length=50),
        ),
    ]
