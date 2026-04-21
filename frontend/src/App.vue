<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const questions = ref([]);
const currentQuestionIndex = ref(0);
const score = ref(0);
const selectedAnswer = ref(null); // C'est cette variable qui débloque le bouton
const feedbackMessage = ref("");
const feedbackColor = ref("");
const quizOver = ref(false);
const loading = ref(true);

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value] || { question: '', options: [] };
});

const fetchQuestions = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/questions');
    questions.value = res.data;
    loading.value = false;
  } catch (e) {
    console.error("Backend inaccessible sur le port 3000");
    loading.value = false;
  }
};

const submitAnswer = async () => {
  // Le bouton ne peut être cliqué que si selectedAnswer n'est pas nul
  if (!selectedAnswer.value) return;

  try {
    const res = await axios.post('http://localhost:3000/api/check-answer', {
      id: currentQuestion.value.id,
      answer: selectedAnswer.value
    });

    if (res.data.correct) {
      score.value++;
      feedbackMessage.value = "CORRECT !";
      feedbackColor.value = "#00ff00";
    } else {
      feedbackMessage.value = "WRONG !";
      feedbackColor.value = "#ff0000";
    }

    setTimeout(() => {
      feedbackMessage.value = "";
      selectedAnswer.value = null; // On réinitialise pour la question suivante
      if (currentQuestionIndex.value < questions.value.length - 1) {
        currentQuestionIndex.value++;
      } else {
        quizOver.value = true;
      }
    }, 2000);
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchQuestions);
</script>

<template>
  <div class="main-bg">
    <div class="quiz-card">

      <div v-if="loading"><h1>LOADING AVENGERS...</h1></div>

      <div v-else-if="!quizOver">
        <h2 class="counter">Question {{ currentQuestionIndex + 1 }} / {{ questions.length }}</h2>
        <div class="question-text">{{ currentQuestion.question }}</div>

        <div class="options-container">
          <div
              v-for="option in currentQuestion.options"
              :key="option"
              class="option-box"
              :class="{ 'selected': selectedAnswer === option }"
              @click="selectedAnswer = option"
          >
            {{ option }}
          </div>
        </div>

        <div class="feedback" :style="{ color: feedbackColor }">{{ feedbackMessage }}</div>

        <button
            class="submit-btn"
            @click="submitAnswer"
            :disabled="!selectedAnswer || !!feedbackMessage"
        >
          SUBMIT ANSWER
        </button>
      </div>

      <div v-else class="final-screen">
        <h1>MISSION ACCOMPLISHED</h1>
        <p>Your Score: {{ score }} / {{ questions.length }}</p>
        <button class="submit-btn" @click="window.location.reload()">RESTART</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.main-bg {
  min-height: 100vh;
  background-image: url('https://i.pinimg.com/originals/9b/56/72/9b567242873fcd6c8bc9c1fbcac05b39.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial Black', sans-serif;
}

.quiz-card {
  background-image: url('https://img.freepik.com/vecteurs-libre/papier-peint-style-bande-dessinee_79603-1248.jpg');
  background-size: cover;
  width: 500px;
  padding: 30px;
  border: 4px solid black;
  border-radius: 15px;
  text-align: center;
  box-shadow: 10px 10px 0px red;
}

.question-text {
  background: white;
  padding: 15px;
  border: 3px solid black;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.options-container { display: flex; flex-direction: column; gap: 10px; }

.option-box {
  background: black;
  color: white;
  padding: 12px;
  border: 2px solid white;
  cursor: pointer;
  transition: 0.2s;
}

/* L'état bleu que tu vois sur ton image */
.option-box.selected {
  background: #007bff;
  border: 2px solid yellow;
}

.feedback { height: 30px; margin: 10px; font-weight: bold; }

.submit-btn {
  width: 100%;
  padding: 15px;
  background: #ff0000; /* Devient ROUGE quand activé */
  color: white;
  border: 3px solid black;
  font-weight: bold;
  cursor: pointer;
}

/* Ton problème actuel : le bouton est bloqué ici */
.submit-btn:disabled {
  background: #808080; /* GRIS comme sur ton image */
  cursor: not-allowed;
  opacity: 0.7;
}
</style>