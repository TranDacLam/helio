# -*- coding: utf-8 -*-
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from core.models import *
from core.custom_models import *
from datetime import datetime
import core.constants as const
import sys
from django.core import exceptions
import django.contrib.auth.password_validation as validators
from rest_framework import serializers  
from django.utils.translation import ugettext_lazy as _  

class Base64ImageField(serializers.ImageField):
    """
    A Django REST framework field for handling image-uploads through raw post data.
    It uses base64 for encoding and decoding the contents of the file.

    Heavily based on
    https://github.com/tomchristie/django-rest-framework/pull/1268

    Updated for Django REST framework 3.
    """

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            # Generate file name:
            file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension, )

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension

class UserSerializer(serializers.ModelSerializer):

    birth_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], allow_null = True, error_messages = {'invalid': _('Birth date is invalid.')})
   

    class Meta:
        model = User
        fields=('id' ,'full_name', 'email', 'phone','barcode','birth_date', 'personal_id', 'address', 'username_mapping', 'date_mapping')

    def validate_birth_date(self, value):
        if value >= datetime.now().date():
            raise serializers.ValidationError(_("Birthday must less then today"))
        return value
        
	# create objects
	# def create(self, validated_data):
	# 	user = User.objects.create( **validated_data )
	# 	return user

	# custom method save value in serializer
	# def save(self):
	# 	email = self.validated_data['email']
	# 	message = self.validated_data['full_name']
	
class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'

class PromotionTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion_Type
        fields = ('id', 'name')

class PromotionLabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion_Label
        fields= ('id', 'name')

class PromotionDisplaySerializer(serializers.ModelSerializer):
    promotion_type = PromotionTypeSerializer(many=False, required=False, read_only=False)
    apply_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], allow_null = True)
    end_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], allow_null = True)
    user_implementer = UserSerializer(many=False, required=False, read_only=False)
    class Meta:
        model = Promotion
        fields = '__all__'

class PromotionSerializer(serializers.ModelSerializer):
    apply_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], allow_null = True)
    end_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], allow_null = True)

    class Meta:
        model = Promotion
        fields = '__all__'

    def validate(self, data):
        if data['apply_date'] and data['end_date'] and data['apply_date'] > data['end_date']:
            raise serializers.ValidationError("Apply Date must be less than End Date")
        return data

    def create(self, validated_data):
        # If this promotion is public then set user
        if not validated_data.get('is_draft'):
            validated_data['user_implementer'] = self.context['request'].user
        return Promotion.objects.create(**validated_data)

    def update(self, instance, validated_data):

        if self.context['request']:
            # Is this promotion change from draft to public then set user
            if instance.is_draft and not validated_data.get('is_draft'):
                instance.user_implementer = self.context['request'].user
            elif not instance.is_draft and validated_data.get('is_draft'):
                instance.user_implementer = None

            # Get flag clear image from request
            is_clear_image = self.context['request'].data.get('is_clear_image')
            # Get flag clear thumbnail image from request
            is_clear_image_thumbnail = self.context['request'].data.get('is_clear_image_thumbnail')

            # If image from request is None then set image = old value
            if is_clear_image == "false" and not validated_data.get('image'):
                validated_data['image'] = instance.image

            # If image from request is None then set image = old value
            if is_clear_image_thumbnail == "false" and not validated_data.get('image_thumbnail'):
                validated_data['image_thumbnail'] = instance.image_thumbnail

        return super(PromotionSerializer, self).update(instance, validated_data)

class GiftSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, required=False, read_only=False)

    class Meta:
        model = Gift
        fields = '__all__'

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = ('id', 'name', 'is_show')

class DenominationSerializer(serializers.ModelSerializer):
    denomination = serializers.IntegerField(required=True,validators=[
        UniqueValidator(
            queryset=Denomination.objects.all(),
            message =_('This denomination is already taken')
            )
        ], max_value=2147483647, error_messages = {'max_value': _('Denomination exceed the permitted value.')})
    class Meta:
        model = Denomination
        fields = ('id', 'denomination')

