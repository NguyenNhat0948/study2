import { escapeHtml } from './utils.js';

export function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  
  const targetView = document.getElementById(`${viewId}-view`);
  if (targetView) targetView.classList.remove('hidden');
  
  const navBtn = document.getElementById(`nav-${viewId}`);
  if (navBtn) navBtn.classList.add('active');
}

export function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="loading-spinner" style="text-align:center; padding: 3rem;">
      <i data-lucide="loader-2" class="spin" style="width: 2rem; height: 2rem; animation: spin 1s linear infinite; color: var(--color-primary);"></i>
      <p style="color: var(--text-muted); margin-top: 1rem;">データを読み込んでいます...</p>
    </div>
  `;
  lucide.createIcons({ root: container });
}

export function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
}

export function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  
  if (isDark) {
    document.documentElement.classList.add('dark-mode');
  }
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  btn.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i>`;
  lucide.createIcons({ root: btn });
}

export function customConfirm(message, onConfirm) {
  const overlay = document.getElementById('custom-confirm-overlay');
  document.getElementById('custom-confirm-msg').innerText = message;
  
  const confirmBtn = document.getElementById('custom-confirm-yes');
  const cancelBtn = document.getElementById('custom-confirm-no');
  
  const close = () => { overlay.classList.remove('show'); };
  
  confirmBtn.onclick = () => {
    close();
    onConfirm();
  };
  cancelBtn.onclick = close;
  
  overlay.classList.add('show');
}
