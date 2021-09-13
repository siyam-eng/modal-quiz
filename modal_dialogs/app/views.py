from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Question, Options
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import QuestionSerializer, OptionsSerializer


def home(request):
    return render(request, 'app/index.html')



@api_view(['GET'])
def api_overview(request):
    endpoints = [
        'api/',
        'questions/',
        'question/<int:question_id>/',
        'result/'
    ]

    return Response({"Endpoints": endpoints})




@api_view(['GET'])
def questions_list(request):
    questions = Question.objects.all()
    options = Options.objects.all()

    question_serializer = QuestionSerializer(questions, many=True)
    options_serializers = OptionsSerializer(options, many=True)

    return Response(question_serializer.data)


@api_view(["GET"])
def question_detail(request, question_id):
    question = Question.objects.get(pk=question_id)
    options = Options.objects.filter(question=question.id)
    correct_options = Options.objects.filter(question=question.id, correct=True)

    option_texts = [option.text for option in options]
    option_texts = [""] if question.type == 'text' else option_texts
    question_detail_data = {
        "id": question.id,
        "question": question.text,
        "time_limit": question.time_limit,
        "type": question.type,
        "options": option_texts

    }

    return Response(question_detail_data)


@api_view(["POST"])
def compile_result(request):
    data_list = request.data
    required_keys = {'question_id', 'answers'}
    score = 0
    user_answers_list = []
    correct_answers_list = []

    if data_list is not list:
        Response({"ERROR": f"The data should be a list"}, status=406)

    for data in data_list:
        data_keys = set(data.keys())
        if required_keys != data_keys:
            return Response({"ERROR": f"The object should have these keys only: {required_keys}"}, status=406)

        # get the question_id and answers from the user response
        question_id = data['question_id']
        user_answers = data['answers']

        # parse the data
        try:
            question_id = int(question_id)
            user_answers = list(user_answers)
            user_answers = set([d.strip() for d in user_answers])

        except Exception as e:
            return Response({"ERROR": f"{str(e)}"})
        
        # get the question and the correct answer
        question = Question.objects.get(pk=question_id)
        correct_options = Options.objects.filter(question=question.id, correct=True)
        correct_answers = set([option.text for option in correct_options])

        # add the questions and user's answers to the result list
        user_answers_list.append({'question': question.text, 'answer': user_answers})
        # add the correct answers to the list
        correct_answers_list.append({'question': question.text, 'answer': correct_answers})
        if user_answers == correct_answers:
            score += 1

    return Response({"Result": {"Your answers": user_answers_list, "Correct Answers": correct_answers_list}, "Score": score})

