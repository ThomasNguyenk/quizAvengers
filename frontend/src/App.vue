<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const questions = ref([]);
const currentQuestionIndex = ref(0);
const score = ref(0);
const timeLeft = ref(30);
const selectedAnswer = ref(null);
const feedbackMessage = ref("");
const feedbackColor = ref("");
const quizOver = ref(false);
const loading = ref(true);
let timerInterval = null;

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {});

const fetchQuestions = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/questions');
    questions.value = res.data;
    loading.value = false;
    startTimer();
  } catch (e) {
    console.error("Erreur serveur");
  }
};

const startTimer = () => {
  clearInterval(timerInterval);
  timeLeft.value = 30;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--;
    else submitAnswer(true); // Timeout
  }, 1000);
};

const submitAnswer = async (isTimeout = false) => {
  if (!selectedAnswer.value && !isTimeout) return alert("Please select an answer!");

  clearInterval(timerInterval);

  if (isTimeout) {
    feedbackMessage.value = "Time's up!";
    feedbackColor.value = "red";
  } else {
    const res = await axios.post('http://localhost:3000/api/check-answer', {
      id: currentQuestion.value.id,
      answer: selectedAnswer.value
    });

    if (res.data.correct) {
      score.value++;
      feedbackMessage.value = "Correct answer!";
      feedbackColor.value = "green";
    } else {
      feedbackMessage.value = "Wrong answer...";
      feedbackColor.value = "red";
    }
  }

  setTimeout(nextQuestion, 2000);
};

const nextQuestion = () => {
  feedbackMessage.value = "";
  selectedAnswer.value = null;
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
    startTimer();
  } else {
    quizOver.value = true;
  }
};

const restartQuiz = () => {
  currentQuestionIndex.value = 0;
  score.value = 0;
  quizOver.value = false;
  fetchQuestions();
};

onMounted(fetchQuestions);
</script>

<template>
  <div class="main-bg">
    <div class="headers" v-if="!quizOver">
      <h1>Welcome to the Avengers Quiz!</h1>
      <h2>Test your knowledge of the Avengers universe!</h2>
      <h3>You are on a quiz with the Avengers theme!</h3>
      <h4 class="q-count">There are {{ questions.length }} Questions in this quiz!</h4>
    </div>

    <div class="container">
      <div v-if="loading">Loading Avengers Data...</div>

      <div v-else-if="!quizOver">
        <div class="timer">Time remaining: {{ timeLeft }} seconds</div>

        <div class="question">{{ currentQuestion.question }}</div>

        <div class="choices">
          <div v-for="opt in currentQuestion.options" :key="opt" class="choice">
            <label>
              <input type="radio" :value="opt" v-model="selectedAnswer">
              {{ opt }}
            </label>
          </div>
        </div>

        <div class="result" v-if="feedbackMessage" :style="{ color: feedbackColor }">
          {{ feedbackMessage }}
        </div>

        <button @click="submitAnswer(false)" :disabled="feedbackMessage">Submit Answer</button>
      </div>

      <div v-else class="final">
        <h1 style="color: white">- Quiz Finished! -</h1>
        <div class="score">Your score: {{ score }} out of {{ questions.length }}</div>
        <button @click="restartQuiz">Restart Quiz</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-bg {
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background-image: url('https://i.pinimg.com/originals/9b/56/72/9b567242873fcd6c8bc9c1fbcac05b39.jpg');
  background-size: cover;
  background-position: center;
  padding: 20px;
}

h1, h2, h3, h4 {
  text-align: center;
  font-weight: bold;
  background: linear-gradient(to right, #00b700, #1a009a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 10px 0;
}

h1 { font-size: 3em; }
.q-count { -webkit-text-fill-color: white; font-size: 1.5em; }

.container {
  width: 80%;
  max-width: 800px;
  margin: 50px auto;
  padding: 40px;
  background-image: url('https://img.freepik.com/vecteurs-libre/papier-peint-style-bande-dessinee_79603-1248.jpg');
  background-size: cover;
  border-radius: 15px;
  box-shadow: 0 0 20px white;
  text-align: center;
}

.timer { color: white; font-weight: bold; margin-bottom: 20px; font-size: 1.2em; }

.question {
  margin-bottom: 20px;
  font-size: 1.8em;
  font-weight: bold;
  color: #ff0000;
  text-shadow: 2px 2px black;
}

.choice {
  margin: 15px 0;
  font-size: 1.3em;
  color: white;
  background: rgba(0,0,0,0.5);
  padding: 10px;
  border-radius: 8px;
}

button {
  padding: 15px 30px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 20px;
}

button:hover { background-color: #cc0000; }

.result {
  margin-top: 20px;
  font-size: 1.5em;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 10px;
  display: inline-block;
}

.score { color: white; font-size: 2em; margin: 20px; font-weight: bold; }
</style>