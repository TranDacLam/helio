from django.contrib import admin
from models import Posts
from modeltranslation.admin import TranslationAdmin


class PostsAdmin(TranslationAdmin):
    pass

admin.site.register(Posts, PostsAdmin)