// Define game data in a JSON-like structure
const gameData = {
  questions: {
    html: [
      {
        question: "What does HTML stand for?",
        options: [
          "HyperText Markup Language",
          "HomeTool Markup Language",
          "Hyperlink Markup Language",
          "HyperText Machine Language"
        ],
        correct: 0
      },
      {
        question: "What tag is used to define a paragraph?",
        options: ["<p>", "<h1>", "<div>", "<section>"],
        correct: 0
      },
      {
        question: "Which tag is used to link a stylesheet?",
        options: ["<link>", "<style>", "<script>", "<css>"],
        correct: 0
      },
      {
        question: "What is the correct way to define an array in JavaScript?",
        options: ["var colors = 'red', 'green', 'blue'", "var colors = ['red', 'green', 'blue']", "var colors = (1:'red', 2:'green', 3:'blue')", "var colors = 'red', 'green', 'blue'"],
        correct: 1
      }
    ],
    css: [
      {
        question: "Which property is used to change the font of an element?",
        options: ["font-size", "font-style", "font-family", "color"],
        correct: 2
      },
      {
        question: "Which property is used to change the background color?",
        options: ["background", "color", "bgcolor", "background-color"],
        correct: 3
      },
      {
        question: "Which CSS selector is used to select an element with a specific class?",
        options: [".class", "#class", "class", "element.class"],
        correct: 0
      },
      {
        question: "Which property is used to add space between elements?",
        options: ["margin", "padding", "spacing", "border"],
        correct: 1
      }
    ],
    js: [
      {
        question: "What is the correct syntax for a JavaScript function?",
        options: ["function myFunction() {}", "function:myFunction()", "function myFunction() {}", "myFunction = function() {}"],
        correct: 0
      },
      {
        question: "Which operator is used to assign a value in JavaScript?",
        options: ["=", "==", "===", ":="],
        correct: 0
      },
      {
        question: "How do you write an if statement in JavaScript?",
        options: ["if i = 5", "if (i == 5)", "if i == 5", "if (i = 5)"],
        correct: 1
      },
      {
        question: "Which method can be used to convert a string to a number in JavaScript?",
        options: ["parseInt()", "parseFloat()", "toString()", "Number()"],
        correct: 0
      }
    ],
    mixed: [
      {
        question: "Which tag is used to link a stylesheet?",
        options: ["<link>", "<style>", "<script>", "<css>"],
        correct: 0
      },
      {
        question: "What does CSS stand for?",
        options: ["Cascading Style Sheets", "Cascading Simple Sheets", "Colorful Style Sheets", "Computer Style Sheets"],
        correct: 0
      },
      {
        question: "What tag is used to define a paragraph?",
        options: ["<p>", "<h1>", "<div>", "<section>"],
        correct: 0
      },
      {
        question: "Which method can be used to convert a string to a number in JavaScript?",
        options: ["parseInt()", "parseFloat()", "toString()", "Number()"],
        correct: 0
      }
    ]
  }
};

// Variables to store data
let players = [];
let currentPlayer = 0;
let currentQuestionIndex = 0;
let playerScores = [];
let selectedAnswers = [];
let category = '';
let timer;
let timeLeft = 10;
let selectedAnswer = -1;

// Function to start the game with selected number of players
function choosePlayers(num) {
  players = Array.from({ length: num }, (_, i) => ({ score: 0, id: i + 1, color: getColor(i) }));
  playerScores = Array(num).fill(0);
  selectedAnswers = Array(num).fill([]); // Correctly initialize empty arrays for each player
  document.getElementById('player-selection').style.display = 'none';
  document.getElementById('category-selection').style.display = 'block';
}

// Function to get player color
function getColor(playerIndex) {
  const colors = ["red", "blue", "green", "yellow"];
  return colors[playerIndex % colors.length];
}

// Function to start the game with a selected category
function startGame(selectedCategory) {
  category = selectedCategory;
  currentPlayer = 0;
  currentQuestionIndex = 0;
  document.getElementById('category-selection').style.display = 'none';
  document.getElementById('game-play').style.display = 'block';
  loadQuestion();
}

