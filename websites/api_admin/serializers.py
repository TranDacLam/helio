from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from core.models import *
from core.custom_models import *
from django.contrib.auth import get_user_model
from datetime import datetime

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


	# create objects
	# def create(self, validated_data):
	# 	user = User.objects.create( **validated_data )
	# 	return user

	# custom method save value in serializer
	# def save(self):
	# 	email = self.validated_data['email']
	# 	message = self.validated_data['full_name']
	


class PromotionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion
        fields=('id', 'name', 'image', 'image_thumbnail', 'apply_date', 'end_date', 'is_draft', 'created', 'promotion_label', 'promotion_type')

class AdvertisementSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Advertisement
        fields = ('id', 'name', 'is_show')

class PromotionLabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion_Label
        fields= ('id', 'name')

class PromotionTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion_Type
        fields = ('id', 'name')

class DenominationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Denomination
        fields = ('id', 'denomination')
        
class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields=('id', 'subject', 'image', 'sub_url', 'category', 'sent_date', 'sent_user', 'is_draft', 'location', 'is_QR_code')

class UserEmbedSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=True)
    birthday = serializers.DateField(required=True)
    personal_id = serializers.IntegerField(required=True)
    email = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    phone = serializers.IntegerField(required=True)
    barcode = serializers.IntegerField(required=True)

    def validate_birthday(self, value):
        if value >= datetime.now().date():
            raise serializers.ValidationError("Birthday must less then today")
        return value

