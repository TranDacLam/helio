from modeltranslation.translator import translator, TranslationOptions
from models import *

class CategoryTranslationOptions(TranslationOptions):
    fields = ('name', )

translator.register(Category, CategoryTranslationOptions)

class TypeTranslationOptions(TranslationOptions):
    fields = ('name', )

translator.register(Type, TypeTranslationOptions)

# Posts
class PostTypeTranslationOptions(TranslationOptions):
    fields = ('name', )

translator.register(Post_Type, PostTypeTranslationOptions)

class PostsTranslationOptions(TranslationOptions):
    fields = ('name', 'short_description', 'content', )

translator.register(Post, PostsTranslationOptions)

# Events
class EventsTranslationOptions(TranslationOptions):
    fields = ('name', 'content', )

translator.register(Event, EventsTranslationOptions)

# Games

class GameTranslationOptions(TranslationOptions):
    fields = ('name', 'short_description', 'content', )

translator.register(Game, GameTranslationOptions)


# Entertainments
class EntertainmentsAdminTranslationOptions(TranslationOptions):
    fields = ('name', 'short_description', 'content', )

translator.register(Entertainment, EntertainmentsAdminTranslationOptions)

# FAQs
class FAQsTranslationOptions(TranslationOptions):
    fields = ('question', 'answer', )

translator.register(FAQ, FAQsTranslationOptions)

# Hots
class HotTranslationOptions(TranslationOptions):
    fields = ( )
    
translator.register(Hot, HotTranslationOptions)

class BannerTranslationOptions(TranslationOptions):
    fields = ( )
    
translator.register(Banner, BannerTranslationOptions)

class PromotionTranslationOptions(TranslationOptions):
    fields = ('name', 'short_description', 'content' )
    
translator.register(Promotion, BannerTranslationOptions)
