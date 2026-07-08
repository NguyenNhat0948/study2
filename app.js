// ============================================
// FIREBASE CONFIGURATION (Google)
// ============================================
// TODO: ここにFirebaseのプロジェクト設定を貼り付けます。
// （後ほど案内する手順に沿って取得してください）
const firebaseConfig = {
  apiKey: "AIzaSyARBZCcW2rcMaSETIPTt53y5LUyzZmR0AI",
  authDomain: "nihongo-a0795.firebaseapp.com",
  projectId: "nihongo-a0795",
  storageBucket: "nihongo-a0795.firebasestorage.app",
  messagingSenderId: "92477688249",
  appId: "1:92477688249:web:6cb13bd33fe06e3fa88e68",
  measurementId: "G-0KL4T6F2EC"
};

// Initialize Firebase (エラーハンドリング付き)
let auth;
let db;
try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// ============================================
// APP STATE
// ============================================
let vocabList = [];
let reviewQueue = [];
let currentCardIndex = 0;
let isFlipped = false;
let currentUser = null;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Setup Lucide icons
  lucide.createIcons();
  
  // Setup Auth Listener if Firebase is configured
  if (auth) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        currentUser = user;
        document.getElementById('user-email-display').innerText = user.email;
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        loadDataFromFirestore();
        initDashboard();
        renderLibrary();
      } else {
        currentUser = null;
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('app-screen').classList.add('hidden');
      }
    });
  } else {
    // Fallback: If Firebase is not configured, show warning
    showToast('Firebaseが未設定です。設定手順を確認してください。', 'warning');
    // Allow local mock login for preview purposes
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
  }

});

// ============================================
// AUTHENTICATION LOGIC
// ============================================
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(el => el.classList.add('hidden'));
  
  if (tab === 'login') {
    document.querySelector('.auth-tab:nth-child(1)').classList.add('active');
    document.getElementById('login-form').classList.remove('hidden');
  } else {
    document.querySelector('.auth-tab:nth-child(2)').classList.add('active');
    document.getElementById('register-form').classList.remove('hidden');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  if (!auth) {
    mockLogin();
    return;
  }
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');
  const errorEl = document.getElementById('login-error');
  
  btn.disabled = true;
  btn.innerText = "ログイン中...";
  errorEl.classList.add('hidden');
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
    showToast("ログインしました", "success");
  } catch (error) {
    errorEl.innerText = getFirebaseErrorMessage(error.code);
    errorEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.innerText = "ログイン";
  }
}

async function handleRegister(e) {
  e.preventDefault();
  if (!auth) {
    showToast('Firebaseの設定が必要です。', 'warning');
    return;
  }
  
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-password-confirm').value;
  const btn = document.getElementById('register-btn');
  const errorEl = document.getElementById('register-error');
  
  if (password !== confirm) {
    errorEl.innerText = "パスワードが一致しません。";
    errorEl.classList.remove('hidden');
    return;
  }
  
  btn.disabled = true;
  btn.innerText = "登録中...";
  errorEl.classList.add('hidden');
  
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    showToast("アカウントを作成しました！", "success");
  } catch (error) {
    errorEl.innerText = getFirebaseErrorMessage(error.code);
    errorEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.innerText = "アカウントを作成";
  }
}

async function handleLogout() {
  if (auth) {
    await auth.signOut();
  } else {
    currentUser = null;
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
  }
  showToast("ログアウトしました", "success");
}

async function handlePasswordReset() {
  if (!auth) return;
  const email = prompt("パスワードをリセットするメールアドレスを入力してください:");
  if (email) {
    try {
      await auth.sendPasswordResetEmail(email);
      showToast("パスワードリセットのメールを送信しました。", "success");
    } catch (error) {
      showToast(getFirebaseErrorMessage(error.code), "danger");
    }
  }
}

function mockLogin() {
  showToast("プレビューモードでログインしました", "warning");
  currentUser = { email: "preview@example.com", uid: "preview123" };
  document.getElementById('user-email-display').innerText = currentUser.email;
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  loadDataFromLocalStorage();
  initDashboard();
  renderLibrary();
}

function getFirebaseErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found': return 'ユーザーが見つかりません。';
    case 'auth/wrong-password': return 'パスワードが間違っています。';
    case 'auth/email-already-in-use': return 'このメールアドレスは既に登録されています。';
    case 'auth/weak-password': return 'パスワードは6文字以上で設定してください。';
    default: return 'エラーが発生しました。もう一度お試しください。';
  }
}

// ============================================
// DATA MANAGEMENT
// ============================================
async function loadDataFromFirestore() {
  if (!db || !currentUser) return;
  try {
    const doc = await db.collection('users').doc(currentUser.uid).get();
    if (doc.exists && doc.data().vocabList) {
      vocabList = doc.data().vocabList;
    } else {
      vocabList = [];
    }
    initDashboard();
    renderVocabList();
  } catch (error) {
    console.error("Error loading data:", error);
    showToast("データの読み込みに失敗しました", "danger");
  }
}

async function saveDataToFirestore() {
  if (!db || !currentUser) {
    saveDataToLocalStorage();
    return;
  }
  try {
    await db.collection('users').doc(currentUser.uid).set({
      vocabList: vocabList,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving data:", error);
    showToast("データの保存に失敗しました", "danger");
  }
}

function loadDataFromLocalStorage() {
  const data = localStorage.getItem('nihongo_study_data');
  vocabList = data ? JSON.parse(data) : [];
}

function saveDataToLocalStorage() {
  localStorage.setItem('nihongo_study_data', JSON.stringify(vocabList));
}

// ============================================
// UI & NAVIGATION
// ============================================
function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  
  document.getElementById(`${viewId}-view`).classList.remove('hidden');
  const navBtn = document.getElementById(`nav-${viewId}`);
  if (navBtn) navBtn.classList.add('active');

  if (viewId === 'dashboard') initDashboard();
  if (viewId === 'vocab') renderVocabList();
  if (viewId === 'library') renderLibrary();
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// DASHBOARD
// ============================================
function initDashboard() {
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

let statusChartInstance = null;
function renderChart(learning, learned, newCards) {
  const ctx = document.getElementById('statusChart').getContext('2d');
  
  if (statusChartInstance) {
    statusChartInstance.destroy();
  }

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
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

// ============================================
// VOCABULARY MANAGEMENT
// ============================================
function openAddModal(id = null) {
  document.getElementById('word-form').reset();
  if (id) {
    const card = vocabList.find(c => c.id === id);
    if (card) {
      document.getElementById('modal-title').innerText = "単語を編集";
      document.getElementById('word-id').value = card.id;
      document.getElementById('form-word').value = card.word;
      document.getElementById('form-reading').value = card.reading;
      document.getElementById('form-meaning').value = card.meaning_ja;
      document.getElementById('form-meaning-vi').value = card.meaning_vi || '';
      document.getElementById('form-example').value = card.example || '';
    }
  } else {
    document.getElementById('modal-title').innerText = "新しい単語を追加";
    document.getElementById('word-id').value = "";
  }
  document.getElementById('word-modal').classList.add('show');
}

function closeWordModal() {
  document.getElementById('word-modal').classList.remove('show');
}

function saveWord(e) {
  e.preventDefault();
  const id = document.getElementById('word-id').value;
  const newCard = {
    word: document.getElementById('form-word').value,
    reading: document.getElementById('form-reading').value,
    meaning_ja: document.getElementById('form-meaning').value,
    meaning_vi: document.getElementById('form-meaning-vi').value,
    example: document.getElementById('form-example').value,
    reps: 0, interval: 0, easiness: 2.5, dueDate: Date.now()
  };

  if (id) {
    const idx = vocabList.findIndex(c => c.id === id);
    vocabList[idx] = { ...vocabList[idx], ...newCard };
    showToast("単語を更新しました");
  } else {
    newCard.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    vocabList.push(newCard);
    showToast("単語を追加しました");
  }

  saveDataToFirestore();
  closeWordModal();
  renderVocabList();
  initDashboard();
}

function deleteWord(id) {
  if (confirm("この単語を削除してもよろしいですか？")) {
    vocabList = vocabList.filter(c => c.id !== id);
    saveDataToFirestore();
    renderVocabList();
    initDashboard();
    showToast("単語を削除しました", "success");
  }
}

function renderVocabList(cards = vocabList) {
  const grid = document.getElementById('vocab-grid');
  const emptyState = document.getElementById('vocab-empty-state');
  
  if (cards.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  grid.innerHTML = cards.map(card => {
    let statusBadge = '';
    if (card.reps === 0) statusBadge = '<span class="badge badge-new">新規</span>';
    else if (card.interval >= 21) statusBadge = '<span class="badge badge-learned">習得済</span>';
    else statusBadge = '<span class="badge badge-learning">学習中</span>';

    return `
      <div class="vocab-card">
        <div class="vocab-card-header">
          ${statusBadge}
          <div class="vocab-actions">
            <button class="vocab-action-btn" onclick="openAddModal('${card.id}')"><i data-lucide="edit-2" style="width: 14px;"></i></button>
            <button class="vocab-action-btn delete" onclick="deleteWord('${card.id}')"><i data-lucide="trash-2" style="width: 14px;"></i></button>
          </div>
        </div>
        <div class="vocab-card-body">
          <div class="vocab-word">${card.word}</div>
          <div class="vocab-meaning">${card.meaning_ja}</div>
          ${card.meaning_vi ? `<div class="vocab-meaning-vi">${card.meaning_vi}</div>` : ''}
          ${card.example ? `<div class="vocab-example-text">${card.example}</div>` : ''}
        </div>
        <div class="vocab-card-footer">
          <span>次の復習: ${new Date(card.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    `;
  }).join('');
  lucide.createIcons();
}

function filterVocab() {
  const query = document.getElementById('search-bar').value.toLowerCase();
  const filter = document.getElementById('filter-status').value;
  
  let filtered = vocabList.filter(card => 
    card.word.toLowerCase().includes(query) || 
    card.meaning_ja.toLowerCase().includes(query) ||
    (card.meaning_vi && card.meaning_vi.toLowerCase().includes(query))
  );

  if (filter === 'new') filtered = filtered.filter(c => c.reps === 0);
  if (filter === 'learning') filtered = filtered.filter(c => c.reps > 0 && c.interval < 21);
  if (filter === 'learned') filtered = filtered.filter(c => c.interval >= 21);

  renderVocabList(filtered);
}

// ============================================
// LIBRARY (Curated Sets)
// ============================================
function renderLibrary(filter = 'all') {
  if (!window.VOCAB_LIBRARY) return;
  const grid = document.getElementById('library-grid');
  
  let sets = window.VOCAB_LIBRARY;
  if (filter !== 'all') {
    sets = sets.filter(s => s.category === filter);
  }

  grid.innerHTML = sets.map(set => `
    <div class="library-card">
      <div class="library-card-banner ${set.category}"></div>
      <div class="library-card-body">
        <div class="library-card-icon">${set.icon}</div>
        <h3 class="library-card-title">${set.title}</h3>
        <div class="library-card-title-vi">${set.title_vi}</div>
        <p class="library-card-desc">${set.description}<br><span style="color: var(--text-muted); font-size: 0.8rem;">${set.description_vi}</span></p>
        <div class="library-card-meta">
          <div class="library-card-meta-left">
            <span><i data-lucide="layers" style="width: 14px;"></i> ${set.words.length}語</span>
            <span class="difficulty-stars">${'★'.repeat(set.difficulty)}${'☆'.repeat(5 - set.difficulty)}</span>
          </div>
          <button class="btn btn-primary btn-add-set" onclick="addSetToMyVocab('${set.id}')">
            追加
          </button>
        </div>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

function filterLibrary(filter) {
  document.querySelectorAll('.filter-chip').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
  renderLibrary(filter);
}

function addSetToMyVocab(setId) {
  const set = window.VOCAB_LIBRARY.find(s => s.id === setId);
  if (!set) return;

  let addedCount = 0;
  set.words.forEach(w => {
    // Avoid exact duplicates
    if (!vocabList.some(c => c.word === w.word)) {
      vocabList.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...w,
        reps: 0, interval: 0, easiness: 2.5, dueDate: Date.now()
      });
      addedCount++;
    }
  });

  if (addedCount > 0) {
    saveDataToFirestore();
    showToast(`${set.title} から ${addedCount}単語を追加しました！`, "success");
    initDashboard();
  } else {
    showToast("すべての単語が既に追加されています。", "warning");
  }
}

// ============================================
// REVIEW SYSTEM (SM-2 ALGORITHM)
// ============================================
function startReviewSession() {
  const now = Date.now();
  reviewQueue = vocabList.filter(card => card.dueDate <= now);
  
  if (reviewQueue.length === 0) {
    showToast("今日の復習はすべて完了しました！お疲れ様です 🎉", "success");
    return;
  }
  
  // Shuffle queue
  reviewQueue = reviewQueue.sort(() => Math.random() - 0.5);
  currentCardIndex = 0;
  
  switchView('review');
  showCard();
}

function showCard() {
  if (currentCardIndex >= reviewQueue.length) {
    saveDataToFirestore();
    exitReviewSession();
    showToast("復習セッションが完了しました！", "success");
    return;
  }

  isFlipped = false;
  const card = reviewQueue[currentCardIndex];
  
  document.getElementById('flashcard').classList.remove('is-flipped');
  document.getElementById('answer-controls').classList.add('hidden');
  document.getElementById('reveal-instruction').classList.remove('hidden');
  
  document.getElementById('card-word').innerText = card.word;
  document.getElementById('card-reading').innerText = card.reading;
  document.getElementById('card-meaning').innerText = card.meaning_ja;
  document.getElementById('card-meaning-vi').innerText = card.meaning_vi || '';
  document.getElementById('card-example').innerText = card.example || '';
  
  updateProgress();
}

function flipCard() {
  if (isFlipped) return;
  isFlipped = true;
  document.getElementById('flashcard').classList.add('is-flipped');
  document.getElementById('answer-controls').classList.remove('hidden');
  document.getElementById('reveal-instruction').classList.add('hidden');
}

function submitAnswer(quality) {
  let card = reviewQueue[currentCardIndex];
  
  // SM-2 Algorithm implementation
  if (quality < 3) {
    card.reps = 0;
    card.interval = 1;
  } else {
    if (card.reps === 0) card.interval = 1;
    else if (card.reps === 1) card.interval = 6;
    else card.interval = Math.round(card.interval * card.easiness);
    card.reps++;
  }
  
  card.easiness = card.easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (card.easiness < 1.3) card.easiness = 1.3;
  
  // 1 day = 86400000 ms
  card.dueDate = Date.now() + card.interval * 86400000;
  
  // Update in main list
  const idx = vocabList.findIndex(c => c.id === card.id);
  if (idx !== -1) vocabList[idx] = card;

  currentCardIndex++;
  showCard();
}

function updateProgress() {
  const remaining = reviewQueue.length - currentCardIndex;
  const progressPercent = (currentCardIndex / reviewQueue.length) * 100;
  document.getElementById('review-progress').style.width = `${progressPercent}%`;
  document.getElementById('review-progress-text').innerText = `残り ${remaining} 枚`;
}

function exitReviewSession() {
  switchView('dashboard');
}


// ============================================
// BACKUP / EXPORT
// ============================================
function exportData() {
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

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        vocabList = data;
        saveDataToFirestore();
        initDashboard();
        showToast("データを復元しました", "success");
      }
    } catch (err) {
      showToast("ファイルの読み込みに失敗しました", "danger");
    }
  };
  reader.readAsText(file);
}