class FeedBackSerializer(serializers.ModelSerializer):

    status = serializers.CharField(source='get_status_display')
    feedback_type = serializers.CharField(source='get_feedback_type_display')

    class Meta:
        model = FeedBack
        fields = ('id', 'name', 'email', 'phone', 'subject', 'message', 'rate', 'sent_date', 'feedback_type', 'status','answer', 'created', 'modified')     

    def validate(self, data):
        data['status'] = data.pop('get_status_display')
        data['feedback_type'] = data.pop('get_feedback_type_display')
        return data

class NotificationSerializer(serializers.ModelSerializer):
    sent_user = UserSerializer(many=False, required=False, read_only=False)

    class Meta:
        model = Notification
        fields= '__all__'

    def update(self, instance, validated_data):
        if self.context['request']:
            is_clear_image = self.context['request'].data.get('is_clear_image')
            if is_clear_image == "false" and not validated_data.get('image'):
                validated_data['image'] = instance.image
        return super(NotificationSerializer, self).update(instance, validated_data)

class UserEmbedSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=True)
    birth_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], required=True, error_messages = {'invalid': _('Birth date is invalid.')})
    personal_id = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    barcode = serializers.CharField(required=True)

    def validate_birth_date(self, value):
        if value >= datetime.now().date():
            raise serializers.ValidationError(_("Birthday must less then today"))
        return value

class FeeSerializer(serializers.ModelSerializer):
    fee = serializers.IntegerField(required=True, max_value = 2147483647, error_messages= {'max_value': _('Fee exceed the permitted value.')})
    fee_type = serializers.CharField(required=True)
    # position = serializers.CharField(source='get_position_display')

    class Meta:
        model = Fee
        exclude = ('created', 'modified')
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=Fee.objects.all(),
                fields=('fee', 'fee_type', 'position'),
                message=_("Fee already is exist.")
            )
        ]
    def create(self, validated_data):
        fee = Fee.objects.create( **validated_data )
        return fee
    
    # def validate(self, data):
    #     data['position'] = data.pop('get_position_display')
    #     return data


class BannerSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(required=False, allow_empty_file=True)

    class Meta:
        model = Banner
        fields = ('id', 'image', 'sub_url', 'position', 'is_show')

    def update(self, instance, validated_data):
        print "instance.image", instance.image
        if self.context['request']:
            is_clear_image = self.context['request'].data.get('is_clear_image')
            if is_clear_image == "false" and not validated_data.get('image'):
                validated_data['image'] = instance.image
            elif is_clear_image == "true":
                validated_data['image'] = None
        return super(BannerSerializer, self).update(instance, validated_data)



class CategoryNotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Category_Notification
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):

    start_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], required = True)
    end_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], required =  True)

    class Meta:
        model = Event
        fields = ('id', 'name','image_thumbnail', 'image', 'short_description', 'content', 'start_date', 'end_date', 'start_time', 'end_time', 'is_draft')

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError(_("Start day is before than End day"))
        if data['start_date'] == data['end_date'] and data['start_time'] >= data['end_time']:
            raise serializers.ValidationError(_("Start time is before than End time"))
        return data
    # override mehod update because name field is unique
    def update(self, instance, validated_data):
        if self.context['request']:
            is_clear_image = self.context['request'].data.get('is_clear_image')
            if is_clear_image == "false" and not validated_data.get('image'):
                validated_data['image'] = instance.image
        return super(EventSerializer, self).update(instance, validated_data)

class HotSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_empty_file=True)
    class Meta:
        model = Hot
        fields = ('id', 'name', 'sub_url', 'image', 'is_show')

    def update(self, instance, validated_data):
        print "instance.image", instance.image
        if self.context['request']:
            is_clear_image = self.context['request'].data.get('is_clear_image')
            if is_clear_image == "false" and not validated_data.get('image'):
                validated_data['image'] = instance.image
            elif is_clear_image == "true":
                validated_data['image'] = None
        return super(HotSerializer, self).update(instance, validated_data)

class PostImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post_Image
        fields = ('id', 'image', 'post')


    def update(self, instance, validated_data):
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        instance.post = validated_data.get('post', instance.post)
        instance.save()
        return instance

