from django.contrib import admin
from models import *
from modeltranslation.admin import TranslationAdmin
from django.db import models
from ckeditor_uploader.widgets import  CKEditorUploadingWidget

class CategoryAdmin(TranslationAdmin):
    pass
admin.site.register(Category, CategoryAdmin)

# Register Posts Type Model to Admin Site
class PostTypeAdmin(TranslationAdmin):
    pass
admin.site.register(Post_Type, PostTypeAdmin)

# Register Posts Model to Admin Site
class PostsAdmin(TranslationAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget()},
    }
    pass
admin.site.register(Posts, PostsAdmin)

# Events
class EventFilterAdmin(TranslationAdmin):
    pass
admin.site.register(Event_Filter, EventFilterAdmin)

class EventsAdmin(TranslationAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget()},
    }
    pass
admin.site.register(Events, EventsAdmin)

# Games
class GameTypeAdmin(TranslationAdmin):
    pass
admin.site.register(Game_Type, GameTypeAdmin)

class GameFilterAdmin(TranslationAdmin):
    pass
admin.site.register(Game_Filter, GameFilterAdmin)

class GameAdmin(TranslationAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget()},
    }
    pass
admin.site.register(Game, GameAdmin)

# Entertainments
class EntertainmentsTypeAdmin(TranslationAdmin):
    pass
admin.site.register(Entertainments_Type, EntertainmentsTypeAdmin)

class EntertainmentsFilterAdmin(TranslationAdmin):
    pass
admin.site.register(Entertainments_Filter, EntertainmentsFilterAdmin)

class EntertainmentsAdmin(TranslationAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget()},
    }
    pass
admin.site.register(Entertainments, EntertainmentsAdmin)

# FAQs
class FAQsAdmin(TranslationAdmin):
    pass
admin.site.register(FAQs, FAQsAdmin)

# Hots
class HotsAdmin(TranslationAdmin):
    pass
admin.site.register(Hots, HotsAdmin)

