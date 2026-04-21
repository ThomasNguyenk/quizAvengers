const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configuration des middlewares
app.use(cors());
app.use(express.json());

// Base de données des questions (Thème Avengers)
const quizData = [
    { id: 1, question: "What is Iron Man's real name?", options: ["Tony Stark", "Steve Rogers", "Bruce Banner", "Thor Odinson"], correctAnswer: "Tony Stark" },
    { id: 2, question: "Who is the leader of the Avengers?", options: ["Captain America", "Iron Man", "Thor", "Hulk"], correctAnswer: "Captain America" },
    { id: 3, question: "What is the name of Thor's hammer?", options: ["Mjolnir", "Stormbreaker", "Excalibur", "Gungnir"], correctAnswer: "Mjolnir" },
    { id: 4, question: "What is Hulk's main power?", options: ["Super strength", "Flight", "Invisibility", "Telepathy"], correctAnswer: "Super strength" },
    { id: 5, question: "Who is Captain America's archenemy?", options: ["Red Skull", "Loki", "Thanos", "Ultron"], correctAnswer: "Red Skull" },
    { id: 6, question: "What is the name of the organization led by Nick Fury?", options: ["S.H.I.E.L.D.", "Hydra", "A.I.M.", "The Ten Rings"], correctAnswer: "S.H.I.E.L.D." },
    { id: 7, question: "Who is Thor's adoptive brother?", options: ["Loki", "Odin", "Heimdall", "Balder"], correctAnswer: "Loki" },
    { id: 8, question: "What is the name of the robot created by Ultron?", options: ["Vision", "J.A.R.V.I.S.", "F.R.I.D.A.Y.", "Ultron Mark I"], correctAnswer: "Vision" },
    { id: 9, question: "What is the name of the Infinity Stone that controls time?", options: ["Time Stone", "Mind Stone", "Reality Stone", "Space Stone"], correctAnswer: "Time Stone" },
    { id: 10, question: "Who is Thor's father?", options: ["Odin", "Loki", "Heimdall", "Frigga"], correctAnswer: "Odin" },
    { id: 11, question: "What is the name of Captain America's shield?", options: ["Vibranium Shield", "Adamantium Shield", "Uru Shield", "Carbonadium Shield"], correctAnswer: "Vibranium Shield" },
    { id: 12, question: "Who is the creator of the Avengers in the comics?", options: ["Stan Lee", "Jack Kirby", "Steve Ditko", "Joe Simon"], correctAnswer: "Stan Lee" },
    { id: 13, question: "What is the name of the Avengers' spaceship?", options: ["The Quinjet", "The Helicarrier", "The Milano", "The Benatar"], correctAnswer: "The Quinjet" },
    { id: 14, question: "Who is the first member recruited by Nick Fury for the Avengers?", options: ["Iron Man", "Captain America", "Thor", "Hulk"], correctAnswer: "Iron Man" },
    { id: 15, question: "What is the name of the Avengers' base?", options: ["The Triskelion", "Stark Tower", "The Sanctum", "Avengers HQ"], correctAnswer: "Stark Tower" },
    { id: 16, question: "Who is the main villain in Avengers: Infinity War?", options: ["Thanos", "Loki", "Ultron", "Red Skull"], correctAnswer: "Thanos" },
    { id: 17, question: "What is the name of Hawkeye's wife?", options: ["Laura Barton", "Natasha Romanoff", "Wanda Maximoff", "Pepper Potts"], correctAnswer: "Laura Barton" },
    { id: 18, question: "Who is the creator of Ultron?", options: ["Tony Stark", "Bruce Banner", "Hank Pym", "Nick Fury"], correctAnswer: "Tony Stark" },
    { id: 19, question: "What is the name of the Avengers' alien ally?", options: ["Captain Marvel", "Rocket Raccoon", "Nebula", "Groot"], correctAnswer: "Captain Marvel" },
    { id: 20, question: "Who is the last member to join the Avengers in Endgame?", options: ["Captain Marvel", "Spider-Man", "Black Panther", "Doctor Strange"], correctAnswer: "Captain Marvel" },
    { id: 21, question: "What is the name of the robot created by Tony Stark to help the Avengers?", options: ["J.A.R.V.I.S.", "Ultron", "Vision", "F.R.I.D.A.Y."], correctAnswer: "J.A.R.V.I.S." },
    { id: 22, question: "Who is the first villain faced by the Avengers in their first movie?", options: ["Loki", "Thanos", "Red Skull", "Ultron"], correctAnswer: "Loki" },
    { id: 23, question: "What is the name of Thor's home planet?", options: ["Asgard", "Vanaheim", "Midgard", "Jotunheim"], correctAnswer: "Asgard" },
    { id: 24, question: "Who is the creator of Iron Man's armor?", options: ["Tony Stark", "Obadiah Stane", "Pepper Potts", "J.A.R.V.I.S."], correctAnswer: "Tony Stark" },
    { id: 25, question: "Who is the first member to die in Avengers: Infinity War?", options: ["Loki", "Vision", "Gamora", "Heimdall"], correctAnswer: "Loki" },
    { id: 26, question: "What is the name of Thanos' daughter?", options: ["Gamora", "Corvus Glaive", "Proxima Midnight", "Nebula"], correctAnswer: "Nebula" },
    { id: 27, question: "What is the name of the realm of the dead?", options: ["Hel", "Valhalla", "Niflheim", "Muspelheim"], correctAnswer: "Hel" },
    { id: 28, question: "Who is the creator of War Machine's armor?", options: ["Tony Stark", "James Rhodes", "Obadiah Stane", "Pepper Potts"], correctAnswer: "Tony Stark" },
    { id: 29, question: "What is the name of the realm of the ice giants?", options: ["Jotunheim", "Asgard", "Vanaheim", "Midgard"], correctAnswer: "Jotunheim" },
    { id: 30, question: "Who is the leader of the Guardians of the Galaxy?", options: ["Star-Lord", "Rocket Raccoon", "Groot", "Drax"], correctAnswer: "Star-Lord" }
];

// Route pour récupérer les questions (sans les réponses)
app.get('/api/questions', (req, res) => {
    const safeQuestions = quizData.map(({correctAnswer, ...rest}) => rest);
    res.json(safeQuestions);
});

// Route pour vérifier la réponse envoyée par le frontend
app.post('/api/check-answer', (req, res) => {
    const { id, answer } = req.body;
    const question = quizData.find(q => q.id === id);

    if (question) {
        const isCorrect = question.correctAnswer === answer;
        res.json({
            correct: isCorrect,
            correctResponse: isCorrect ? null : question.correctAnswer
        });
    } else {
        res.status(404).json({ message: "Question non trouvée" });
    }
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Avengers Backend lancé sur http://localhost:${PORT}`);
});