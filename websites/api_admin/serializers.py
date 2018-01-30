from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from core.models import *
from core.custom_models import *
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields=('id' ,'full_name', 'email', 'phone','birth_date', 'personal_id', 'address')

    def update(self, instance, validated_data):
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.personal_id = validated_data.get('personal_id', instance.personal_id)
        instance.address = validated_data.get('address', instance.address)
        instance.save()
        return instance

class PromotionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion
        fields=('id', 'name', 'image', 'image_thumbnail', 'apply_date', 'end_date', 'is_draft', 'created')

class AdvertisementSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Advertisement
        fields = ('id', 'name', 'is_show')

class PromotionLabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion_Label
        fields= ('id', 'name')

class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields=('id', 'subject', 'image', 'sub_url', 'category', 'sent_date', 'sent_user', 'is_draft', 'location')

    def update(self, instance, validated_data):
        instance.subject = validated_data.get('subject', instance.subject)
        instance.sub_url = validated_data.get('sub_url', instance.sub_url)
        instance.category = validated_data.get('category', instance.category)
        instance.sent_date = validated_data.get('sent_date', instance.sent_date)
        instance.sent_user = validated_data.get('sent_user', instance.sent_user)
        instance.is_draft = validated_data.get('is_draft', instance.is_draft)
        instance.location = validated_data.get('location', instance.location)
        instance.save()
        return instance