// Function to load a question
function loadQuestion() {
  const questionObj = gameData.questions[category][currentQuestionIndex]; // Get the current question
  if (!questionObj) {
    document.getElementById('question').innerText = "Error: Question not found!";
    return;
  }

  document.getElementById('player-name').innerText = `Player ${currentPlayer + 1}'s Turn`;
  document.getElementById('question').innerText = questionObj.question;

  const answersContainer = document.getElementById('answers');
  answersContainer.innerHTML = ""; // Clear any previous answers
  questionObj.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.innerText = option;
    button.style.backgroundColor = players[currentPlayer].color; // Set button color
    button.onclick = () => selectAnswer(index);
    answersContainer.appendChild(button);
  });

  selectedAnswer = -1; // Reset selected answer for the new question
  document.getElementById('submit-btn').style.display = 'inline-block'; // Show submit button initially
  document.getElementById('next-btn').style.display = 'none'; // Hide next button during question load

  startTimer(); // Start the countdown timer
}

// Function to select an answer
function selectAnswer(index) {
  selectedAnswer = index; // Save the selected answer
  document.querySelectorAll('.answer-btn').forEach((btn, i) => {
    btn.style.backgroundColor = i === index ? 'pink' : players[currentPlayer].color; // Highlight selected button
  });
  document.getElementById('submit-btn').disabled = false; // Enable submit button after selection
}

// Function to submit the answer
function submitAnswer() {
  const correctAnswer = gameData.questions[category][currentQuestionIndex].correct;

  if (!selectedAnswers[currentPlayer]) {
    selectedAnswers[currentPlayer] = [];
  }

  // Record "No Answer" (-1) as undefined for unanswered questions
  selectedAnswers[currentPlayer][currentQuestionIndex] = selectedAnswer !== undefined ? selectedAnswer : -1;

  // Add score if the selected answer is correct
  if (selectedAnswer === correctAnswer) {
    playerScores[currentPlayer] += 10;
  }

  console.log(`Player ${currentPlayer + 1} answered question ${currentQuestionIndex + 1} with option ${selectedAnswer}`);

  // Show next button after submission
  document.getElementById('submit-btn').style.display = 'none';
  document.getElementById('next-btn').style.display = 'inline-block';
}

// Function to go to the next question
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= gameData.questions[category].length) {
    currentPlayer++;
    if (currentPlayer >= players.length) {
      endGame();
      return;
    }
    currentQuestionIndex = 0;
  }
  loadQuestion();
}

// Function to end the game
function endGame() {
  document.getElementById('game-play').style.display = 'none';
  document.getElementById('game-over').style.display = 'block';

  // Loop through players and update score and answers for each player
  players.forEach((_, playerIndex) => {
    // Set the score for each player
    document.getElementById(`score-player-${playerIndex + 1}`).innerText = playerScores[playerIndex];

    // Set the detailed answers for each player
    let answersHTML = '';
    gameData.questions[category].forEach((question, questionIndex) => {
      const playerAnswer = selectedAnswers[playerIndex][questionIndex];
      const correctAnswer = question.options[question.correct];
      answersHTML += `<p><strong>Q:</strong> ${question.question}<br>
                      <strong>Your Answer:</strong> ${playerAnswer !== undefined && playerAnswer !== -1 ? question.options[playerAnswer] : "No Answer"}<br>
                      <strong>Correct Answer:</strong> ${correctAnswer}</p>`;
    });

    // Insert the answers into the player's square
    document.getElementById(`answers-player-${playerIndex + 1}`).innerHTML = answersHTML;
  });
}


// Function to go back to player selection
function goBackToPlayers() {
  document.getElementById('category-selection').style.display = 'none';
  document.getElementById('player-selection').style.display = 'block';

  players = [];
  category = '';
  currentPlayer = 0;
  currentQuestionIndex = 0;
}

// Function to restart the game
function restartGame() {
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('player-selection').style.display = 'block';
}

// Function to start the timer
function startTimer() {
  timeLeft = 10; // Reset the timer
  document.getElementById('timer').innerText = timeLeft;
  if (timer) clearInterval(timer); // Clear any existing timer

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer); // Stop the timer
      // Auto-submit and move to the next question if time runs out
      autoSubmitAndNext();
    }
  }, 1000);
}

// Function to auto-submit and move to the next question if time runs out
function autoSubmitAndNext() {
  submitAnswer();
  nextQuestion();
}
