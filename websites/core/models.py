from __future__ import unicode_literals
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.encoding import python_2_unicode_compatible
from django.contrib.auth.models import AbstractUser
import custom_models
import constants as const
import qrcode
import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile

# Create your models here.


class DateTimeModel(models.Model):
    """
    Abstract model that is used for the model using created and modified fields
    """
    created = models.DateTimeField(_('Created Date'), auto_now_add=True,
                                   editable=False)
    modified = models.DateTimeField(
        _('Modified Date'), auto_now=True, editable=False)

    def __init__(self, *args, **kwargs):
        super(DateTimeModel, self).__init__(*args, **kwargs)

    class Meta:
        abstract = True


@python_2_unicode_compatible
class Post(DateTimeModel):
    name = models.CharField(_('Name'), max_length=255)
    image = models.ImageField(_('Image'),
        max_length=1000, null=True, blank=True, upload_to="posts")
    short_description = models.CharField(_('Short description'), max_length=350)
    content = models.TextField(_('Content'))
    post_type = models.ForeignKey('Post_Type', related_name='posts_type_rel', on_delete=models.CASCADE, null=True,
                                  blank=True)
    key_query = models.CharField(_('Key query'), max_length=255, unique=True)
    pin_to_top = models.BooleanField(_('Pin to top'), default=False)
    is_draft = models.BooleanField(_('Is Draft'), default=False)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.key_query = "kq_" + self.key_query.replace(" ", "_")
        super(Post, self).save(*args, **kwargs)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Post')
        verbose_name_plural = _('Post')


