import { getAuth, getCurrentUser, setCurrentUser } from './db.js';
import { showToast } from './utils.js';

export function setupAuthUI(onLoginSuccess, onLogoutSuccess) {
  const auth = getAuth();
  
  // Tab switching
  document.getElementById('tab-login-btn').addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('tab-register-btn').addEventListener('click', () => switchAuthTab('register'));
  
  // Forms
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!auth) {
      mockLogin(onLoginSuccess);
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
  });

  document.getElementById('register-form').addEventListener('submit', async (e) => {
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
  });

  // Password reset
  document.getElementById('btn-forgot-password').addEventListener('click', async () => {
    if (!auth) return;
    // Replace prompt with custom modal logic later, or just native for now until modal is built
    // We will build a custom prompt modal in ui.js
    const email = window.prompt("パスワードをリセットするメールアドレスを入力してください:");
    if (email) {
      try {
        await auth.sendPasswordResetEmail(email);
        showToast("パスワードリセットのメールを送信しました。", "success");
      } catch (error) {
        showToast(getFirebaseErrorMessage(error.code), "danger");
      }
    }
  });

  // Logout
  document.getElementById('btn-logout-main').addEventListener('click', async () => {
    if (auth) {
      await auth.signOut();
    } else {
      setCurrentUser(null);
      onLogoutSuccess();
    }
    showToast("ログアウトしました", "success");
  });
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(el => el.classList.add('hidden'));
  
  if (tab === 'login') {
    document.getElementById('tab-login-btn').classList.add('active');
    document.getElementById('login-form').classList.remove('hidden');
  } else {
    document.getElementById('tab-register-btn').classList.add('active');
    document.getElementById('register-form').classList.remove('hidden');
  }
}

function mockLogin(onLoginSuccess) {
  showToast("プレビューモードでログインしました", "warning");
  setCurrentUser({ email: "preview@example.com", uid: "preview123" });
  onLoginSuccess();
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
