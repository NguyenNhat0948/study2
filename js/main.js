import { getAuth, getCurrentUser, fetchVocabList, migrateLegacyDataIfNeeded } from './db.js';
import { setupAuthUI } from './auth.js';
import { switchView, showLoading, toggleDarkMode, initTheme } from './ui.js';
import { getVocabList, setVocabList, renderVocabList, filterVocab, openAddModal, closeWordModal, saveWord } from './vocab.js';
import { startReviewSession, flipCard, submitAnswer, exitReviewSession } from './review.js';
import { renderLibrary } from './library.js';
import { showToast, generateId, debounce } from './utils.js';

let statusChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  // Init lucide & theme
  lucide.createIcons();
  initTheme();
  
  // Expose global for callback from other modules
  window.updateDashboard = initDashboard;
  
  // Binding global UI buttons
  document.getElementById('nav-dashboard').addEventListener('click', () => { switchView('dashboard'); initDashboard(); });
  document.getElementById('nav-vocab').addEventListener('click', () => { switchView('vocab'); renderVocabList(); });
  document.getElementById('nav-library').addEventListener('click', () => { switchView('library'); renderLibrary(); });
  document.getElementById('nav-review').addEventListener('click', startReviewSession);
  
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleDarkMode);
  
  // Dashboard quick actions
  document.getElementById('btn-quick-review').addEventListener('click', startReviewSession);
  document.getElementById('btn-quick-add').addEventListener('click', () => openAddModal());
  document.getElementById('btn-quick-lib').addEventListener('click', () => { switchView('library'); renderLibrary(); });
  
  // Vocab View
  const searchBar = document.getElementById('search-bar');
  const filterStatus = document.getElementById('filter-status');
  searchBar.addEventListener('input', debounce(filterVocab, 300));
  filterStatus.addEventListener('change', filterVocab);
  document.getElementById('btn-add-vocab').addEventListener('click', () => openAddModal());
  document.getElementById('btn-empty-lib').addEventListener('click', () => { switchView('library'); renderLibrary(); });
  
  // Word Modal
  document.getElementById('word-form').addEventListener('submit', (e) => saveWord(e, initDashboard));
  document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeWordModal));
  document.getElementById('btn-cancel-modal').addEventListener('click', closeWordModal);
  
  // Review View
  document.getElementById('flashcard').addEventListener('click', flipCard);
  document.getElementById('btn-ans-again').addEventListener('click', () => submitAnswer(1, initDashboard));
  document.getElementById('btn-ans-hard').addEventListener('click', () => submitAnswer(3, initDashboard));
  document.getElementById('btn-ans-good').addEventListener('click', () => submitAnswer(5, initDashboard));
  document.getElementById('btn-exit-review').addEventListener('click', exitReviewSession);

  // Library View (Filter chips)
  document.getElementById('filter-lib-all').addEventListener('click', (e) => handleLibFilter(e, 'all'));
  document.getElementById('filter-lib-jlpt').addEventListener('click', (e) => handleLibFilter(e, 'jlpt'));
  document.getElementById('filter-lib-theme').addEventListener('click', (e) => handleLibFilter(e, 'theme'));

  // Keyboard accessibility for Review
  document.addEventListener('keydown', (e) => {
    const reviewView = document.getElementById('review-view');
    if (!reviewView || reviewView.classList.contains('hidden')) return;
    
    // Ignore if modal is open
    if (document.getElementById('word-modal').classList.contains('show') || document.getElementById('custom-confirm-overlay').classList.contains('show')) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      flipCard();
    } else if (!document.getElementById('answer-controls').classList.contains('hidden')) {
      if (e.key === '1') { e.preventDefault(); submitAnswer(1, initDashboard); }
      if (e.key === '2') { e.preventDefault(); submitAnswer(3, initDashboard); }
      if (e.key === '3') { e.preventDefault(); submitAnswer(5, initDashboard); }
    }
  });

  // Backup
  document.getElementById('btn-export').addEventListener('click', exportData);
  document.getElementById('import-file').addEventListener('change', importData);

  // Init Auth logic
  setupAuthUI(handleLoginSuccess, handleLogoutSuccess);
  
  const auth = getAuth();
  if (auth) {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        handleLoginSuccess(user);
      } else {
        handleLogoutSuccess();
      }
    });
  } else {
    // If Firebase fails or is missing config
    showToast('Firebaseの設定がありません。ローカルストレージを使用します。', 'warning');
    handleLogoutSuccess(); 
  }
});

