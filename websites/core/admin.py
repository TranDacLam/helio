from django.contrib import admin
from models import Posts, Game
from modeltranslation.admin import TranslationAdmin


class PostsAdmin(TranslationAdmin):
    pass

admin.site.register(Posts, PostsAdmin)

class GameAdmin(TranslationAdmin):
    pass

admin.site.register(Game, GameAdmin)
