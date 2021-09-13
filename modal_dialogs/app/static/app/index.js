const root = document.getElementById('root');
// const questionBody = document.getElementById('question1');
const submitQuizBtn = document.getElementById('submitQuiz');
let totalScore = 0;

// const questions = fetch('http://127.0.0.1:8000/questions')
//                     .then(response => response.json())
//                     .then(data => console.log(data))



async function main(){
    const questionIds = [];
    const questionTexts = [];

    const response = await fetch('http://127.0.0.1:8000/questions');
    const jsonResponse = await response.json();



    const questions = await jsonResponse;
    questions.forEach(element => {
        questionIds.push(element.id);
        questionTexts.push(element.text);
    });

    // add to html
    // questions.forEach(e => questionBody.innerHTML += `<p>${e.text}</p>`);

    // add the detail questions to the list
    questionIds.forEach(async (questionId, index) => {
        const question = await getQeustion(questionId);
        const modalTitle = document.getElementById(`exampleModalToggleLabel${index + 1}`)
        const formBody = document.getElementById(`form-${index + 1}`)

        // set the question as the modal title
        modalTitle.innerHTML = question.question;

        question.options.forEach(option => {
           formBody.innerHTML += `
           <div>
           <input type="${question.type}" id="${option}" name="${question.id}" value="${option}">
           <label for="${option}">${option}</label>
           </div>
           `
       });

       // get the results
       const submitBtn = document.getElementById(`submit-${index + 1}`)
       
       formBody.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(formBody);
            const userAnswer = formData.getAll(question.id);
            const requestData = [{question_id: question.id, answers: userAnswer}]
            // console.log(requestData)
            const resultResponse = getResult(requestData)
                                            .then(data => {
                                                const score = data.Score;
                                                totalScore += score;
                                                alert(`Your score ${score}`);
                                                // root.innerHTML = `Your score ${score}`;

                                            });
       });

       
    });
    
    alert(totalScore)
}


async function getResult(requestData){
    const response = await fetch("http://127.0.0.1:8000/result/", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData) 
      });

      return response.json(requestData); // parses JSON response into native JavaScript objects
}

// getResult(1, ['2', '6', '5']).then(data => console.log(data));


// request the detail view and get the question
async function getQeustion(questionId){
    const response = await fetch(`http://127.0.0.1:8000/questions/${questionId}`);
    const json = await response.json();

    const question = await json;

    return question;
}

// automatically submit the quiz after 5 seconds
// const startBtn = document.getElementById('startBtn');
// startBtn.addEventListener('click', (e) => {

// })

const timers = document.querySelectorAll('.timer')

for(let i = 0; i < 3; i++){
    const submitBtn = document.getElementById(`submit-${i}`);
    const nextBtn = document.getElementById(`submit-${i + 1}`)
    console.log(submitBtn);
    let seconds = 5;

    submitBtn.addEventListener('click', (e) => {
        const timer = setInterval(() => {
            timers[i].innerHTML = seconds;
            
            seconds -= 1;
            if (seconds === 0){
                nextBtn.click();
                clearInterval(timer);
                seconds += 5;
            }
        }, 1000)
    })

}


main()



