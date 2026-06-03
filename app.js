// State management
let vocabList = [];
let reviewQueue = [];
let currentReviewIndex = 0;
let isCardFlipped = false;
let statusChart = null;

// Sample data for initial setup
const sampleWords = [
  {
    id: 1717410000001,
    word: "一期一会",
    reading: "いちごいちえ",
    meaning: "一生に一度だけの機会",
    example: "一期一会の出会いを大切にする。",
    state: "new",
    repetition: 0,
    interval: 0,
    efactor: 2.5,
    dueDate: Date.now() // Today
  },
  {
    id: 1717410000002,
    word: "温故知新",
    reading: "おんこちしん",
    meaning: "古いことを学び新しい知識を得る",
    example: "歴史を学び温故知新の精神を持つ。",
    state: "learning",
    repetition: 1,
    interval: 1,
    efactor: 2.4,
    dueDate: Date.now() - 24 * 60 * 60 * 1000 // Overdue (Yesterday)
  },
  {
    id: 1717410000003,
    word: "猫に小判",
    reading: "ねこにこばん",
    meaning: "価値のわからない人に貴重なものを与えても無駄であること",
    example: "彼に高級カメラをプレゼントしても猫に小判だ。",
    state: "learned",
    repetition: 4,
    interval: 8,
    efactor: 2.6,
    dueDate: Date.now() + 5 * 24 * 60 * 60 * 1000 // In future (5 days later)
  }
];

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  switchView('dashboard');
  initScratchpad();
  lucide.createIcons();
});

// --- LocalStorage persistence ---
function loadData() {
  const storedData = localStorage.getItem("ankiflow_cards");
  if (storedData) {
    try {
      vocabList = JSON.parse(storedData);
    } catch (e) {
      showToast("データの読み込み中にエラーが発生しました。リセットします。", "danger");
      vocabList = [...sampleWords];
      saveToStorage();
    }
  } else {
    // Load sample data for first time users
    vocabList = [...sampleWords];
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem("ankiflow_cards", JSON.stringify(vocabList));
}

// --- Navigation & View Switching ---
function switchView(viewId) {
  // Hide all sections
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.add("hidden");
  });

  // Remove active state from nav buttons
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // Show selected section
  const targetSec = document.getElementById(`${viewId}-view`);
  if (targetSec) {
    targetSec.classList.remove("hidden");
  }

  // Set active class to nav button
  const targetNav = document.getElementById(`nav-${viewId}`);
  if (targetNav) {
    targetNav.classList.add("active");
  }

  // Trigger view specific rendering
  if (viewId === 'dashboard') {
    renderDashboard();
  } else if (viewId === 'vocab') {
    renderVocabGrid();
  }
}

// --- Dashboard Logic ---
function renderDashboard() {
  const total = vocabList.length;
  const now = Date.now();
  
  // Calculate stats
  const due = vocabList.filter(card => card.dueDate <= now).length;
  const learning = vocabList.filter(card => card.state === 'learning').length;
  const learned = vocabList.filter(card => card.state === 'learned').length;
  const brandNew = vocabList.filter(card => card.state === 'new').length;

  document.getElementById("stat-total-count").textContent = total;
  document.getElementById("stat-due-count").textContent = due;
  document.getElementById("stat-learning-count").textContent = learning;
  document.getElementById("stat-learned-count").textContent = learned;

  // Render chart
  const ctx = document.getElementById('statusChart').getContext('2d');
  
  if (statusChart) {
    statusChart.destroy();
  }

  statusChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['新規単語', '学習中', '習得済み'],
      datasets: [{
        data: [brandNew, learning, learned],
        backgroundColor: [
          '#60a5fa', // Bright Blue
          '#fbbf24', // Bright Yellow
          '#34d399'  // Bright Green
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: "'Inter', 'Noto Sans JP', sans-serif",
              size: 12
            },
            color: '#1e293b'
          }
        }
      },
      cutout: '70%'
    }
  });
}

