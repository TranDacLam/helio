from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from core.models import *
from core.custom_models import *
from django.contrib.auth import get_user_model
from datetime import datetime
import core.constants as const

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

class PromotionSerializer(serializers.ModelSerializer):
    apply_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], allow_null = True)
    end_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], allow_null = True)
    class Meta:
        model = Promotion
        fields = '__all__'

    # def validate(self, data):
    #     if data['apply_date'] > data['end_date']:
    #         raise serializers.ValidationError("Apply Date must be less than End Date")
    #     return data

    def create(self, validated_data):
        print "CREATE"
        return Promotion(**validated_data)
    def update(self, instance, validated_data):
        image = validated_data.get('image', instance.image)
        if image:
            instance.image = image
        image_thumbnail = validated_data.get('image_thumbnail', instance.image_thumbnail)
        if image_thumbnail:
            instance.image_thumbnail = image_thumbnail

        # is_draft = validated_data.get('is_draft', True)

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
        fields=('id', 'subject', 'image', 'sub_url', 'category', 'sent_date', 'sent_user', 'is_draft', 'location', 'is_QR_code', 'message')

class UserEmbedSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=True)
    birth_date = serializers.DateField(required=True)
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

    image = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Banner
        fields = ('id', 'image', 'sub_url', 'position')

class CategoryNotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Category_Notification
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):

    start_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], required = True)
    end_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], required =  True)

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

class PostSerializer(serializers.ModelSerializer):

    post_type = serializers.SlugRelatedField(queryset = Post_Type.objects.all(), read_only=False, slug_field = 'name' )

    class Meta:
        model = Post
        fields = ('id','name' , 'image','short_description', 'content', 'post_type', 'key_query', 'pin_to_top', 'is_draft')

    def update(self, instance, validated_data):
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
