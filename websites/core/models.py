from __future__ import unicode_literals
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.core.exceptions import ValidationError


# Create your models here.
class DateTimeModel(models.Model):
    """
    Abstract model that is used for the model using created and modified fields
    """
    created = models.DateTimeField(_('Created Date'), auto_now_add=True,
                                   editable=False)
    modified = models.DateTimeField(_('Modified Date'), auto_now=True, editable=False)
    
    def __init__(self, *args, **kwargs):
        super(DateTimeModel, self).__init__(*args, **kwargs)

    class Meta:
        abstract = True

class Post(DateTimeModel):
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField(max_length=1000, null=True, blank=True)
    short_description = models.CharField(max_length=350)
    content = models.TextField()
    post_type = models.ForeignKey('Post_Type', related_name='posts_type_rel', on_delete=models.CASCADE, null=True,
                                  blank=True)
    key_query = models.CharField(max_length=255, unique=True)

    def save(self, *args, **kwargs):
        self.key_query = "kq_" + self.key_query
        super(Post, self).save(*args, **kwargs)

    def __str__(self):
        return '%s' % (self.name)


class Post_Type(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Post Type'
        verbose_name_plural = 'Post Type'

class Post_Image(DateTimeModel):
    image = models.ImageField(max_length=1000, null=True, blank=True)
    post = models.ForeignKey('Post', related_name='posts_image', on_delete=models.CASCADE, null=True,
                                  blank=True)


class Event(DateTimeModel):
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField(max_length=1000, null=True, blank=True)
    short_description = models.CharField(max_length=350)
    content = models.TextField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)


class Game(DateTimeModel):

    def limit_category_Games():
        return {'name_en__in': ['Helio Play', 'Helio Kids']}

    name = models.CharField(max_length=255, unique=True)
    short_description = models.CharField(max_length=350)
    content = models.TextField()
    image = models.ImageField(max_length=1000, null=True, blank=True)
    game_type = models.ForeignKey(
        'Type', related_name='game_type_rel', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', related_name='game_category_rel',
                                 on_delete=models.CASCADE, limit_choices_to=limit_category_Games)

    def __str__(self):
        return '%s' % (self.name)


class Type(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Type'
        verbose_name_plural = 'Type'


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)


class Entertainment(DateTimeModel):

    def limit_category_entertainments():
        return {'name_en__in': ['Entertainments', 'Kiosk', 'Store']}

    name = models.CharField(max_length=255, unique=True)
    short_description = models.CharField(max_length=350)
    content = models.TextField()
    image1 = models.ImageField(_('Image 1'), max_length=1000, null=True, blank=True)
    image2 = models.ImageField(_('Image 2'), max_length=1000, null=True, blank=True)
    image3 = models.ImageField(_('Image 3'), max_length=1000, null=True, blank=True)
    image4 = models.ImageField(_('Image 4'), max_length=1000, null=True, blank=True)
    image5 = models.ImageField(_('Image 5'), max_length=1000, null=True, blank=True)
    image6 = models.ImageField(_('Image 6'), max_length=1000, null=True, blank=True)
    category = models.ForeignKey('Category', related_name='entertainments_category_rel',
                                 on_delete=models.CASCADE, limit_choices_to=limit_category_entertainments)

    def __str__(self):
        return '%s' % (self.name)


class Promotion(DateTimeModel):
    def limit_category_Promotion():
        return {'name_en__in': ['Helio Play', 'Helio Kids']}

    name  = models.CharField(max_length=255, unique=True)
    image = models.ImageField(_('Image'), max_length=1000, null=True, blank=True)
    short_description = models.CharField(max_length=350)
    content = models.TextField()
    promotion_type = models.ForeignKey(
        'Type', related_name='romotion_type_rel', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', related_name='promotion_category_rel',
                                 on_delete=models.CASCADE, limit_choices_to=limit_category_Promotion)

    def __str__(self):
        return '%s' % (self.name)


class FAQ(DateTimeModel):
    def limit_category_Faq():
        return {'name_en__in': ['Helio Play', 'Helio Kids']}

    question = models.CharField(max_length=255, unique=True)
    answer = models.TextField()
    category = models.ForeignKey('Category', related_name='faq_category_rel',
                                 on_delete=models.CASCADE, limit_choices_to=limit_category_Faq)

    def __str__(self):
        return '%s' % (self.question)


class Hot(DateTimeModel):
    sub_url = models.CharField(max_length=1000)
    image = models.ImageField(max_length=1000)
    is_show = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.sub_url)


class Banner(DateTimeModel):
    image = models.ImageField(max_length=1000)
    sub_url = models.CharField(max_length=1000)
    is_show = models.BooleanField(default=False)
    position = models.IntegerField()
    
    def __str__(self):
        return '%s' % (self.sub_url)

class Contact(DateTimeModel):
    name  = models.CharField(max_length=500)
    email  = models.CharField(max_length=500)
    subject  = models.CharField(max_length=500)
    message  = models.TextField()
    
    def __str__(self):
        return '%s' % (self.sub_url)