function handleLibFilter(e, filter) {
  document.querySelectorAll('.filter-chip').forEach(el => el.classList.remove('active'));
  e.currentTarget.classList.add('active');
  renderLibrary(filter);
}

async function handleLoginSuccess(user) {
  const emailDisplay = document.getElementById('user-email-display');
  if(emailDisplay) emailDisplay.innerText = user?.email || 'Guest';
  
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  
  showLoading('vocab-grid');
  
  if (user && getAuth()) {
    await migrateLegacyDataIfNeeded(user.uid);
    const list = await fetchVocabList(user.uid);
    setVocabList(list);
  } else {
    const data = localStorage.getItem('nihongo_study_data');
    setVocabList(data ? JSON.parse(data) : []);
  }
  
  initDashboard();
  renderLibrary();
}

function handleLogoutSuccess() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app-screen').classList.add('hidden');
}

function initDashboard() {
  const vocabList = getVocabList();
  const now = Date.now();
  let due = 0;
  let learning = 0;
  let learned = 0;

  vocabList.forEach(card => {
    if (card.dueDate <= now) due++;
    if (card.reps > 0 && card.interval < 21) learning++;
    if (card.interval >= 21) learned++;
  });

  document.getElementById('stat-total-count').innerText = vocabList.length;
  document.getElementById('stat-due-count').innerText = due;
  document.getElementById('stat-learning-count').innerText = learning;
  document.getElementById('stat-learned-count').innerText = learned;
  
  renderChart(learning, learned, vocabList.length - learning - learned);
}

function renderChart(learning, learned, newCards) {
  const ctx = document.getElementById('statusChart').getContext('2d');
  if (statusChartInstance) {
    statusChartInstance.destroy();
  }
  
  const isDark = document.documentElement.classList.contains('dark-mode');
  const textColor = isDark ? '#f8fafc' : '#64748b';

  statusChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['新規', '学習中', '習得済み'],
      datasets: [{
        data: [newCards, learning, learned],
        backgroundColor: ['#e2e8f0', '#3b82f6', '#10b981'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: { 
        legend: { 
          position: 'bottom',
          labels: { color: textColor }
        } 
      }
    }
  });
}

function exportData() {
  const vocabList = getVocabList();
  const dataStr = JSON.stringify(vocabList, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nihongo_study_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("データをエクスポートしました", "success");
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        // Schema Validation
        const validatedData = data.map(item => ({
          id: item.id || generateId(),
          word: item.word || 'Unknown',
          reading: item.reading || '',
          meaning_ja: item.meaning_ja || '',
          meaning_vi: item.meaning_vi || '',
          example: item.example || '',
          reps: item.reps || 0,
          interval: item.interval || 0,
          easiness: item.easiness || 2.5,
          dueDate: item.dueDate || Date.now(),
          lapses: item.lapses || 0
        }));

        setVocabList(validatedData);
        
        const user = getCurrentUser();
        if (user) {
          showToast("データベースへインポート中...", "warning");
          const dbModule = await import('./db.js');
          const batch = dbModule.getDb().batch();
          validatedData.forEach(card => {
            const { id, ...cData } = card;
            const ref = dbModule.getDb().collection('users').doc(user.uid).collection('vocab').doc(id);
            batch.set(ref, { ...cData, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
          });
          await batch.commit();
        } else {
          localStorage.setItem('nihongo_study_data', JSON.stringify(validatedData));
        }
        
        initDashboard();
        showToast("データを復元しました", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("ファイルの読み込みに失敗しました", "danger");
    }
  };
  reader.readAsText(file);
}
