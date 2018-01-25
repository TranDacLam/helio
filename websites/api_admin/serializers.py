from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from core.models import *
from django.contrib.auth import get_user_model



class UsersSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField(max_length=255)
    full_name = serializers.CharField(max_length=255)
    birth_date = serializers.CharField(max_length=255)
    email = serializers.CharField(max_length=255)
    barcode = serializers.CharField(max_length=255)


class PromotionsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)

    