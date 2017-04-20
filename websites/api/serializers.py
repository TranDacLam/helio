from rest_framework import serializers
from core.models import *


class HotsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    sub_url = serializers.CharField(max_length=1000)
    image = serializers.ImageField(max_length=1000)
    is_show = serializers.BooleanField()


class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    description = serializers.CharField()


class TypeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    description = serializers.CharField()
    category = CategorySerializer(many=False)


class GameSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    short_description = serializers.CharField()
    image = serializers.ImageField(max_length=1000)
    game_type = TypeSerializer(many=False)


class GameDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    short_description = serializers.CharField()
    content = serializers.CharField()
    image = serializers.ImageField(max_length=1000)


class FAQsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    question = serializers.CharField(max_length=255)
    answer = serializers.CharField()
    category = CategorySerializer(many=False)


class EntertainmentDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=2000)
    short_description = serializers.CharField()
    content = serializers.CharField()
    image1 = serializers.ImageField(max_length=1000)
    image2 = serializers.ImageField(max_length=1000)
    image3 = serializers.ImageField(max_length=1000)
    image4 = serializers.ImageField(max_length=1000)
    image5 = serializers.ImageField(max_length=1000)
    image6 = serializers.ImageField(max_length=1000)
    category = CategorySerializer(many=False)


class EventsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    image = serializers.ImageField(max_length=1000)
    short_description = serializers.CharField(max_length=350)
    content = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()


class PostTypeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    description = models.TextField()


class PostImageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    image = serializers.CharField(max_length=1000)


class PostsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    key_query = serializers.CharField(max_length=255)
    image = serializers.ImageField(max_length=1000)
    short_description = serializers.CharField(max_length=350)
    content = serializers.CharField()
    posts_image = PostImageSerializer(many=True)
    post_type = PostTypeSerializer(many=False)


class PromotionsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    short_description = serializers.CharField(max_length=350)
    content = serializers.CharField()
    image = serializers.ImageField(max_length=1000)
    promotion_type = TypeSerializer(many=False)


class TransactionTypeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
