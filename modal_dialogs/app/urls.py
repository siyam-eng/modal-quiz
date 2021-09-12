from django.urls import path
from .views import home, question_detail, result


urlpatterns = [
    path('', home, name='home'),
    path('<int:question_id>/', question_detail, name='question-detail'),
    path('result/', result, name='result')
]