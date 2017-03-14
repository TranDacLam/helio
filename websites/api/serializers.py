from rest_framework import serializers
from core.models import *


class HotsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    sub_url = serializers.CharField(max_length=1000)
    image = serializers.ImageField(max_length=1000)
    is_show = serializers.BooleanField()


class GameFilterSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=1000)
    description = serializers.CharField()


class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=1000)
    description = serializers.CharField()

class GameTypeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=1000)

class GameSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=2000)
    short_description = serializers.CharField()
    content = serializers.CharField()
    image = serializers.ImageField(max_length=1000)
    game_type = GameTypeSerializer(many=False)
    category = CategorySerializer(many=False)

class GameDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=2000)
    short_description = serializers.CharField()
    content = serializers.CharField()
    image = serializers.ImageField(max_length=1000)
    
class FAQsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    question = serializers.CharField(max_length=1000)
    answer = serializers.CharField()

class EntertainmentsTypeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=1000)

class EntertainmentsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=2000)
    image = serializers.ImageField(max_length=1000)
    short_description = serializers.CharField()
    content = serializers.CharField()
    location = serializers.CharField(max_length=250)
    appropriate = serializers.CharField(max_length=500)
    entertainments_type = EntertainmentsTypeSerializer(many=False)
    category = CategorySerializer(many=False)
  
class EntertainmentDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=2000)
    image = serializers.ImageField(max_length=1000)
    short_description = serializers.CharField()
    content = serializers.CharField()
    location = serializers.CharField(max_length=250)
    appropriate = serializers.CharField(max_length=500)
    entertainments_type = EntertainmentsTypeSerializer(many=False)  


class EventFilterSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=1000)
    description = serializers.CharField()

class EventsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=1000)
    image = serializers.ImageField(max_length=1000)
    # short_description = serializers.CharField()
    content = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()

class PostTypeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=1000)

class PostsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=2000)
    key_query = serializers.CharField(max_length=500)
    image = serializers.ImageField(max_length=1000)
    short_description = serializers.CharField()
    content = serializers.CharField()
    post_type = PostTypeSerializer(many=False)