class PostSerializer(serializers.ModelSerializer):

    posts_image = PostImageSerializer( many = True, read_only = True )

    class Meta:
        model = Post
        fields = ('id','name','image' , 'posts_image','short_description', 'content', 'post_type', 'key_query', 'pin_to_top', 'is_draft')
    '''
        validate_key_query
        validate when create new post by hand
        because key_query is change value in method save() in model
        author HoangNguyen
    '''
    def validate_key_query( self, value ):
        # check is create method
        if self.instance is None:
            key_query = 'kq_' + value.replace(' ', '_')
            key_query_is_exist = Post.objects.filter( key_query = key_query )
            if key_query_is_exist:
                raise serializers.ValidationError(_('key_query is exist.'))
            return value
        return value

    def create(self, validated_data):
        # only 1 post_career has pin_to_top 
        if validated_data['pin_to_top']:
            post_career = Post.objects.filter( post_type = const.CAREERS_POST_TYPE_ID )
            post_career.update( pin_to_top = False )

        post = Post.objects.create( **validated_data )

        if self.context['request']:
            posts_image = self.context['request'].data.getlist('posts_image', None)
        if posts_image:
            for item in posts_image:
                Post_Image.objects.create( post = post, image = item )
        return post
    '''
        Event update multi image
            - Delete Post_Image which has id in list_clear_image
            - Create Post_Image in posts_image
            - Clear image of post id is_clear_image = true
    '''
    def update(self, instance, validated_data):
        if self.context['request']:
            posts_image = self.context['request'].data.getlist('posts_image', None)
            list_clear_image = self.context['request'].data.getlist('list_clear_image', None)
            is_clear_image = self.context['request'].data.get('is_clear_image')
        
        # only 1 post_career has pin_to_top 
        if validated_data['pin_to_top']:
            post_career = Post.objects.filter( post_type = const.CAREERS_POST_TYPE_ID )
            post_career.update( pin_to_top = False )

        if list_clear_image and list_clear_image[0] != '':
            convert_list = list_clear_image[0].split(',')
            Post_Image.objects.filter(id__in = convert_list).delete()
        
        if posts_image:
            for item in posts_image:
                Post_Image.objects.create( post = instance, image = item )
        if is_clear_image == "false" and not validated_data.get('image'):
            validated_data['image'] = instance.image
        return super(PostSerializer, self).update(instance, validated_data)



class PostTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post_Type
        fields = ('id', 'name', 'description')

class FAQSerializer(serializers.ModelSerializer):
    # follow models.py
    limit_category_Faq = [const.HELIO_PLAY_CATEGORY, const.HELIO_KIDS_CATEGORY, const.POWERCARD_CATEGORY,
                           const.REDEMPTION_STORE_CATEGORY, const.OTHER_PRODUCT_CATEGORY]
    question = serializers.CharField(required=True,validators=[
        UniqueValidator(
            queryset=FAQ.objects.all(),
            message =_('This question is exist.')
            )
        ])
    class Meta:
        model = FAQ
        fields = ('id', 'question', 'answer', 'category')

    def validate_category( self, value):
        if value.id in self.limit_category_Faq:
            return value
        raise serializers.ValidationError(_("This category is unvalid"))

class RolesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Roles
        fields = ('id', 'name')
        
class UserRoleDisplaySerializer(serializers.ModelSerializer):
    birth_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], required = False)
    role = RolesSerializer(many=False, required=False, read_only=False)

    class Meta:
        model = User
        fields = '__all__'

