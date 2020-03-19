// Questions
const data = [
    {
        prompt: 'What color is a banana?',
        answers: [
            'Bank',
            'Manamana',
            'Blue',
            'Yellow'
        ],
        correctIndex: 3
    }, {
        prompt: 'Do you like this quiz?',
        answers: [
            'Yes',
            'No'
        ],
        correctIndex: 0
    }
];


// Question
class Question {
    constructor(data) {
        this.prompt         = data.prompt;
        this.answers        = data.answers;
        this.correctIndex   = data.correctIndex;
    }

    // Check Answer of Question
    checkAnswer(index) {
        return index === this.correctIndex;
    }

    // For each Answer of Question
    forEachAnswer(callback, context) {
        this.answers.forEach(callback, context);
    }
}


// Init Quiz
class Quiz {
    constructor(data) {
    this.numberCorrect  = 0;
    this.counter        = 0;
    this.questions      = [];

    this.addQuestions(data);
    }

    // Add Questions to quiz
    addQuestions(data) {
        for (let i = 0; i < data.length; i++) {
            this.questions.push(new Question(data[i]));
        }
    }

    // Advance Question in quiz
    advanceQuestion(lastAnswer) {
        if (this.currentQuestion && this.currentQuestion.checkAnswer(lastAnswer)) {
            this.numberCorrect++;
        }

        this.currentQuestion = this.questions[this.counter++];

        return this.currentQuestion;
    }
}


// Quiz App
class QuizApp {
    constructor(data) {
        this.data = data;
        this.introView      = new IntroView('#quiz-intro', this);
        this.outroView      = new OutroView('#quiz-outro', this);
        this.questionView   = new QuestionView('#quiz-form', this);

        this.introView.attachEventHandlers();
        this.outroView.attachEventHandlers();
        this.questionView.attachEventHandlers();
    }

    // Start Quiz
    startQuiz() {
        this.quiz = new Quiz(this.data);

        this.introView.toggle(true);
        this.outroView.toggle(true);
        this.questionView.toggle(false);

        this.nextQuestion();
    }

    // Go to next Question
    nextQuestion(answer) {
        const nextQuestion = this.quiz.advanceQuestion(answer);

        if (nextQuestion) {
            this.questionView.setQuestion(nextQuestion);
        } else {
            this.endQuiz();
        }
    }

    // End Quiz
    endQuiz() {
        this.questionView.toggle(true);
        this.outroView.toggle(false);

        this.outroView.displayOutroMessage(this.quiz.numberCorrect, this.quiz.questions.length);
    }
}


// Introduction
class IntroView {
    constructor(selector) {
        this.element        = document.querySelector(selector);
        this.startButton    = this.element.querySelector('.start-button');
    }

    // Attach Event handlers in Introduction
    attachEventHandlers() {

        this.startButton.onclick = function() {
            quizApp.startQuiz();
        };
    }

    // Hide Introduction
    toggle(hide) {
        this.element.classList.toggle('hidden', hide);
    }
}


// Outro
class OutroView {
    constructor(selector) {
        this.element        = document.querySelector(selector);
        this.resetButton    = this.element.querySelector('.reset-button');
        this.outroMessage   = this.element.querySelector('.quiz-outro-message');
    }

    // Display the Outro message
    displayOutroMessage(numberCorrect, totalQuestions) {
        const message = `You got ${numberCorrect} questions right out of
        ${totalQuestions}. Would you like to try again?`;

        this.outroMessage.innerHTML = message;
    }

    // Attach Event handlers in Outro
    attachEventHandlers() {

        this.resetButton.onclick = function() {
            quizApp.startQuiz();
        };
    }

    // Hide Outro
    toggle(hide) {
        this.element.classList.toggle('hidden', hide);
    }
}


// Init Question View
class QuestionView {
    constructor(selector) {
        this.element            = document.querySelector(selector);
        this.submitAnswerButton = this.element.querySelector('.submit-answer-button');
        this.questionContainer  = this.element.querySelector('.question-container');
        this.answersContainer   = this.element.querySelector('.answers-container');
    }

    // Attach Event handlers in Question View
    attachEventHandlers() {
        self = this;
        this.submitAnswerButton.onclick = function() {
            const checkedInput = self.answersContainer.querySelector('input:checked');

            if (!checkedInput) alert('Please select an answer');
            else {
                const answer = +checkedInput.getAttribute("value");
                quizApp.nextQuestion(answer);
            }
        };
    }

    // Set Question in Question View
    setQuestion(question) {
        let radios = '';

        this.questionContainer.innerHTML = question.prompt;

        question.forEachAnswer(function(answer, index) {
            radios +=
                `<li>
                <input type="radio" name="answer" value="${index}" id="answer${index}">
                <label for="answer${index}">${answer}</label>
            </li>`;
        });

        this.answersContainer.innerHTML = radios;
    }

    // Hide Question View
    toggle(hide) {
        this.element.classList.toggle('hidden', hide);
    }
}


const quizApp = new QuizApp(data);