# -*- coding: utf-8 -*-
from django.contrib import admin
from models import *
from modeltranslation.admin import TranslationAdmin
from django.db import models
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django import forms
import custom_models
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
# from django.contrib.admin import SimpleListFilter


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(
        label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = custom_models.User
        fields = ('email',)

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = custom_models.User
        fields = ('email', 'password', 'birth_date', 'phone', 'personal_id', 'first_name', 'last_name',
                  'country', 'address', 'city', 'is_active', 'is_staff', 'is_superuser', 'groups')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'country', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser', )
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('birth_date', 'phone',
                                      'personal_id', 'country', 'address', 'city',)}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', )}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
         ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()

# Now register the new UserAdmin...

admin.site.register(custom_models.User, UserAdmin)


class CategoryAdmin(TranslationAdmin):
    pass
admin.site.register(Category, CategoryAdmin)


class TypeAdmin(TranslationAdmin):
    pass
admin.site.register(Type, TypeAdmin)

# Register Posts Type Model to Admin Site


class PostImageInline(admin.TabularInline):
    model = Post_Image
    extra = 3

# Add Filter Post Type


# class PostTypeFilter(SimpleListFilter):
#     title = 'Type'  # or use _('country') for translated title
#     parameter_name = 'post_type'

#     def lookups(self, request, model_admin):
#         # You can also use hardcoded model name like "Post_Type" instead of
#         # "model_admin.model" if this is not direct foreign key filter

#         post_types = set(
#             [c.post_type for c in model_admin.model.objects.all()])
#         result = [(pt.id, pt.name) for pt in post_types if pt != None]
        
#         return result

#     def queryset(self, request, queryset):
#         if self.value():
#             return queryset.filter(post_type__id__exact=self.value())
#         else:
#             return queryset


class PostTypeAdmin(TranslationAdmin):
    pass
admin.site.register(Post_Type, PostTypeAdmin)

# Register Posts Model to Admin Site

def custom_titled_filter(title):
    class Wrapper(admin.FieldListFilter):
        def __new__(cls, *args, **kwargs):
            instance = admin.FieldListFilter.create(*args, **kwargs)
            instance.title = title
            return instance
    return Wrapper

class PostAdmin(TranslationAdmin):
    list_filter = (('post_type__name', custom_titled_filter('Post Type')), )
    # list_filter = (PostTypeFilter, )
    inlines = [PostImageInline, ]
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget()},
    }

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
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
