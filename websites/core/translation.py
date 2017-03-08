from modeltranslation.translator import translator, TranslationOptions
from models import Posts, Post_Type, Game

class PostsTranslationOptions(TranslationOptions):
    fields = ('name', 'short_description', 'content', )

translator.register(Posts, PostsTranslationOptions)


class GameTranslationOptions(TranslationOptions):
    fields = ('name', 'short_description', 'content', )

translator.register(Game, GameTranslationOptions)
