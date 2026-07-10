import { shuffleArray, showToast } from './utils.js';
import { getVocabList, setVocabList } from './vocab.js';
import { saveWordToDb, getCurrentUser } from './db.js';
import { switchView } from './ui.js';

let reviewQueue = [];
let currentCardIndex = 0;
let isFlipped = false;

export function startReviewSession() {
  const vocabList = getVocabList();
  const now = Date.now();
  reviewQueue = vocabList.filter(card => card.dueDate <= now);
  
  if (reviewQueue.length === 0) {
    showToast("今日の復習はすべて完了しました！お疲れ様です 🎉", "success");
    return;
  }
  
  // Bug fix: Use unbiased Fisher-Yates shuffle
  reviewQueue = shuffleArray(reviewQueue);
  currentCardIndex = 0;
  
  switchView('review');
  showCard();
}

export function showCard() {
  const vocabList = getVocabList();
  if (currentCardIndex >= reviewQueue.length) {
    const user = getCurrentUser();
    if (!user) {
      localStorage.setItem('nihongo_study_data', JSON.stringify(vocabList));
    }
    exitReviewSession();
    showToast("復習セッションが完了しました！", "success");
    return;
  }

  isFlipped = false;
  const card = reviewQueue[currentCardIndex];
  
  document.getElementById('flashcard').classList.remove('is-flipped');
  document.getElementById('answer-controls').classList.add('hidden');
  document.getElementById('reveal-instruction').classList.remove('hidden');
  
  // Safe rendering via textContent
  document.getElementById('card-word').textContent = card.word;
  document.getElementById('card-reading').textContent = card.reading || '';
  document.getElementById('card-meaning').textContent = card.meaning_ja || '';
  document.getElementById('card-meaning-vi').textContent = card.meaning_vi || '';
  document.getElementById('card-example').textContent = card.example || '';
  
  updateProgress();
}

export function flipCard() {
  if (isFlipped) return;
  isFlipped = true;
  document.getElementById('flashcard').classList.add('is-flipped');
  document.getElementById('answer-controls').classList.remove('hidden');
  document.getElementById('reveal-instruction').classList.add('hidden');
}

export async function submitAnswer(quality, onDashboardUpdate) {
  let card = reviewQueue[currentCardIndex];
  const vocabList = getVocabList();
  
  if (quality < 3) {
    card.reps = 0;
    card.interval = 1;
    card.lapses = (card.lapses || 0) + 1; // Track forgetting
  } else {
    if (card.reps === 0) card.interval = 1;
    else if (card.reps === 1) card.interval = 6;
    else card.interval = Math.round(card.interval * card.easiness);
    card.reps++;
  }
  
  card.easiness = card.easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (card.easiness < 1.3) card.easiness = 1.3;
  
  card.dueDate = Date.now() + card.interval * 86400000;
  
  const idx = vocabList.findIndex(c => c.id === card.id);
  if (idx !== -1) {
    vocabList[idx] = card;
    setVocabList(vocabList);
    
    const user = getCurrentUser();
    if (user) {
      await saveWordToDb(user.uid, card);
    }
  }

  currentCardIndex++;
  showCard();
  if(onDashboardUpdate) onDashboardUpdate();
}

export function updateProgress() {
  if (reviewQueue.length === 0) {
    document.getElementById('review-progress').style.width = '100%';
    document.getElementById('review-progress-text').innerText = `残り 0 枚`;
    return;
  }
  const remaining = reviewQueue.length - currentCardIndex;
  const progressPercent = (currentCardIndex / reviewQueue.length) * 100;
  document.getElementById('review-progress').style.width = `${progressPercent}%`;
  document.getElementById('review-progress-text').innerText = `残り ${remaining} 枚`;
}

export function exitReviewSession() {
  switchView('dashboard');
}
