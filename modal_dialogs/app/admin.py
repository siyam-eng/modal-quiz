from django.contrib import admin
from .models import Question, Options


class OptionsInline(admin.TabularInline):
    model = Options


class QuestionAdmin(admin.ModelAdmin):
    inlines = [OptionsInline]


# Register your models here.
admin.site.register(Question, QuestionAdmin)
admin.site.register(Options)