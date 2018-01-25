from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from core.models import *
from core.custom_models import *
from django.contrib.auth import get_user_model



class HotsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    sub_url = serializers.CharField(max_length=1000)
    image = serializers.ImageField(max_length=1000)
    is_show = serializers.BooleanField()


class UserSerializer(serializers.ModelSerializer):

	class Meta:
		model = User
		fields=('full_name', 'email', 'phone','birth_date', 'personal_id', 'address')

	def update(self, instance, validated_data):
		instance.full_name = validated_data.get('full_name', instance.full_name)
		instance.email = validated_data.get('email', instance.email)
		instance.phone = validated_data.get('phone', instance.phone)
		instance.birth_date = validated_data.get('birth_date', instance.birth_date)
		instance.personal_id = validated_data.get('personal_id', instance.personal_id)
		instance.address = validated_data.get('address', instance.address)
		instance.save()
		return instance


