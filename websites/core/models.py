from __future__ import unicode_literals
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.core.exceptions import ValidationError


# Create your models here.
class Post(models.Model):
    name = models.CharField(max_length=2000)
    image = models.ImageField(max_length=1000, null=True, blank=True)
    short_description = models.TextField()
    content = models.TextField()
    date_created = models.DateTimeField(_('Date Created'), auto_now_add=True,
                                        editable=False)
    post_type = models.ForeignKey('Post_Type', related_name='posts_type_rel', on_delete=models.CASCADE, null=True,
                                  blank=True)
    key_query = models.CharField(max_length=500)

    def save(self, *args, **kwargs):
        self.key_query = "kq_" + self.key_query
        super(Posts, self).save(*args, **kwargs)

    def __str__(self):
        return '%s' % (self.name)


class Post_Type(models.Model):
    name = models.CharField(max_length=500)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Post Type'
        verbose_name_plural = 'Post Type'


class Event(models.Model):
    name = models.CharField(max_length=1000)
    image = models.ImageField(max_length=1000, null=True, blank=True)
    short_description = models.TextField()
    content = models.TextField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    date_created = models.DateTimeField(_('Date Created'), auto_now_add=True,
                                        editable=False)
    event_filter = models.ManyToManyField(
        'Event_Filter', related_name='events_filter_rel')

    def __str__(self):
        return '%s' % (self.name)


class Event_Filter(models.Model):
    name = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Event Filter'
        verbose_name_plural = 'Event Filter'


class Game(models.Model):

    def limit_category_Games():
        return {'name_en__iexact': 'Games'}

    name = models.CharField(max_length=2000)
    short_description = models.TextField()
    content = models.TextField()
    image = models.ImageField(max_length=1000, null=True, blank=True)
    game_filter = models.ManyToManyField(
        'Game_Filter', related_name='game_filter_rel')
    game_type = models.ForeignKey(
        'Game_Type', related_name='game_type_rel', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', related_name='game_category_rel',
                                 on_delete=models.CASCADE, limit_choices_to=limit_category_Games)

    def __str__(self):
        return '%s' % (self.name)

class Game_Filter(models.Model):
    name = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Game Filter'
        verbose_name_plural = 'Game Filter'

class Game_Type(models.Model):
    name = models.CharField(max_length=1000)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Game Type'
        verbose_name_plural = 'Game Type'


class Category(models.Model):
    name = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)


class Entertainment(models.Model):

    def limit_category_entertainments():
        return {'name_en__iexact': 'Entertainments'}

    name = models.CharField(max_length=2000)
    image = models.ImageField(max_length=1000, null=True, blank=True)
    short_description = models.TextField()
    content = models.TextField()
    location = models.CharField(max_length=250)
    appropriate = models.CharField(max_length=500)
    entertainments_filter = models.ManyToManyField(
        'Entertainments_Filter', related_name='entertainments_filter_rel')
    entertainments_type = models.ForeignKey(
        'Entertainments_Type', related_name='entertainments_type_rel', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', related_name='entertainments_category_rel',
                                 on_delete=models.CASCADE, limit_choices_to=limit_category_entertainments)

    def __str__(self):
        return '%s' % (self.name)


class Entertainments_Filter(models.Model):
    name = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Entertainments Filter'
        verbose_name_plural = 'Entertainments Filter'


class Entertainments_Type(models.Model):
    name = models.CharField(max_length=1000)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        verbose_name = 'Entertainments Type'
        verbose_name_plural = 'Entertainments Type'


class Hot(models.Model):
    sub_url = models.CharField(max_length=1000)
    image = models.ImageField(max_length=1000)
    is_show = models.BooleanField(default=False)
    date_created = models.DateTimeField(_('Date Created'), auto_now_add=True,
                                        editable=False)

    def __str__(self):
        return '%s' % (self.sub_url)


class FAQ(models.Model):
    question = models.CharField(max_length=1000)
    answer = models.TextField()

    def __str__(self):
        return '%s' % (self.question)
