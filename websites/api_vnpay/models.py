from __future__ import unicode_literals

from django.db import models
from core.models import DateTimeModel
from django.utils.translation import ugettext_lazy as _

# Create your models here.

class ReloadInfomation(DateTimeModel):
    TYPE = (
        ('cancel', 'Cancel'),
        ('reload_error', 'Reload Error'),
        ('payment_error', 'Payment Error'),
        ('pendding', 'Pendding'),
        ('done', 'Done')
        
    )
    user = models.ForeignKey(
        "core.User", related_name='user_booking_rel', null=True, blank=True)
    order_id = models.CharField(_('Order ID'), max_length=100)
    amount = models.IntegerField(_('Amount'))
    order_desc = models.TextField(_("Description"))
    order_status = models.CharField(max_length=50, choices=TYPE, default="pendding")
    phone = models.CharField(_('Phone'), max_length=255)
    email = models.CharField(_('Email'), max_length=100, null=True, blank=True)
    barcode = models.CharField(max_length=100)
    full_name = models.CharField(max_length=100)
    transaction_no = models.CharField(_('Transaction No'), max_length=100, null=True, blank=True)