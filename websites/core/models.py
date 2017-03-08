from __future__ import unicode_literals
from django.utils.translation import ugettext_lazy as _
from django.db import models
from tinymce.models import HTMLField


# Create your models here.
class Posts(models.Model):
    name = models.CharField(max_length=2000)
    image = models.ImageField(max_length=1000, null=True, blank=True)
    short_description = models.TextField()
    content = HTMLField()
    date_created = models.DateTimeField(_('Date Created'), auto_now_add=True,
                                        editable=False)
    post_type = models.ForeignKey('Post_Type', related_name='posts_type_rel', on_delete=models.CASCADE, null=True,
                                  blank=True)


class Post_Type(models.Model):
    name = models.CharField(max_length=500)
    description = models.TextField(null=True, blank=True)


class Events(models.Model):
    name = models.CharField(max_length=1000)
    image = models.ImageField(max_length=1000, null=True, blank=True)
    content = models.TextField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    date_created = models.DateTimeField(_('Date Created'), auto_now_add=True,
                                        editable=False)
    event_filter = models.ManyToManyField(
        'Event_Filter', related_name='events_filter_rel')


class Event_Filter(models.Model):
    name = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)

class Game(models.Model):
    name = models.CharField(max_length=2000)
    short_description = models.TextField()
    content = models.TextField()
    image = models.ImageField(max_length=1000, null=True, blank=True)
    game_filter = models.ManyToManyField(
        'Game_Filter', related_name='game_filter_rel')
    game_type = models.ForeignKey('Game_Type', related_name='game_type_rel', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', related_name='game_category_rel', on_delete=models.CASCADE)

class Game_Filter(models.Model):
    name = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)

class Game_Type(models.Model):
    name = models.CharField(max_length=1000)

class Category(models.Model):
    name = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)

class Entertainments(models.Model):
    name = models.CharField(max_length=2000)
    image = models.ImageField(max_length=1000, null=True, blank=True)
    short_description = models.TextField()
    content = models.TextField()
    location = models.CharField(max_length=250)
    appropriate = models.CharField(max_length=500)
    entertainments_filter = models.ManyToManyField(
        'Entertainments_Filter', related_name='entertainments_filter_rel')
    entertainments_type = models.ForeignKey('Entertainments_Type', related_name='entertainments_type_rel', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', related_name='entertainments_category_rel', on_delete=models.CASCADE)

class Entertainments_Filter(models.Model):
    name = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)

class Entertainments_Type(models.Model):
    name = models.CharField(max_length=1000)

class Hots(models.Model):
    sub_url = models.CharField(max_length=1000)
    image = models.ImageField(max_length=1000)

class Contacts(models.Model):
    address = models.CharField(max_length=250)
    email = models.EmailField()
    office_phone = models.CharField(max_length=50)
    service_phone = models.CharField(max_length=50)

class FAQs(models.Model):
    question = models.CharField(max_length=1000)
    answer = models.TextField()




    