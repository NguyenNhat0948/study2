import { escapeHtml, showToast, generateId } from './utils.js';
import { saveWordToDb, deleteWordFromDb, getCurrentUser } from './db.js';
import { customConfirm } from './ui.js';

let vocabList = [];

export function getVocabList() { return vocabList; }
export function setVocabList(list) { vocabList = list; }

export function renderVocabList(cards = vocabList) {
  const grid = document.getElementById('vocab-grid');
  const emptyState = document.getElementById('vocab-empty-state');
  
  if (cards.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  // Create DOM nodes safely to prevent Stored XSS
  grid.innerHTML = '';
  cards.forEach(card => {
    let statusBadge = '';
    if (card.reps === 0) statusBadge = '<span class="badge badge-new">新規</span>';
    else if (card.interval >= 21) statusBadge = '<span class="badge badge-learned">習得済</span>';
    else statusBadge = '<span class="badge badge-learning">学習中</span>';

    const div = document.createElement('div');
    div.className = 'vocab-card';
    
    // Using escapeHtml to prevent XSS
    div.innerHTML = `
      <div class="vocab-card-header">
        ${statusBadge}
        <div class="vocab-actions">
          <button class="vocab-action-btn edit-btn" aria-label="編集" data-id="${escapeHtml(card.id)}"><i data-lucide="edit-2" style="width: 14px;"></i></button>
          <button class="vocab-action-btn delete delete-btn" aria-label="削除" data-id="${escapeHtml(card.id)}"><i data-lucide="trash-2" style="width: 14px;"></i></button>
        </div>
      </div>
      <div class="vocab-card-body">
        <div class="vocab-word">${escapeHtml(card.word)}</div>
        <div class="vocab-meaning">${escapeHtml(card.meaning_ja)}</div>
        ${card.meaning_vi ? `<div class="vocab-meaning-vi">${escapeHtml(card.meaning_vi)}</div>` : ''}
        ${card.example ? `<div class="vocab-example-text">${escapeHtml(card.example)}</div>` : ''}
      </div>
      <div class="vocab-card-footer">
        <span>次の復習: ${new Date(card.dueDate).toLocaleDateString()}</span>
      </div>
    `;
    
    div.querySelector('.edit-btn').addEventListener('click', () => openAddModal(card.id));
    div.querySelector('.delete-btn').addEventListener('click', () => deleteWord(card.id, window.updateDashboard)); // will pass global later or rely on event
    
    grid.appendChild(div);
  });
  
  lucide.createIcons({ root: grid });
}

export function openAddModal(id = null) {
  document.getElementById('word-form').reset();
  if (id) {
    const card = vocabList.find(c => c.id === id);
    if (card) {
      document.getElementById('modal-title').innerText = "単語を編集";
      document.getElementById('word-id').value = card.id;
      document.getElementById('form-word').value = card.word;
      document.getElementById('form-reading').value = card.reading || '';
      document.getElementById('form-meaning').value = card.meaning_ja || '';
      document.getElementById('form-meaning-vi').value = card.meaning_vi || '';
      document.getElementById('form-example').value = card.example || '';
    }
  } else {
    document.getElementById('modal-title').innerText = "新しい単語を追加";
    document.getElementById('word-id').value = "";
  }
  document.getElementById('word-modal').classList.add('show');
}

export function closeWordModal() {
  document.getElementById('word-modal').classList.remove('show');
}

export async function saveWord(e, onUpdate) {
  e.preventDefault();
  const id = document.getElementById('word-id').value;
  const user = getCurrentUser();
  
  const formWord = document.getElementById('form-word').value;
  const formReading = document.getElementById('form-reading').value;
  const formMeaningJa = document.getElementById('form-meaning').value;
  const formMeaningVi = document.getElementById('form-meaning-vi').value;
  const formExample = document.getElementById('form-example').value;

  let cardToSave;

  if (id) {
    // BUG FIX: Do not overwrite SM-2 progress for existing words
    const idx = vocabList.findIndex(c => c.id === id);
    if (idx !== -1) {
      cardToSave = {
        ...vocabList[idx],
        word: formWord,
        reading: formReading,
        meaning_ja: formMeaningJa,
        meaning_vi: formMeaningVi,
        example: formExample
      };
      vocabList[idx] = cardToSave;
      showToast("単語を更新しました");
    }
  } else {
    cardToSave = {
      id: generateId(),
      word: formWord,
      reading: formReading,
      meaning_ja: formMeaningJa,
      meaning_vi: formMeaningVi,
      example: formExample,
      reps: 0,
      interval: 0,
      easiness: 2.5,
      dueDate: Date.now(),
      lapses: 0 // Added lapses to track forgets
    };
    vocabList.push(cardToSave);
    showToast("単語を追加しました");
  }

  if (user) {
    await saveWordToDb(user.uid, cardToSave);
  } else {
    // Local fallback
    localStorage.setItem('nihongo_study_data', JSON.stringify(vocabList));
  }
  
  closeWordModal();
  renderVocabList();
  if (onUpdate) onUpdate();
}

export async function deleteWord(id, onUpdate) {
  customConfirm("この単語を削除してもよろしいですか？", async () => {
    vocabList = vocabList.filter(c => c.id !== id);
    const user = getCurrentUser();
    if (user) {
      await deleteWordFromDb(user.uid, id);
    } else {
      localStorage.setItem('nihongo_study_data', JSON.stringify(vocabList));
    }
    renderVocabList();
    showToast("単語を削除しました", "success");
    if(onUpdate) onUpdate();
  });
}

export function filterVocab() {
  const query = document.getElementById('search-bar').value.toLowerCase();
  const filter = document.getElementById('filter-status').value;
  
  let filtered = vocabList.filter(card => 
    card.word.toLowerCase().includes(query) || 
    (card.meaning_ja && card.meaning_ja.toLowerCase().includes(query)) ||
    (card.meaning_vi && card.meaning_vi.toLowerCase().includes(query))
  );

  if (filter === 'new') filtered = filtered.filter(c => c.reps === 0);
  if (filter === 'learning') filtered = filtered.filter(c => c.reps > 0 && c.interval < 21);
  if (filter === 'learned') filtered = filtered.filter(c => c.interval >= 21);

  renderVocabList(filtered);
}
