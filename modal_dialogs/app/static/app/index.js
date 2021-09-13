const root = document.getElementById("root");
// const questionBody = document.getElementById('question1');
const submitQuizBtn = document.getElementById("submitQuiz");
const timeLimit = 6;
let totalScore = 0;
let submitedAnswers = [];

// const questions = fetch('http://127.0.0.1:8000/questions')
//                     .then(response => response.json())
//                     .then(data => console.log(data))

async function main() {
  const questionIds = [];
  const questionTexts = [];

  const response = await fetch("http://127.0.0.1:8000/questions");
  const jsonResponse = await response.json();

  const questions = await jsonResponse;
  questions.forEach((element) => {
    questionIds.push(element.id);
    questionTexts.push(element.text);
  });

  // add to html
  // questions.forEach(e => questionBody.innerHTML += `<p>${e.text}</p>`);

  // add the detail questions to the list
  questionIds.forEach(async (questionId, index) => {
    const question = await getQeustion(questionId);
    const modalTitle = document.getElementById(
      `exampleModalToggleLabel${index + 1}`
    );
    const formBody = document.getElementById(`form-${index + 1}`);

    // set the question as the modal title
    modalTitle.innerHTML = question.question;

    question.options.forEach((option) => {
      formBody.innerHTML += `
           <div>
           <input type="${question.type}" id="${option}" name="${question.id}" value="${option}">
           <label for="${option}">${option}</label>
           </div>
           `;
    });

    // get the results
    const autoBtn = document.getElementById(`auto-${index + 1}`);

    formBody.addEventListener("submit", async (event) => {
      event.preventDefault();
      submitedAnswers.push(index + 1);
      const formData = new FormData(formBody);
      const userAnswer = formData.getAll(question.id);
      const requestData = [{ question_id: question.id, answers: userAnswer }];
      // console.log(requestData)
      const resultResponse = await getResult(requestData).then((data) => {
        const score = data.Score;
        totalScore += score;

        alert(`Your score ${score}`);
        // root.innerHTML = `Your score ${score}`;
        autoBtn.click();
      });
      // show the total score
      index === 2
        ? setTimeout(() => {
            alert(`Your total score: ${totalScore}`);
            // reload after showing the result
            setTimeout(() => location.reload(), 300);
          }, 500)
        : null;
    });
  });
}

async function getResult(requestData) {
  const response = await fetch("http://127.0.0.1:8000/result/", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  return response.json(requestData); // parses JSON response into native JavaScript objects
}

// getResult(1, ['2', '6', '5']).then(data => console.log(data));

// request the detail view and get the question
async function getQeustion(questionId) {
  const response = await fetch(`http://127.0.0.1:8000/questions/${questionId}`);
  const json = await response.json();

  const question = await json;

  return question;
}

// automatically submit the quiz after 5 seconds
// const startBtn = document.getElementById('startBtn');
// startBtn.addEventListener('click', (e) => {

// })

const timers = document.querySelectorAll(".timer");

for (let i = 0; i < 3; i++) {
  const autoBtn = document.getElementById(`auto-${i}`);
  const nextBtn = document.getElementById(`auto-${i + 1}`);
  const submitBtn = document.getElementById(`submit-${i + 1}`);
  //   console.log(submitBtn);
  let seconds = timeLimit;

  autoBtn.addEventListener("click", (e) => {
    const timer = setInterval(() => {
      timers[i].innerHTML = seconds;

      
      if (seconds === 0) {
        // do not show the time up alert for submited answers
        if (!submitedAnswers.includes(i + 1)){
          alert(`Time Up! Your score: 0`);
          nextBtn.click();

          if(i === 2){
          // if the user does not answer the last question, show the total score
          alert(`Total Score: ${totalScore}`)
          // reload the page to remove previous inputs
          setTimeout(() => location.reload(), 300);
          }
        }
        clearInterval(timer);
        seconds += timeLimit;
      }
      // deduct 1 second
      seconds -= 1;
    }, 1000);
  });
}

// call the main function
main();