// --- Vocabulary List Logic ---
function renderVocabGrid() {
  const grid = document.getElementById("vocab-grid");
  const emptyState = document.getElementById("vocab-empty-state");
  const query = document.getElementById("search-bar").value.toLowerCase().trim();
  const statusFilter = document.getElementById("filter-status").value;

  // Filtering
  const filtered = vocabList.filter(card => {
    const matchesSearch = 
      card.word.toLowerCase().includes(query) ||
      (card.reading && card.reading.toLowerCase().includes(query)) ||
      card.meaning.toLowerCase().includes(query);
    
    const matchesStatus = 
      statusFilter === 'all' || 
      card.state === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Render grid
  grid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    grid.classList.add("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  grid.classList.remove("hidden");

  filtered.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.className = "vocab-card";
    
    let badgeText = "新規";
    let badgeClass = "badge-new";
    if (card.state === 'learning') {
      badgeText = "学習中";
      badgeClass = "badge-learning";
    } else if (card.state === 'learned') {
      badgeText = "習得済み";
      badgeClass = "badge-learned";
    }

    const nextReview = new Date(card.dueDate).toLocaleDateString('ja-JP');
    const displayExample = card.example ? `<p class="vocab-example-text">"${card.example}"</p>` : '';

    cardEl.innerHTML = `
      <div class="vocab-card-header">
        <span class="badge ${badgeClass}">${badgeText}</span>
        <div class="vocab-actions">
          <button class="vocab-action-btn" onclick="openEditModal(${card.id})" title="編集">
            <i data-lucide="edit-2" style="width: 1rem; height: 1rem;"></i>
          </button>
          <button class="vocab-action-btn delete" onclick="deleteWord(${card.id})" title="削除">
            <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
          </button>
        </div>
      </div>
      <div class="vocab-card-body">
        <h3 class="vocab-word">${card.word}</h3>
        ${card.reading ? `<p style="color: var(--text-muted); font-size: 0.85rem; margin-top: -0.25rem; margin-bottom: 0.5rem;">${card.reading}</p>` : ''}
        <p class="vocab-meaning">${card.meaning}</p>
        ${displayExample}
      </div>
      <div class="vocab-card-footer">
        <span>復習間隔: ${card.interval} 日</span>
        <span>次回の復習: ${nextReview}</span>
      </div>
    `;

    grid.appendChild(cardEl);
  });

  lucide.createIcons();
}

function filterVocab() {
  renderVocabGrid();
}

// --- Spaced Repetition Review Logic ---
function startReviewSession() {
  const now = Date.now();
  // Filter cards due today (or overdue)
  reviewQueue = vocabList.filter(card => card.dueDate <= now);
  
  if (reviewQueue.length === 0) {
    if (vocabList.length === 0) {
      showToast("単語が登録されていません。まずは単語を追加しましょう！", "warning");
      switchView('vocab');
      return;
    }
    
    // Suggest custom session
    if (confirm("今日の復習は完了しています！追加の学習（すべての単語からランダムに5枚復習）を開始しますか？")) {
      // Pick up to 5 cards randomly
      reviewQueue = [...vocabList]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
    } else {
      switchView('dashboard');
      return;
    }
  }

  // Shuffle queue to randomize review
  reviewQueue.sort(() => 0.5 - Math.random());
  
  currentReviewIndex = 0;
  isCardFlipped = false;
  
  switchView('review');
  showCurrentCard();
}

function showCurrentCard() {
  if (currentReviewIndex >= reviewQueue.length) {
    showToast("今日の復習はすべて完了しました！お疲れ様でした。🍵", "success");
    switchView('dashboard');
    return;
  }

  const card = reviewQueue[currentReviewIndex];
  
  // Clear handwriting canvas for the new card
  clearScratchpad();

  // Reset card state (unflip)
  const flashcard = document.getElementById("flashcard");
  flashcard.classList.remove("is-flipped");
  isCardFlipped = false;

  // Set card front data
  document.getElementById("card-word").textContent = card.word;
  document.getElementById("card-reading").textContent = card.reading || "";
  
  // Set card back data
  document.getElementById("card-meaning").textContent = card.meaning;
  document.getElementById("card-example").textContent = card.example || "（例文はありません）";

  // Progress Bar
  const progressPercent = (currentReviewIndex / reviewQueue.length) * 100;
  document.getElementById("review-progress").style.width = `${progressPercent}%`;
  document.getElementById("review-progress-text").textContent = `進捗: ${currentReviewIndex} / ${reviewQueue.length} 枚 (残り ${reviewQueue.length - currentReviewIndex} 枚)`;

  // Toggle buttons
  document.getElementById("reveal-instruction").classList.remove("hidden");
  document.getElementById("answer-controls").classList.add("hidden");
}

function flipCard() {
  const flashcard = document.getElementById("flashcard");
  isCardFlipped = !isCardFlipped;
  
  if (isCardFlipped) {
    flashcard.classList.add("is-flipped");
    document.getElementById("reveal-instruction").classList.add("hidden");
    document.getElementById("answer-controls").classList.remove("hidden");
  } else {
    flashcard.classList.remove("is-flipped");
    document.getElementById("reveal-instruction").classList.remove("hidden");
    document.getElementById("answer-controls").classList.add("hidden");
  }
}

// SM-2 Algorithm Submission
function submitAnswer(score) {
  const card = reviewQueue[currentReviewIndex];
  
  // Find card in global array
  const originalCard = vocabList.find(c => c.id === card.id);
  
  if (originalCard) {
    // SM-2 Spaced Repetition Algorithm
    // score definitions: 1 = Again (forgot), 3 = Hard (barely remembered), 5 = Good (remembered well)
    
    if (score === 1) {
      originalCard.repetition = 0;
      originalCard.interval = 1;
      originalCard.efactor = Math.max(1.3, originalCard.efactor - 0.2);
      originalCard.state = 'learning';
    } else if (score === 3) {
      originalCard.repetition = Math.max(1, originalCard.repetition);
      originalCard.interval = originalCard.repetition === 1 ? 1 : originalCard.repetition === 2 ? 3 : Math.ceil(originalCard.interval * 1.2);
      originalCard.efactor = Math.max(1.3, originalCard.efactor - 0.15);
      originalCard.state = 'learning';
    } else if (score === 5) {
      originalCard.repetition += 1;
      if (originalCard.repetition === 1) {
        originalCard.interval = 1;
      } else if (originalCard.repetition === 2) {
        originalCard.interval = 4;
      } else {
        originalCard.interval = Math.ceil(originalCard.interval * originalCard.efactor);
      }
      originalCard.efactor = originalCard.efactor + 0.1;
      originalCard.state = originalCard.repetition >= 4 ? 'learned' : 'learning';
    }

    // Set new due date (current time + interval days)
    const extraTime = originalCard.interval * 24 * 60 * 60 * 1000;
    originalCard.dueDate = Date.now() + extraTime;

    saveToStorage();
  }

  // Go to next card
  currentReviewIndex++;
  
  // Play minor slide transition by unflipping card first briefly
  const flashcard = document.getElementById("flashcard");
  flashcard.classList.remove("is-flipped");
  
  setTimeout(() => {
    showCurrentCard();
  }, 200); // Small delay to let card unflip before showing new content
}

function exitReviewSession() {
  if (confirm("復習を終了してよろしいですか？学習結果は現在処理されたものまで保存されます。")) {
    switchView('dashboard');
  }
}

// --- Add/Edit Word Modal Logic ---
function openAddModal() {
  document.getElementById("modal-title").textContent = "新しい単語を追加";
  document.getElementById("word-id").value = "";
  document.getElementById("word-form").reset();
  
  const modal = document.getElementById("word-modal");
  modal.classList.add("show");
}

function openEditModal(id) {
  const card = vocabList.find(c => c.id === id);
  if (!card) return;

  document.getElementById("modal-title").textContent = "単語を編集";
  document.getElementById("word-id").value = card.id;
  document.getElementById("form-word").value = card.word;
  document.getElementById("form-reading").value = card.reading || "";
  document.getElementById("form-meaning").value = card.meaning;
  document.getElementById("form-example").value = card.example || "";

  const modal = document.getElementById("word-modal");
  modal.classList.add("show");
}

function closeWordModal() {
  const modal = document.getElementById("word-modal");
  modal.classList.remove("show");
}

function saveWord(event) {
  event.preventDefault();
  
  const idVal = document.getElementById("word-id").value;
  const word = document.getElementById("form-word").value.trim();
  const reading = document.getElementById("form-reading").value.trim();
  const meaning = document.getElementById("form-meaning").value.trim();
  const example = document.getElementById("form-example").value.trim();

  if (idVal) {
    // Edit existing
    const cardId = parseInt(idVal);
    const card = vocabList.find(c => c.id === cardId);
    if (card) {
      card.word = word;
      card.reading = reading;
      card.meaning = meaning;
      card.example = example;
      showToast("単語を更新しました", "success");
    }
  } else {
    // Add new
    const newCard = {
      id: Date.now(),
      word: word,
      reading: reading,
      meaning: meaning,
      example: example,
      state: 'new',
      repetition: 0,
      interval: 0,
      efactor: 2.5,
      dueDate: Date.now() // Due immediately
    };
    vocabList.push(newCard);
    showToast("新しい単語を追加しました", "success");
  }

  saveToStorage();
  closeWordModal();
  
  // Refresh views
  const activeNav = document.querySelector(".nav-btn.active");
  if (activeNav) {
    const activeView = activeNav.id.replace("nav-", "");
    switchView(activeView);
  }
}

// Word deletion (requires confirm dialog)
function deleteWord(id) {
  const card = vocabList.find(c => c.id === id);
  if (!card) return;

  // Confirm delete with native modal
  if (confirm(`「${card.word}」を単語帳から削除しますか？\n※この操作は取り消せません。`)) {
    vocabList = vocabList.filter(c => c.id !== id);
    saveToStorage();
    showToast("単語を削除しました", "success");
    renderVocabGrid();
    renderDashboard();
  }
}

// --- Import / Export ---
function exportData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vocabList, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `word_learning_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("単語データをエクスポートしました", "success");
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsedData = JSON.parse(e.target.result);
      
      // Basic structure validation
      if (!Array.isArray(parsedData)) {
        throw new Error("インポートデータのフォーマットが正しくありません（配列である必要があります）");
      }

      // Merge and sanitize records
      let importedCount = 0;
      parsedData.forEach(item => {
        if (item.word && item.meaning) {
          // Check if already exists (by word or id)
          const exists = vocabList.some(c => c.id === item.id || c.word === item.word);
          if (!exists) {
            vocabList.push({
              id: item.id || Date.now() + importedCount,
              word: item.word,
              reading: item.reading || "",
              meaning: item.meaning,
              example: item.example || "",
              state: item.state || "new",
              repetition: item.repetition || 0,
              interval: item.interval || 0,
              efactor: item.efactor || 2.5,
              dueDate: item.dueDate || Date.now()
            });
            importedCount++;
          }
        }
      });

      if (importedCount > 0) {
        saveToStorage();
        showToast(`${importedCount} 件の単語を新しく読み込みました！`, "success");
        switchView('dashboard');
      } else {
        showToast("新規に読み込む単語はありませんでした（重複または不正なデータ）", "warning");
      }
    } catch (err) {
      showToast("インポートに失敗しました。ファイル形式を確認してください。", "danger");
      console.error(err);
    }
    // Reset input
    event.target.value = "";
  };
  reader.readAsText(file);
}

// --- Toast Notifications ---
function showToast(message, type = "primary") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let iconName = "info";
  if (type === "success") iconName = "check-circle";
  if (type === "warning") iconName = "alert-triangle";
  if (type === "danger") iconName = "x-circle";

  toast.innerHTML = `
    <i data-lucide="${iconName}" style="width: 1.25rem; height: 1.25rem;"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();

  // Trigger animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// --- Handwriting Scratchpad Logic ---
let canvas = null;
let ctx = null;
let isDrawing = false;

function initScratchpad() {
  canvas = document.getElementById("scratchpad");
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  
  // Setup pen styles (Deep Sumi Ink color)
  ctx.strokeStyle = "#111827"; 
  ctx.lineWidth = 3.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  
  // Mouse events
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);
  
  // Touch events (for mobile devices)
  canvas.addEventListener("touchstart", startDrawingTouch, { passive: false });
  canvas.addEventListener("touchmove", drawTouch, { passive: false });
  canvas.addEventListener("touchend", stopDrawing);
}

function getCanvasCoords(e, isTouch = false) {
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const clientX = isTouch ? e.touches[0].clientX : e.clientX;
  const clientY = isTouch ? e.touches[0].clientY : e.clientY;
  
  // Convert standard mouse/touch coords to responsive canvas scale coordinates
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  const coords = getCanvasCoords(e);
  ctx.moveTo(coords.x, coords.y);
}

function startDrawingTouch(e) {
  e.preventDefault(); // Stop mobile page scroll
  isDrawing = true;
  ctx.beginPath();
  const coords = getCanvasCoords(e, true);
  ctx.moveTo(coords.x, coords.y);
}

function draw(e) {
  if (!isDrawing) return;
  const coords = getCanvasCoords(e);
  ctx.lineTo(coords.x, coords.y);
  ctx.stroke();
}

function drawTouch(e) {
  e.preventDefault(); // Stop mobile page scroll
  if (!isDrawing) return;
  const coords = getCanvasCoords(e, true);
  ctx.lineTo(coords.x, coords.y);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
}

function clearScratchpad(e) {
  if (e) e.stopPropagation(); // Avoid triggering card flip if clear button clicked
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

