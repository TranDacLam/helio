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

class TypeAdmin(TranslationAdmin):
    pass
admin.site.register(Type, TypeAdmin)

# Register Posts Type Model to Admin Site
class ImageImageInline(admin.TabularInline):
    model = Post_Image
    extra = 3

class PostTypeAdmin(TranslationAdmin):
    pass
admin.site.register(Post_Type, PostTypeAdmin)

# Register Posts Model to Admin Site
class PostAdmin(TranslationAdmin):
    inlines = [ ImageImageInline, ]
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
class EventAdmin(TranslationAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget()},
    }
    pass
admin.site.register(Event, EventAdmin)

# Games
class GameAdmin(TranslationAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget()},
    }
    pass
admin.site.register(Game, GameAdmin)

# Entertainments
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

class ContactAdmin(admin.ModelAdmin):
    pass
admin.site.register(Contact, ContactAdmin)

class BannerAdmin(TranslationAdmin):
    pass
admin.site.register(Banner, BannerAdmin)

class PromotionAdmin(TranslationAdmin):
    pass
admin.site.register(Promotion, PromotionAdmin)

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