class UserCreateSerializer(serializers.ModelSerializer):
    birth_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], required = False)
    phone = serializers.CharField(max_length=11, min_length=9,required=True,validators=[
        UniqueValidator(
            queryset=User.objects.all(),
            message =_('This phone is already taken')
            )
        ])
    email = serializers.CharField(required=True, validators=[
        UniqueValidator(
            queryset = User.objects.all(),
            message = _('This email is already taken. Please, try again')
            )
        ])
    password= serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = '__all__'

    def validate_birth_date(self, value):
        if value >= datetime.now().date():
            raise serializers.ValidationError(_("Birthday must less then today"))
        return value

    def create(self, validated_data):
        user = super(UserCreateSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        
        if user.role_id == None:
            user.is_staff = False
        else:
            user.is_staff = True
        user.save()
        return user

class UserRoleSerializer(serializers.ModelSerializer):

    birth_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], required = False)
    phone = serializers.CharField(max_length=11, min_length=9,required=True,validators=[
        UniqueValidator(
            queryset=User.objects.all(),
            message =_('This phone is already taken')
            )
        ])
    email = serializers.CharField(required=True, validators=[
        UniqueValidator(
            queryset = User.objects.all(),
            message = _('This email is already taken. Please, try again')
            )
        ])
    new_password = serializers.CharField(required=False,allow_null=True, allow_blank=True)
    password = serializers.CharField(required=False,allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = '__all__'

    def validate_birth_date(self, value):
        if value >= datetime.now().date():
            raise serializers.ValidationError(_("Birthday must less then today"))
        return value

    def validate(self, data):
        new_password = data['new_password']
        is_staff = data['is_staff']
        if (is_staff == False and new_password):
            raise serializers.ValidationError(_("Cannot change password of customer user"))
        return data
            
    def update(self, instance, validated_data):

        print "instance.avatar", instance.avatar

        if self.context['request']:
            is_clear_image = self.context['request'].data.get('is_clear_image')
            if is_clear_image == "false" and not validated_data.get('avatar'):
                validated_data['avatar'] = instance.avatar
        return super(UserRoleSerializer, self).update(instance, validated_data)

class GameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = ('id', 'name', 'short_description', 'content', 'image', 'game_type', 'is_draft')

    def update(self, instance, validated_data):
        if self.context['request']:
            is_clear_image = self.context['request'].data.get('is_clear_image')
            if is_clear_image == "false" and not validated_data.get('image'):
                validated_data['image'] = instance.image
        return super(GameSerializer, self).update(instance, validated_data)

class TypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Type
        fields = ('id', 'name', 'description', 'category', 'image', 'sub_url', 'description_detail')

    def update(self, instance, validated_data):
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.category = validated_data.get('category', instance.category)
        instance.sub_url = validated_data.get('sub_url', instance.sub_url)
        instance.description_detail = validated_data.get('description_detail', instance.description_detail)
        instance.save()
        return instance

class HotAdvsSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(required=False, allow_empty_file=True)
    sub_url_register = serializers.CharField(required=False,allow_null=True, allow_blank=True)
    sub_url_view_detail = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    name = serializers.CharField(required=True, max_length=255,validators=[
        UniqueValidator(
            queryset=Hot_Advs.objects.all(),
            message =_('Hot Ads has name already exist')
            )
        ])

    class Meta:
        model = Hot_Advs
        exclude = ('created', 'modified')

    def update(self, instance, validated_data):
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        instance.name = validated_data.get('name', instance.name)
        instance.content = validated_data.get('content', instance.content)
        instance.is_register = validated_data.get('is_register', instance.is_register)
        instance.is_view_detail = validated_data.get('is_view_detail', instance.is_view_detail)
        instance.sub_url_register = validated_data.get('sub_url_register', instance.sub_url_register)
        instance.sub_url_view_detail = validated_data.get('sub_url_view_detail', instance.sub_url_view_detail)
        instance.is_draft = validated_data.get('is_draft', instance.is_draft)
        instance.save()
        return instance


class RoleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Roles
        fields = ('id', 'name')

class OpenTimeSerializer(serializers.Serializer):
    start_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], required = True, error_messages = {'invalid': _('Date is invalid.')})
    end_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], required = True, error_messages = {'invalid': _('Date is invalid.')})
    start_time = serializers.TimeField(format="%H:%M", input_formats=['%H:%M'], required = True, error_messages = {'invalid': _('Time is invalid.')})
    end_time = serializers.TimeField(format="%H:%M", input_formats=['%H:%M'], required = True, error_messages = {'invalid': _('Time is invalid.')})
    day_of_week = serializers.ListField(child=serializers.IntegerField(min_value=1, max_value=7), required = False)

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError(_("Start day is before than End day"))
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError(_("Start time is before than End time"))
        return data


    