@python_2_unicode_compatible
class Post_Type(models.Model):
    name = models.CharField(_('Name'), max_length=255, unique=True)
    description = models.TextField(_('Description'), null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Post Type')
        verbose_name_plural = _('Post Type')


class Post_Image(DateTimeModel):
    image = models.ImageField(_('Image'),
        max_length=1000, null=True, blank=True, upload_to="posts")
    post = models.ForeignKey('Post', related_name='posts_image', on_delete=models.CASCADE, null=True,
                             blank=True)

    def __str__(self):
        return self.filename

    @property
    def filename(self):
        return self.image.name.rsplit('/', 1)[-1]


@python_2_unicode_compatible
class Event(DateTimeModel):
    name = models.CharField(_('name'), max_length=255, unique=True, blank=False)
    image = models.ImageField(_('Image'),
        max_length=1000, null=True, blank=True, upload_to="events")
    image_thumbnail = models.ImageField(
        _('Image Thumbnail'), max_length=1000, null=True, blank=True, upload_to="events")
    short_description = models.CharField(_('Short description'), max_length=350)
    content = models.TextField(_('Content'))
    start_date = models.DateField(_('Start date'), blank=False)
    end_date = models.DateField(_('End date'), blank=False)
    start_time = models.TimeField(_('Start time'), blank=False)
    end_time = models.TimeField(_('End time'), blank=False)
    is_draft = models.BooleanField(_('Is draft'), default=False)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Event')
        verbose_name_plural = _('Event')


@python_2_unicode_compatible
class Game(DateTimeModel):
    name = models.CharField(_('Name'), max_length=255, unique=True)
    short_description = models.CharField(_('Short description'), max_length=350)
    content = models.TextField(_('Content'))
    image = models.ImageField(_('Image'),
        max_length=1000, null=True, blank=True, upload_to="games")
    game_type = models.ForeignKey(
        'Type', related_name='game_type_rel', on_delete=models.CASCADE)
    is_draft = models.BooleanField(_('Is draft'), default=False)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Game')
        verbose_name_plural = _('Game')


@python_2_unicode_compatible
class Type(models.Model):
    name = models.CharField(_('Name'), max_length=255, unique=True)
    description = models.TextField(_('Description'), null=True, blank=True)
    category = models.ForeignKey('Category', related_name='game_category_rel',
                                 on_delete=models.CASCADE)
    image = models.ImageField(_('Image'),
        max_length=1000, null=True, blank=True, upload_to="types")
    sub_url = models.CharField(_('Sub url'), max_length=1000)
    description_detail = models.TextField(_('Description detail'), null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Type')
        verbose_name_plural = _('Type')


@python_2_unicode_compatible
class Category(models.Model):
    name = models.CharField(_('Name'), max_length=255, unique=True)
    description = models.TextField(_('Description'), null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Categories')
        verbose_name_plural = _('Categories')


@python_2_unicode_compatible
class Promotion(DateTimeModel):
    name = models.CharField(_('Name'), max_length=255, unique=True)
    image = models.ImageField(
        _('Image'), max_length=1000, null=True, blank=True, upload_to="promotions")
    image_thumbnail = models.ImageField(
        _('Image Thumbnail'), max_length=1000, null=True, blank=True, upload_to="promotions")
    short_description = models.CharField(_('Short description'), max_length=350)
    content = models.TextField(_('Content'))
    promotion_category = models.ForeignKey(
        'Category', related_name='promotion_category_rel', on_delete=models.CASCADE, null=True, blank=True)
    promotion_label = models.ForeignKey(
        'Promotion_Label', related_name='promotion_label_rel', on_delete=models.CASCADE,
        null=True, blank=True)

    promotion_type = models.ForeignKey('Promotion_Type', related_name='promotion_type_rel', on_delete=models.CASCADE,
                                       null=True, blank=True)
    apply_date = models.DateField(_("Apply Date"), blank=True, null=True)
    end_date = models.DateField(_("End Date"), blank=True, null=True)
    QR_code = models.ImageField(_('QR Code'), upload_to='qrcode', blank=True, null=True)
    is_draft = models.BooleanField(_('Is draft'), default=False)
    user_implementer = models.ForeignKey('User', related_name='user_implementer_rel',
                                         null=True, blank=True)
    is_save = models.BooleanField(_('Is save'), default=False)
    apply_time = models.TimeField(_('Apply time'), blank=True, null=True)
    end_time = models.TimeField(_('End time'), blank=True, null=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Promotion')
        verbose_name_plural = _('Promotion')

    def generate_qrcode(self):
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=6,
            border=0,
        )
        qr.add_data(self.id)
        qr.make(fit=True)
        img = qr.make_image()
        buffer = StringIO.StringIO()
        img.save(buffer)

        filename = 'promotion-qrcode-%s.png' % (self.id)
        filebuffer = InMemoryUploadedFile(
            buffer, None, filename, 'image/png', buffer.len, None)
        self.QR_code.save(filename, filebuffer)


@python_2_unicode_compatible
class FAQ(DateTimeModel):

    def limit_category_Faq():
        return {'id__in': [const.HELIO_PLAY_CATEGORY, const.HELIO_KIDS_CATEGORY, const.POWERCARD_CATEGORY,
                           const.REDEMPTION_STORE_CATEGORY, const.OTHER_PRODUCT_CATEGORY]}

    question = models.CharField(_('Question'), max_length=255, unique=True)
    answer = models.TextField(_('Answer'))
    category = models.ForeignKey('Category', related_name='faq_category_rel',
                                 on_delete=models.CASCADE, limit_choices_to=limit_category_Faq)

    def __str__(self):
        return '%s' % (self.question)

    class Meta:
        verbose_name = _('FAQ')
        verbose_name_plural = _('FAQ')


@python_2_unicode_compatible
class Hot(DateTimeModel):
    name = models.CharField(_('Name'), max_length=255, unique=True)
    sub_url = models.CharField(_('Sub url'), max_length=1000)
    image = models.ImageField(_('Image'), max_length=1000, upload_to="hots")
    is_show = models.BooleanField(_('Is show'), default=False)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Hot')
        verbose_name_plural = _('Hot')


@python_2_unicode_compatible
class Banner(DateTimeModel):
    image = models.ImageField(_('Image'),max_length=1000, upload_to="banners")
    sub_url = models.CharField(_('Sub url'), max_length=1000)
    is_show = models.BooleanField(_('Is show'), default=False)
    position = models.IntegerField(_('Position'))

    def __str__(self):
        return '%s' % (self.sub_url)

    class Meta:
        verbose_name = _('Banner')
        verbose_name_plural = _('Banner')


@python_2_unicode_compatible
class Contact(DateTimeModel):
    name = models.CharField(_('Name'), max_length=500)
    email = models.EmailField(_('Email'), max_length=500)
    subject = models.CharField(_('Subject'), max_length=500)
    message = models.TextField(_('Message'))

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class FeedBack(DateTimeModel):
    TYPE = (
        ('feedback', _('Feedback')),
        ('contact', _('Contact'))
    )
    STATUS = (
        ('no_process', _('No Process')),
        ('answered', _('Answered')),
        ('moved', _('Moved to related department'))
    )
    name = models.CharField(_('Name'), max_length=500)
    email = models.EmailField(_('Email'), max_length=500)
    phone = models.CharField(_('Phone'), max_length=500, null=True, blank=True)
    subject = models.CharField(_('Subject'), max_length=500)
    message = models.TextField(_('Message'),)
    rate = models.CharField(_('Email'), max_length=155, null=True, blank=True)

    sent_date = models.DateField(_('Sent Date'), null=True, blank=True)
    feedback_type = models.CharField(_('Feedback type'),
        max_length=50, choices=TYPE, default="feedback")
    status = models.CharField(_('Status'),
        max_length=50, choices=STATUS, default="no_process")
    answer = models.CharField(_('Answer'),max_length=1000, null=True, blank=True)
    is_read = models.BooleanField(_('Is read'), default=False)

    def __str__(self):
        return '%s' % (self.name)


    class Meta:
        verbose_name = _('FeedBack')
        verbose_name_plural = _('FeedBack')


@python_2_unicode_compatible
class Transaction_Type(DateTimeModel):
    name = models.CharField(_('Name'), max_length=255, unique=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Transaction Type')
        verbose_name_plural = _('Transaction Type')


@python_2_unicode_compatible
class Gift(DateTimeModel):
    user = models.ForeignKey(custom_models.User)
    promotion = models.ForeignKey(Promotion)
    device_id = models.CharField(max_length=255, null=True, blank=True)
    is_used = models.BooleanField('Used', default=False)

    def __str__(self):
        return '%s' % (self.user.email)

    class Meta:
        verbose_name = _('Gift')
        verbose_name_plural = _('Gift')


@python_2_unicode_compatible
class Advertisement(DateTimeModel):
    name = models.CharField(_('Name'), max_length=255, unique=True)
    is_show = models.BooleanField(_('Is show'), default=False)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Advertisement')
        verbose_name_plural = _('Advertisement')


@python_2_unicode_compatible
class Promotion_Label(DateTimeModel):
    name = models.CharField(_('Name'), max_length=255, unique=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Promotion Label')
        verbose_name_plural = _('Promotion Label')


@python_2_unicode_compatible
class OpenTime(DateTimeModel):
    open_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.open_date)

    class Meta:
        verbose_name = _('Open Time')
        verbose_name_plural = _('Open Time')


@python_2_unicode_compatible
class Notification(DateTimeModel):
    subject = models.CharField(_('Subject'), max_length=255, unique=True)
    message = models.TextField(_('Message'))
    image = models.ImageField(_('Image'), max_length=1000, null=True, blank=True)
    sub_url = models.CharField(_('Sub url'),max_length=255, null=True, blank=True)
    category = models.ForeignKey('Category_Notification', related_name='notification_category_rel',
                                 on_delete=models.CASCADE)
    is_QR_code = models.BooleanField(_('Is QR code'), default=False)
    location = models.CharField('Location',max_length=500, null=True, blank=True)

    # is_draft = models.BooleanField(default=False)
    sent_date = models.DateField(_('Sent Date'), null=True, blank=True)
    sent_user = models.ForeignKey('User', related_name='notification_user_rel',
                                  null=True, blank=True)
    promotion = models.OneToOneField(
        'Promotion', related_name='notification_promotion_rel', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return '%s' % (self.subject)

    class Meta:
        verbose_name = _('Notification')
        verbose_name_plural = _('Notification')


@python_2_unicode_compatible
class Category_Notification(DateTimeModel):
    name = models.CharField(_('Name'), max_length=255, unique=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Category Notification')
        verbose_name_plural = _('Category Notification')


@python_2_unicode_compatible
class User_Notification(DateTimeModel):
    user = models.ForeignKey(custom_models.User, on_delete=models.CASCADE)
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    is_read = models.BooleanField(_('Is read'), default=False)

    def __str__(self):
        return '%s' % (self.notification)

    class Meta:
        verbose_name = _('User Notification')
        verbose_name_plural = _('User Notification')


""" HELIO ADMIN V2"""


@python_2_unicode_compatible
class Fee(DateTimeModel):
    FEE_TYPE = (
        ('%', '%'),
        ('vnd', 'VND')
    )
    POSITION_TYPE = (
        ('tickets', _('Ticket transfer fee')),
        ('deposit', _('Deposit fee'))
    )
    fee = models.IntegerField(_('Fee'), default=0)
    fee_type = models.CharField(_('Fee type'), max_length=20, choices=FEE_TYPE, default="%")
    position = models.CharField(_('Position'), 
        max_length=50, choices=POSITION_TYPE, default="tickets")
    is_apply = models.BooleanField(_('Is apply'), default=False)

    class Meta:
        unique_together = ('fee', 'fee_type', 'position')
        verbose_name = _('Fee')
        verbose_name_plural = _('Fee')

    def __str__(self):
        return '%s' % (self.fee)

""" HELIO ADMIN V2"""


@python_2_unicode_compatible
class Denomination(DateTimeModel):
    denomination = models.IntegerField(default=0, unique=True)

    def __str__(self):
        return '%s' % (self.fee)

    class Meta:
        verbose_name = _('Denomination')
        verbose_name_plural = _('Denomination')


@python_2_unicode_compatible
class Promotion_Type(DateTimeModel):
    name = models.CharField(_('Name'), max_length=255, unique=True)

    def __str__(self):
        return '%s' % (self.name)

    def __unicode__(self):
        return self.name + ' ' + self.name

    class Meta:
        verbose_name = _('Promotion Type')
        verbose_name_plural = _('Promotion Type')

@python_2_unicode_compatible
class Hot_Advs(DateTimeModel):
    name = models.CharField(_('Name'), max_length=255, unique=True)
    image = models.ImageField(_('Image'), max_length=1000, upload_to="hots")
    is_register = models.BooleanField('Is register', default=False)
    is_view_detail = models.BooleanField(_('Is view detail'), default=False)
    is_draft = models.BooleanField(_('Is draft'), default=False)
    content = models.TextField(_('Content'))
    sub_url_register = models.CharField(_('Sub url register'), max_length=1000)
    sub_url_view_detail = models.CharField(_('Sub url view detail'), max_length=1000)
    is_draft = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = _('Hot Advs')
        verbose_name_plural = _('Hot Advs')


@python_2_unicode_compatible
class Roles(DateTimeModel): 
    name = models.CharField(_('Name'), max_length=255, unique=True)   

    def __str__(self):
        return '%s' % (self.name) 

    class Meta:
        verbose_name = _('Roles')
        verbose_name_plural = _('Roles')   


@python_2_unicode_compatible
class Roles_Permission(DateTimeModel): 
    PERMISSION =(
        ('full', 'Full'),
        ('change', 'Change'),
        ('read', 'Read')
    )
    model_name = models.ForeignKey('Model_Name',related_name='permission_model_rel', on_delete=models.CASCADE)
    role = models.ForeignKey(Roles,related_name='permission_roles_rel', on_delete=models.CASCADE)
    permission = models.CharField(_('Permission'), max_length=255, choices=PERMISSION) 

    class Meta:
        unique_together = ('model_name', 'role') 
    
    def __str__(self):
        return '%s' % (self.model_name)  

@python_2_unicode_compatible
class Model_Name(DateTimeModel):
    key = models.CharField(_('Key'), max_length=255, unique=True)
    name = models.CharField(_('Name'), max_length=255)
    def __str__(self):
        return '%s' % (self.name)
