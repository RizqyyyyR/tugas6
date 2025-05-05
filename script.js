document.addEventListener('DOMContentLoaded', () => {
  const qBody      = document.getElementById('question-body');
  const timerEl    = document.getElementById('timer');
  const progressEl = document.getElementById('progress');
  const nextBtn    = document.getElementById('next-btn');

  let currentQuestionIndex = 0;
  let questions            = [];
  let score                = 0;
  const timeLimit          = 600; 
  let timeLeft             = timeLimit;
  let timerInterval;


  async function loadQuestions() {
    try {
      const res = await fetch('soal.json');
      questions = await res.json();
      renderQuestion();    
      startTimer();        
    } catch (e) {
      qBody.textContent = 'Gagal memuat soal!';
    }
  }


  function startTimer() {
    updateTimer();
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        finishQuiz();
      }
    }, 1000);
  }

  function updateTimer() {
    const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const s = String(timeLeft % 60).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
  }

  
  function renderQuestion() {
    nextBtn.disabled = true;               
    const q = questions[currentQuestionIndex];

  
    qBody.innerHTML = '';


    const pQ = document.createElement('p');
    pQ.className = 'question';
    pQ.textContent = `Soal ${currentQuestionIndex + 1}: ${q.question}`;
    qBody.appendChild(pQ);


    const optsDiv = document.createElement('div');
    optsDiv.id = 'opts';

    q.options.forEach(opt => {
      const lbl = document.createElement('label');
      lbl.className = 'option';
      lbl.dataset.value = opt;

    
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = opt;

      const span = document.createElement('span');
      span.textContent = opt;

      lbl.appendChild(input);
      lbl.appendChild(span);

    
      lbl.addEventListener('click', () => selectAnswer(opt));

      optsDiv.appendChild(lbl);
    });

    qBody.appendChild(optsDiv);

  
    progressEl.textContent = `${currentQuestionIndex + 1} of ${questions.length} Questions`;
  }

  function selectAnswer(userAnswer) {
  
    if (!nextBtn.disabled) return;

    const q = questions[currentQuestionIndex];

    document.querySelectorAll('.option').forEach(lbl => {
      const val = lbl.dataset.value;
      lbl.querySelector('input').disabled = true;

      if (val === q.answer) {
        lbl.classList.add('correct');
        lbl.innerHTML += '<span class="icon">&#10004;</span>';
      } else if (val === userAnswer) {
        lbl.classList.add('incorrect');
        lbl.innerHTML += '<span class="icon">&#10008;</span>';
      }
    });

    if (userAnswer === q.answer) score++;
    nextBtn.disabled = false;
  }


  nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      renderQuestion();
    } else {
      clearInterval(timerInterval);
      finishQuiz();
    }
  });


  function finishQuiz() {
    qBody.innerHTML = `
      <div class="alert alert-success text-center">
        <h3>Kuis Selesai!</h3>
        <p>Skor Anda: <strong>${score}</strong> dari <strong>${questions.length}</strong> soal.</p>
      </div>
    `;
    nextBtn.style.display  = 'none';
    timerEl.style.display  = 'none';
  }

  loadQuestions();
});