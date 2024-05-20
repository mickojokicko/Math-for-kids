'use strict';

const options1 = document.getElementById('options1');
const options2 = document.getElementById('options2');
const options3 = document.getElementById('options3');
const options4 = document.getElementById('options4');
const audio = document.getElementById('myAudio');
const audioCorrect = document.getElementById('myAudio1');
let answer = 0;
let results = 0;

// higscores Window
const highScoreWindow = document.querySelector('.scores');
const highScoresField = document.getElementById('highScoreList');
const highScoreBtn = document.getElementById('highScoreBtn');
const exitScoreBtn = document.querySelector('.fa-solid');
const answerOptions = document.querySelector('.answer-options');
const equationWindow = document.querySelector('.equation');
const overlay = document.querySelector('.overlay');

function showScore() {
  highScoreWindow.classList.remove('hidden');
  answerOptions.classList.add('transparent');
  timeDisplay.classList.add('transparent');
  equationWindow.classList.add('transparent');
  updateHighScoreUi();
}

function hideScore() {
  highScoreWindow.classList.add('hidden');
  answerOptions.classList.remove('transparent');
  timeDisplay.classList.remove('transparent');
  equationWindow.classList.remove('transparent');
  location.reload();
}

highScoreBtn.addEventListener('click', showScore);
exitScoreBtn.addEventListener('click', hideScore);

// ----------------------------------------------

// ------------>>>>>>stoptWatch<<<<<<<<<<<<<-----------

const timeDisplay = document.getElementById('timeDisplay');
const pauseBtn = document.getElementById('pauseBtn');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const numb1 = document.getElementById('num1');
const numb2 = document.getElementById('num2');

let date = new Date().toLocaleString();
// stop watch

let startTime = 0;
let elapsedTime = 0;
let paused = true;
let intervalId;
let hours = 0;
let minutes = 0;
let seconds = 0;
let maxDuration = 60000; // 60 sekundi
let savedHighScoreData = JSON.parse(
  localStorage.getItem('highscoreData') || '[]'
);

function updateHighScoreList(item) {
  return `
   <ul id="highScoreList">
          <li><span id="span1">${item.ime}</span> <span id="span2">${item.rezultati} </span> <span id="span3">${item.datum} </span></li>
  </ul>`;
}
function updateHighScoreUi() {
  savedHighScoreData.map(item => {
    let html = '';
    html += updateHighScoreList(item);
    highScoresField.insertAdjacentHTML('beforeend', html);
  });
}

function resetPage() {
  numb1.innerText = '?';
  numb2.innerText = '?';
  results = 0;
  resetTimer();
  options1.innerText = '?';
  options2.innerText = '?';
  options3.innerText = '?';
  options4.innerText = '?';
}

function displayScore() {
  let inputName = prompt(
    'Please write your name and check in High scores list is your score there😎😎'
  );

  const podaci = {
    ime: inputName,
    rezultati: results,
    datum: date,
  };
  savedHighScoreData.push(podaci);
  savedHighScoreData.sort((a, b) => b.rezultati - a.rezultati);

  if (savedHighScoreData.length > 20) {
    savedHighScoreData.pop();
  }

  localStorage.setItem('highscoreData', JSON.stringify(savedHighScoreData));
}

function updateTime() {
  elapsedTime = Date.now() - startTime;

  if (!paused && elapsedTime >= maxDuration) {
    stopTimer();
    alert('Time for yor game is gone🚩🚩🚩');
    displayScore();
    resetPage();
  }

  seconds = Math.floor((elapsedTime / 1000) % 60);
  minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 60);

  seconds = padcorrectDisplay(seconds);
  minutes = padcorrectDisplay(minutes);
  hours = padcorrectDisplay(hours);
  timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;

  function padcorrectDisplay(unit) {
    return ('0' + unit).length > 2 ? unit : '0' + unit;
  }
}

function startTimer() {
  if (paused) {
    startTime = Date.now() - elapsedTime;
    intervalId = setInterval(updateTime, 1000);
    paused = false;

    // Postavite timeout za automatsko zaustavljanje nakon 60 sekundi
    setTimeout(stopTimer, maxDuration);
  }
}

function stopTimer() {
  clearInterval(intervalId);
  paused = true;
}

function resetTimer() {
  stopTimer();
  elapsedTime = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  timeDisplay.textContent = '00:00:00';
}

startBtn.addEventListener('click', () => {
  if (paused) {
    paused = false;
    startTime = Date.now() - elapsedTime;
    intervalId = setInterval(updateTime, 1000);
    generate_equation();
  }
});
pauseBtn.addEventListener('click', () => {
  if (!paused) {
    paused = true;
    elapsedTime = Date.now() - startTime;
    clearInterval(intervalId);
  }
});
restartBtn.addEventListener('click', () => {
  resetPage();
  paused = true;
  clearInterval(intervalId);
  startTime = 0;
  elapsedTime = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  timeDisplay.textContent = '00:00:00';
});

// ____________________________________________

function generate_equation() {
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  let wrongAnswer1 = Math.floor(Math.random() * 100) + 1;
  let wrongAnswer2 = Math.floor(Math.random() * 100) + 1;
  let wrongAnswer3 = Math.floor(Math.random() * 100) + 1;

  let allAnswers = [];
  let switchAnswers = [];

  answer = num1 * num2;

  document.getElementById('num1').innerHTML = num1;
  document.getElementById('num2').innerHTML = num2;

  allAnswers = [answer, wrongAnswer1, wrongAnswer2, wrongAnswer3];

  for (let i = allAnswers.length; i > 0; i--) {
    switchAnswers.push(allAnswers.splice(Math.floor(Math.random() * i), 1)[0]);
  }

  options1.innerHTML = switchAnswers[0];
  options2.innerHTML = switchAnswers[1];
  options3.innerHTML = switchAnswers[2];
  options4.innerHTML = switchAnswers[3];
}

options1.addEventListener('click', function () {
  if (parseInt(options1.textContent) === answer) {
    results++;
    audioCorrect.play();
    generate_equation();
  } else {
    audio.play();
    results = results - 0.5;
  }
});

options2.addEventListener('click', function () {
  if (parseInt(options2.textContent) === answer) {
    results++;
    audioCorrect.play();
    generate_equation();
  } else {
    audio.play();
    results = results - 0.5;
  }
});

options3.addEventListener('click', function () {
  if (parseInt(options3.textContent) === answer) {
    results++;
    audioCorrect.play();
    generate_equation();
  } else {
    audio.play();
    results = results - 0.5;
  }
});

options4.addEventListener('click', function () {
  if (parseInt(options4.textContent) === answer) {
    results++;
    audioCorrect.play();
    generate_equation();
  } else {
    audio.play();
    results = results - 0.5;
  }
});
