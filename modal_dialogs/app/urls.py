from django.urls import path
from .views import questions_list, question_detail, compile_result, api_overview, home


urlpatterns = [
    path('', home, name='home'),
    path('api/', api_overview, name='api-overview'),
    path('questions/', questions_list, name='questions-list'),
    path('questions/<int:question_id>/', question_detail, name='question-detail'),
    path('result/', compile_result, name='compile-result'),
]