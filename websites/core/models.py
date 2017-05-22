from __future__ import unicode_literals
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.encoding import python_2_unicode_compatible
from django.contrib.auth.models import AbstractUser
import custom_models
import constants as const

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
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField(
        max_length=1000, null=True, blank=True, upload_to="posts")
    short_description = models.CharField(max_length=350)
    content = models.TextField()
    post_type = models.ForeignKey('Post_Type', related_name='posts_type_rel', on_delete=models.CASCADE, null=True,
                                  blank=True)
    key_query = models.CharField(max_length=255, unique=True)
    pin_to_top = models.BooleanField("Pin to Top",default=False)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.key_query = "kq_" + self.key_query.replace(" ", "_")
        super(Post, self).save(*args, **kwargs)

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class Post_Type(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Post Type'
        verbose_name_plural = 'Post Type'


class Post_Image(DateTimeModel):
    image = models.ImageField(
        max_length=1000, null=True, blank=True, upload_to="posts")
    post = models.ForeignKey('Post', related_name='posts_image', on_delete=models.CASCADE, null=True,
                             blank=True)


@python_2_unicode_compatible
class Event(DateTimeModel):
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField(
        max_length=1000, null=True, blank=True, upload_to="events")
    short_description = models.CharField(max_length=350)
    content = models.TextField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class Game(DateTimeModel):
    name = models.CharField(max_length=255, unique=True)
    short_description = models.CharField(max_length=350)
    content = models.TextField()
    image = models.ImageField(
        max_length=1000, null=True, blank=True, upload_to="games")
    game_type = models.ForeignKey(
        'Type', related_name='game_type_rel', on_delete=models.CASCADE)

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class Type(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey('Category', related_name='game_category_rel',
                                 on_delete=models.CASCADE)
    image = models.ImageField(
        max_length=1000, null=True, blank=True, upload_to="types")
    sub_url = models.CharField(max_length=1000)
    description_game = models.TextField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Type'
        verbose_name_plural = 'Type'


@python_2_unicode_compatible
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Categories'
        verbose_name_plural = 'Categories'


@python_2_unicode_compatible
class Entertainment(DateTimeModel):

    def limit_category_entertainments():
        return {'name_en__in': ['Entertainments', 'Kiosk', 'Store']}

    name = models.CharField(max_length=255, unique=True)
    short_description = models.CharField(max_length=350)
    content = models.TextField()
    key_query = models.CharField(
        max_length=255, unique=True, null=True, blank=True)
    image1 = models.ImageField(
        _('Image 1'), max_length=1000, null=True, blank=True, upload_to="entertainments")
    image2 = models.ImageField(
        _('Image 2'), max_length=1000, null=True, blank=True, upload_to="entertainments")
    image3 = models.ImageField(
        _('Image 3'), max_length=1000, null=True, blank=True, upload_to="entertainments")
    image4 = models.ImageField(
        _('Image 4'), max_length=1000, null=True, blank=True, upload_to="entertainments")
    image5 = models.ImageField(
        _('Image 5'), max_length=1000, null=True, blank=True, upload_to="entertainments")
    image6 = models.ImageField(
        _('Image 6'), max_length=1000, null=True, blank=True, upload_to="entertainments")
    category = models.ForeignKey('Category', related_name='entertainments_category_rel',
                                 on_delete=models.CASCADE, limit_choices_to=limit_category_entertainments)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.key_query = "kq_" + self.key_query.replace(" ", "_")
        super(Entertainment, self).save(*args, **kwargs)

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class Promotion(DateTimeModel):
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField(
        _('Image'), max_length=1000, null=True, blank=True, upload_to="promotions")
    short_description = models.CharField(max_length=350)
    content = models.TextField()
    promotion_type = models.ForeignKey(
        'Type', related_name='promotion_type_rel', on_delete=models.CASCADE)
    promotion_label = models.ForeignKey(
        'Promotion_Label', related_name='promotion_label_rel', on_delete=models.CASCADE,
                            null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class FAQ(DateTimeModel):

    def limit_category_Faq():
        return {'id__in': [const.HELIO_PLAY_CATEGORY, const.HELIO_KIDS_CATEGORY, const.POWERCARD_CATEGORY, 
                            const.REDEMPTION_STORE_CATEGORY, const.BIRTHDAY_PARTY_CATEGORY, 
                            const.SCHOOL_TRIP_CATEGORY, const.COMBO_HELIO_CATEGORY]}

    question = models.CharField(max_length=255, unique=True)
    answer = models.TextField()
    category = models.ForeignKey('Category', related_name='faq_category_rel',
                                 on_delete=models.CASCADE, limit_choices_to=limit_category_Faq)

    def __str__(self):
        return '%s' % (self.question)


@python_2_unicode_compatible
class Hot(DateTimeModel):
    name = models.CharField(max_length=255, unique=True)
    sub_url = models.CharField(max_length=1000)
    image = models.ImageField(max_length=1000, upload_to="hots")
    is_show = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class Banner(DateTimeModel):
    image = models.ImageField(max_length=1000, upload_to="banners")
    sub_url = models.CharField(max_length=1000)
    is_show = models.BooleanField(default=False)
    position = models.IntegerField()

    def __str__(self):
        return '%s' % (self.sub_url)


@python_2_unicode_compatible
class Contact(DateTimeModel):
    name = models.CharField(max_length=500)
    email = models.EmailField(max_length=500)
    subject = models.CharField(max_length=500)
    message = models.TextField()

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class FeedBack(DateTimeModel):
    name = models.CharField(max_length=500)
    email = models.EmailField(max_length=500)
    phone = models.CharField(max_length=500, null=True, blank=True)
    subject = models.CharField(max_length=500)
    message = models.TextField()
    rate = models.CharField(max_length=155, null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class Transaction_Type(DateTimeModel):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class Gift(DateTimeModel):
    user = models.ForeignKey(custom_models.User)
    promotion = models.ForeignKey(Promotion)
    is_used = models.BooleanField('Used', default=False)

    def __str__(self):
        return '%s' % (self.user.name)


@python_2_unicode_compatible
class Advertisement(DateTimeModel):
    name = models.CharField(max_length=255)
    is_show = models.BooleanField('Show', default=False)

    def __str__(self):
        return '%s' % (self.name)


@python_2_unicode_compatible
class Promotion_Label(DateTimeModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Promotion Label'
        verbose_name_plural = 'Promotion Label'
