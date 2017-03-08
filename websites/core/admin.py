from django.contrib import admin
from models import Posts, Game
from modeltranslation.admin import TranslationAdmin
from django.db import models
from ckeditor.widgets import CKEditorWidget



class PostsAdmin(TranslationAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget()},
    }
    pass

admin.site.register(Posts, PostsAdmin)

class GameAdmin(TranslationAdmin):
    pass

admin.site.register(Game, GameAdmin)
