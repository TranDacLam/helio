from modeltranslation.translator import translator, TranslationOptions
from models import *

class CategoryTranslationOptions(TranslationOptions):
    fields = ('name', )

translator.register(Category, CategoryTranslationOptions)

# Posts
class PostTypeTranslationOptions(TranslationOptions):
    fields = ('name', )

translator.register(Post_Type, PostTypeTranslationOptions)

class PostsTranslationOptions(TranslationOptions):
    fields = ('name', 'short_description', 'content', )

translator.register(Post, PostsTranslationOptions)

# Events
class EventFilterTranslationOptions(TranslationOptions):
    fields = ('name', )

translator.register(Event_Filter, EventFilterTranslationOptions)

class EventsTranslationOptions(TranslationOptions):
    fields = ('name', 'content', )

translator.register(Event, EventsTranslationOptions)

# Games
class GameTypeTranslationOptions(TranslationOptions):
    fields = ('name', )

translator.register(Game_Type, GameTypeTranslationOptions)

class GameFilterTranslationOptions(TranslationOptions):
    fields = ('name', )

translator.register(Game_Filter, GameFilterTranslationOptions)

class GameTranslationOptions(TranslationOptions):
    fields = ('name', 'short_description', 'content', )

translator.register(Game, GameTranslationOptions)


# Entertainments
class EntertainmentsTypeTranslationOptions(TranslationOptions):
    fields = ('name', )

translator.register(Entertainments_Type, EntertainmentsTypeTranslationOptions)

class EntertainmentsFilterTranslationOptions(TranslationOptions):
    fields = ('name', )

translator.register(Entertainments_Filter, EntertainmentsFilterTranslationOptions)

class EntertainmentsAdminTranslationOptions(TranslationOptions):
    fields = ('name', 'short_description', 'content', )

translator.register(Entertainment, EntertainmentsAdminTranslationOptions)

# FAQs
class FAQsTranslationOptions(TranslationOptions):
    fields = ('question', 'answer', )

translator.register(FAQ, FAQsTranslationOptions)

# Hots
class HotsTranslationOptions(TranslationOptions):
    fields = ( )
    
translator.register(Hot, HotsTranslationOptions)

