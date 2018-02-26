from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from core.models import *
from core.custom_models import *
from django.contrib.auth import get_user_model
from datetime import datetime
from rest_framework.response import Response
from rest_framework import status
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
    promotion_type = PromotionTypeSerializer(many=False, required=False)
    class Meta:
        model = Promotion
        fields = '__all__'

    def update(self, instance, validated_data):
        print validated_data['promotion_type']
        instance.save()
        return Response(status=status.HTTP_202_ACCEPTED)

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

    class Meta:
        model = Event
        fields = '__all__'

