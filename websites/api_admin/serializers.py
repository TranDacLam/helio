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

    birth_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], allow_null = True)

    class Meta:
        model = User
        fields=('id' ,'full_name', 'email', 'phone','barcode','birth_date', 'personal_id', 'address', 'username_mapping', 'date_mapping')

    def update(self, instance, validated_data):
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.personal_id = validated_data.get('personal_id', instance.personal_id)
        instance.address = validated_data.get('address', instance.address)
        instance.save()
        return instance


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
    # image = Base64ImageField(
    #     max_length=None, use_url=True,
    # )
    class Meta:
        model = Promotion
        fields = '__all__'
from rest_framework.fields import CurrentUserDefault

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
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        image_thumbnail = validated_data.get('image_thumbnail', instance.image_thumbnail)
        if image_thumbnail:
            instance.image_thumbnail = image_thumbnail

        # Is this promotion change from draft to public then set user
        if instance.is_draft and not validated_data.get('is_draft'):
            instance.user_implementer = self.context['request'].user

        # print is_draft, instance.is_draft

        # if promotion_type_data:
        #     print promotion_type_data
        #     promotion_type = Promotion_Type.objects.get_or_create(**promotion_type_data)[0]
        #     validated_data['promotion_type'] = promotion_type

        instance.name = validated_data.get('name', instance.name)
        instance.short_description = validated_data.get('short_description', instance.short_description)
        instance.content = validated_data.get('content', instance.content)
        instance.promotion_category = validated_data.get('promotion_category', instance.promotion_category)
        instance.promotion_label = validated_data.get('promotion_label', instance.promotion_label)
        instance.promotion_type = validated_data.get('promotion_type', instance.promotion_type)
        instance.apply_date = validated_data.get('apply_date', instance.apply_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.is_draft = validated_data.get('is_draft', instance.is_draft)
        instance.save()
        return instance


class AdvertisementSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Advertisement
        fields = ('id', 'name', 'is_show')

class DenominationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Denomination
        fields = ('id', 'denomination')

class FeedBackSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeedBack
        fields = ('id', 'name', 'email', 'phone', 'subject', 'message', 'rate', 'sent_date', 'feedback_type', 'status','answer', 'created')     

class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields= '__all__'

    def update(self, instance, validated_data):
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        instance.subject = validated_data.get('subject', instance.subject)
        instance.sub_url = validated_data.get('sub_url', instance.sub_url)
        instance.category = validated_data.get('category', instance.category)
        instance.location = validated_data.get('location', instance.location)
        instance.is_QR_code = validated_data.get('is_QR_code', instance.is_QR_code)
        instance.message = validated_data.get('message', instance.message)
        instance.promotion = validated_data.get('promotion', instance.promotion)
        instance.save()
        return instance

class UserEmbedSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=True)
    birth_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], required=True)
    personal_id = serializers.IntegerField(required=True)
    email = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    phone = serializers.IntegerField(required=True)
    barcode = serializers.IntegerField(required=True)

    def validate_birth_date(self, value):
        if value >= datetime.now().date():
            raise serializers.ValidationError("Birthday must less then today")
        return value

class FeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Fee
        exclude = ('created', 'modified')


class BannerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Banner
        fields = ('id', 'image', 'sub_url', 'position', 'is_show')

    def update(self, instance, validated_data):
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        instance.sub_url = validated_data.get('sub_url', instance.sub_url)
        instance.position = validated_data.get('position', instance.position)
        instance.is_show = validated_data.get('is_show', instance.is_show)
        instance.save()
        return instance



class CategoryNotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Category_Notification
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):

    start_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], required = True)
    end_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], required =  True)

    class Meta:
        model = Event
        fields = ('id', 'name', 'image', 'short_description', 'content', 'start_date', 'end_date', 'start_time', 'end_time', 'is_draft')

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start day is before than End day")
        if data['start_date'] == data['end_date'] and data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("Start time is before than End time")
        return data
    # override mehod update because name field is unique
    def update(self, instance, validated_data):
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        instance.name = validated_data.get('name', instance.name)
        instance.short_description = validated_data.get('short_description', instance.short_description)
        instance.content = validated_data.get('content', instance.content)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.start_time = validated_data.get('start_time', instance.start_time)
        instance.end_time = validated_data.get('end_time', instance.end_time)
        instance.is_draft = validated_data.get('is_draft', instance.is_draft)
        instance.save()
        return instance

class HotSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hot
        fields = ('id', 'name', 'sub_url', 'image', 'is_show')

    def update(self, instance, validated_data):
        
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        instance.name = validated_data.get('name', instance.name)
        instance.sub_url = validated_data.get('sub_url', instance.sub_url)
        instance.is_show = validated_data.get('is_show', instance.is_show)
        instance.save()
        return instance

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

    posts_image = PostImageSerializer( many = True )

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
                raise serializers.ValidationError('key_query is exist.')
            return value
        return value

    def create(self, validated_data):
        posts_image = validated_data.pop('posts_image')
        post = Post.objects.create( **validated_data )
        for item in posts_image:
            Post_Image.objects.create( post = post, **item )
        return post

    def update(self, instance, validated_data):
        # to do
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        instance.name = validated_data.get('name', instance.name)
        instance.short_description = validated_data.get('short_description', instance.short_description)
        instance.content = validated_data.get('content', instance.content)
        instance.post_type = validated_data.get('post_type', instance.post_type)
        instance.key_query = validated_data.get('key_query', instance.key_query)
        instance.pin_to_top = validated_data.get('pin_to_top', instance.pin_to_top)
        instance.is_draft = validated_data.get('is_draft', instance.is_draft)
        instance.save()

        return instance



class PostTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post_Type
        fields = ('id', 'name', 'description')

class FAQSerializer(serializers.ModelSerializer):
    # follow models.py
    limit_category_Faq = [const.HELIO_PLAY_CATEGORY, const.HELIO_KIDS_CATEGORY, const.POWERCARD_CATEGORY,
                           const.REDEMPTION_STORE_CATEGORY, const.OTHER_PRODUCT_CATEGORY]
    
    class Meta:
        model = FAQ
        fields = ('id', 'question', 'answer', 'category')

    def validate_category( self, value):
        if value.id in self.limit_category_Faq:
            return value
        raise serializers.ValidationError("This category is unvalid")

class RolesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Roles
        fields = ('id', 'name')
        
class UserRoleDisplaySerializer(serializers.ModelSerializer):

    role = RolesSerializer(many=False, required=False, read_only=False)

    class Meta:
        model = User
        fields = '__all__'

class UserRoleSerializer(serializers.ModelSerializer):

    birth_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y'], required = False)
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(max_length=11, min_length=9, validators=[UniqueValidator(queryset=User.objects.all())])
    

    class Meta:
        model = User
        fields = '__all__'

    def validate_birth_date(self, value):
        if value >= datetime.now().date():
            raise serializers.ValidationError("Birthday must less then today")
        return value

    def create(self, validated_data):
        user = super(UserRoleSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        if user.role_id == 6:
            user.is_staff = False
        else:
            user.is_staff = True
        user.save()
        return user
            
    def update(self, instance, validated_data):

        avatar = validated_data.get('avatar', instance.avatar)
        if avatar:
            instance.avatar = avatar
        instance.email = validated_data.get('email', instance.email)
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.personal_id = validated_data.get('personal_id', instance.personal_id)
        instance.country = validated_data.get('country', instance.country)
        instance.city = validated_data.get('city', instance.city)
        instance.address = validated_data.get('address', instance.address)
        instance.set_password(validated_data['password'])
        instance.role = validated_data.get('role', instance.role)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        if instance.role_id == 6:
            instance.is_staff = False
        else:
            instance.is_staff = True
        instance.save()
        return instance


class GameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = ('id', 'name', 'short_description', 'content', 'image', 'game_type', 'is_draft')

    def update(self, instance, validated_data):
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        instance.name = validated_data.get('name', instance.name)
        instance.short_description = validated_data.get('short_description', instance.short_description)
        instance.content = validated_data.get('content', instance.content)
        instance.game_type = validated_data.get('game_type', instance.game_type)
        instance.is_draft = validated_data.get('is_draft', instance.is_draft)
        instance.save()
        return instance

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

