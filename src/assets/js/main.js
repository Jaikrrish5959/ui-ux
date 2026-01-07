  // Bubble Effect
  const bubbleContainer = document.querySelector('.bubbles');
  if (bubbleContainer) {
    for(let i=0;i<75;i++){
      const span = document.createElement('span');
      span.style.setProperty('--i', Math.random()*20+5);
      span.style.setProperty('--x', Math.random());
      bubbleContainer.appendChild(span);
    }
  }

  // Animated Words
  const animatedWords = document.querySelectorAll('.animated-word');
  if (animatedWords.length > 0) {
    let currentWordIndex = 0;

    function showNextWord(){
      animatedWords.forEach(w=>w.classList.remove('active'));
      animatedWords[currentWordIndex].classList.add('active');
      currentWordIndex = (currentWordIndex+1)%animatedWords.length;
      setTimeout(showNextWord,3000);
    }

    window.onload = showNextWord;
  }