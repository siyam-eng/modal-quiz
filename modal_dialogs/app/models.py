from django.db import models

TYPE_CHOICES = (
    ('checkbox', 'checkbox'),
    ('radio', 'radio'),
    ('text', 'text'),
)

# Create your models here.
class Question(models.Model):
    text = models.CharField(max_length=200)
    time_limit = models.IntegerField(default=5)
    type = models.CharField(max_length=8, choices=TYPE_CHOICES, default=('checkbox', 'checkbox'))
    date_created = models.DateTimeField(auto_now=True)


    def get_options(self):
        return self.options_set.all()

    def __str__(self):
        return f"Question: {self.text}"


class Options(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=20)
    correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Question: {self.question.text} Answer: {self.text} Correct: {self.correct}"
        

    class Meta:
        verbose_name_plural = 'Options'