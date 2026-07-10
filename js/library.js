import { escapeHtml, showToast, generateId } from './utils.js';
import { getVocabList, setVocabList } from './vocab.js';
import { saveWordToDb, getCurrentUser } from './db.js';

export function renderLibrary(filter = 'all') {
  if (!window.VOCAB_LIBRARY) return;
  const grid = document.getElementById('library-grid');
  
  let sets = window.VOCAB_LIBRARY;
  if (filter !== 'all') {
    sets = sets.filter(s => s.category === filter);
  }

  // Safe rendering to prevent Stored XSS
  grid.innerHTML = '';
  sets.forEach(set => {
    const div = document.createElement('div');
    div.className = 'library-card';
    
    div.innerHTML = `
      <div class="library-card-banner ${escapeHtml(set.category)}"></div>
      <div class="library-card-body">
        <div class="library-card-icon">${escapeHtml(set.icon)}</div>
        <h3 class="library-card-title">${escapeHtml(set.title)}</h3>
        <div class="library-card-title-vi">${escapeHtml(set.title_vi)}</div>
        <p class="library-card-desc">${escapeHtml(set.description)}<br>
           <span style="color: var(--text-muted); font-size: 0.8rem;">${escapeHtml(set.description_vi)}</span>
        </p>
        <div class="library-card-meta">
          <div class="library-card-meta-left">
            <span><i data-lucide="layers" style="width: 14px;"></i> ${set.words.length}語</span>
            <span class="difficulty-stars" aria-label="難易度 ${set.difficulty}">${'★'.repeat(set.difficulty)}${'☆'.repeat(5 - set.difficulty)}</span>
          </div>
          <button class="btn btn-primary btn-add-set" aria-label="セットを追加" data-id="${escapeHtml(set.id)}">追加</button>
        </div>
      </div>
    `;
    
    div.querySelector('.btn-add-set').addEventListener('click', () => addSetToMyVocab(set.id, window.updateDashboard));
    grid.appendChild(div);
  });
  
  lucide.createIcons({ root: grid });
}

export async function addSetToMyVocab(setId, onDashboardUpdate) {
  const set = window.VOCAB_LIBRARY.find(s => s.id === setId);
  if (!set) return;

  const vocabList = getVocabList();
  const user = getCurrentUser();
  let addedCount = 0;
  
  for (const w of set.words) {
    // Bug fix: Check by combination of word and reading to avoid overly strict duplicates
    const isDuplicate = vocabList.some(c => c.word === w.word && c.reading === w.reading);
    if (!isDuplicate) {
      const newCard = {
        id: generateId(),
        ...w,
        reps: 0, interval: 0, easiness: 2.5, dueDate: Date.now(), lapses: 0
      };
      vocabList.push(newCard);
      addedCount++;
      if (user) {
        await saveWordToDb(user.uid, newCard);
      }
    }
  }

  if (addedCount > 0) {
    setVocabList(vocabList);
    if (!user) {
      localStorage.setItem('nihongo_study_data', JSON.stringify(vocabList));
    }
    showToast(`${set.title} から ${addedCount}単語を追加しました！`, "success");
    if(onDashboardUpdate) onDashboardUpdate();
  } else {
    showToast("すべての単語が既に追加されています。", "warning");
  }
}
