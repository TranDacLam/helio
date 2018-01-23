from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from core.models import *
from django.contrib.auth import get_user_model



class HotsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    sub_url = serializers.CharField(max_length=1000)
    image = serializers.ImageField(max_length=1000)
    is_show = serializers.BooleanField()