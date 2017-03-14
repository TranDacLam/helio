# -*- coding: utf-8 -*-
from django.contrib import admin
from models import *
from modeltranslation.admin import TranslationAdmin
from django.db import models
from ckeditor_uploader.widgets import  CKEditorUploadingWidget
from django import forms


class CategoryAdmin(TranslationAdmin):
    pass
admin.site.register(Category, CategoryAdmin)

# Register Posts Type Model to Admin Site
class PostTypeAdmin(TranslationAdmin):
    pass
admin.site.register(Post_Type, PostTypeAdmin)

# Register Posts Model to Admin Site
class PostAdmin(TranslationAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget()},
    }
    
    def get_readonly_fields(self, request, obj=None):
        if obj: # editing an existing object
            return self.readonly_fields + ('key_query',)
        return self.readonly_fields
    
    pass
admin.site.register(Post, PostAdmin)

# Events
class EventFilterAdmin(TranslationAdmin):
    pass
admin.site.register(Event_Filter, EventFilterAdmin)

class EventAdmin(TranslationAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget()},
    }
    pass
admin.site.register(Event, EventAdmin)

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

class EntertainmentAdmin(TranslationAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget()},
    }
    pass
admin.site.register(Entertainment, EntertainmentAdmin)

# FAQs
class FAQsAdmin(TranslationAdmin):
    pass
admin.site.register(FAQ, FAQsAdmin)

# Hots
class HotForm(forms.ModelForm):
    class Meta:
        model = Hot
        fields = '__all__'

    def clean(self):
        is_show = self.cleaned_data.get('is_show')
        total_show = Hot.objects.filter(is_show=True).count()
        if total_show < 5:
            pass
        else:
            raise forms.ValidationError('Hot giới hạn tối đa 5 bài được hiển thị. Vui lòng chọn bỏ bớt trường is_show và chọn lại.',
                    code='invalid_is_show',
                    params={'is_show': is_show},
                )

        return self.cleaned_data

class HotsAdmin(TranslationAdmin):
    form = HotForm
    pass
admin.site.register(Hot, HotsAdmin)

