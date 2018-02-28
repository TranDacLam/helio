from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from core.models import *
from core.custom_models import *
from django.contrib.auth import get_user_model
from datetime import datetime

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

class PromotionTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion_Type
        fields = ('id', 'name')

class PromotionLabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion_Label
        fields= ('id', 'name')


class PromotionSerializer(serializers.ModelSerializer):
    promotion_type = PromotionTypeSerializer(many=False, required=False, read_only=False)
    apply_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], allow_null = True)
    end_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], allow_null = True)
    class Meta:
        model = Promotion
        fields = '__all__'

    def validate(self, data):
        if data['apply_date'] > data['end_date']:
            raise serializers.ValidationError("Apply Date must be less than End Date")
        return data

    def update(self, instance, validated_data):

        promotion_type_data = validated_data.pop('promotion_type', None)
        if promotion_type_data:
            promotion_type = Promotion_Type.objects.get_or_create(**promotion_type_data)[0]
            validated_data['promotion_type'] = promotion_type

        # return Promotion.objects.create(**validated_data)

        instance.name = validated_data.get('name', instance.name)
        instance.image = validated_data.get('image', instance.image)
        instance.image_thumbnail = validated_data.get('image_thumbnail', instance.image_thumbnail)
        instance.short_description = validated_data.get('short_description', instance.short_description)
        instance.content = validated_data.get('content', instance.content)
        instance.promotion_category = validated_data.get('promotion_category', instance.promotion_category)
        instance.promotion_label = validated_data.get('promotion_label', instance.promotion_label)

        instance.promotion_type = validated_data.get('promotion_type', instance.promotion_type)

        print instance.promotion_type
        instance.apply_date = validated_data.get('apply_date', instance.apply_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)


        print "validated_data['promotion_type']", validated_data['promotion_type']
        # PromotionTypeSerializer
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
        fields = ('id', 'name')


class EventSerializer(serializers.ModelSerializer):

    start_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], required = True)
    end_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'], required =  True)

    class Meta:
        model = Event
        fields = ('name', 'image', 'short_description', 'content', 'start_date', 'end_date', 'start_time', 'end_time', 'is_draft')

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start day is before than End day")
        if data['start_date'] == data['end_date'] and data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("Start time is before than End time")
        return data
    # override mehod update because name field is unique
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.image = validated_data.get('image', instance.image)
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

class PostSerializer(serializers.ModelSerializer):

    post_type = serializers.SlugRelatedField(queryset = Post_Type.objects.all(), read_only=False, slug_field = 'name' )

    class Meta:
        model = Post
        fields = ('name' , 'image','short_description', 'content', 'post_type', 'key_query', 'pin_to_top', 'is_draft')