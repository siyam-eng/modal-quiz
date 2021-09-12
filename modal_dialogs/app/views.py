from django.shortcuts import render, redirect
from django.http import HttpResponse, response
from .models import Question, Options

total_score = 0

# home
def home(request):
    questions = Question.objects.all()
    options = [question.get_options() for question in questions]
    return render(request, 'app/index.html', context={'questions': questions})


def question_detail(request, question_id):
    question = Question.objects.get(pk=question_id)
    correct_answers = Options.objects.filter(question=question_id, correct=True)
    correct_values = set([answer.text for answer in correct_answers])

    if request.method == 'GET':
        return render(request, 'app/question.html', context={'question': question})
    
    elif request.method == 'POST':
        global total_score
        score = int(handle_input(request, correct_values))
        total_score += score
        return render(request, 'app/question.html', context={'question': question, 'score': score})
        # return render(request, 'app/question.html', context={'score': score})


def result(request):
    global total_score
    score = total_score
    total_score = 0
    return HttpResponse(score)

def handle_input(request, correct_values):
    answer = dict(request.POST).get('answer')
    if answer:
        # remove extra spaces if any
        answer = [a.strip() for a in answer]
        return correct_values == set(answer)
    return False
    
