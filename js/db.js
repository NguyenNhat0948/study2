import { showToast } from './utils.js';

const firebaseConfig = {
  apiKey: "AIzaSyARBZCcW2rcMaSETIPTt53y5LUyzZmR0AI",
  authDomain: "nihongo-a0795.firebaseapp.com",
  projectId: "nihongo-a0795",
  storageBucket: "nihongo-a0795.firebasestorage.app",
  messagingSenderId: "92477688249",
  appId: "1:92477688249:web:6cb13bd33fe06e3fa88e68",
  measurementId: "G-0KL4T6F2EC"
};

let auth = null;
let db = null;
let currentUser = null;

try {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
} catch (error) {
  console.error("Firebase Init Error:", error);
}

export function getAuth() { return auth; }
export function getDb() { return db; }
export function getCurrentUser() { return currentUser; }
export function setCurrentUser(user) { currentUser = user; }

// --- Firestore Vocabulary (Subcollection pattern) ---

export async function fetchVocabList(uid) {
  if (!db) return [];
  const snapshot = await db.collection('users').doc(uid).collection('vocab').get();
  const list = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list;
}

export async function saveWordToDb(uid, card) {
  if (!db) return;
  const { id, ...data } = card;
  await db.collection('users').doc(uid).collection('vocab').doc(id).set({
    ...data,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

export async function deleteWordFromDb(uid, wordId) {
  if (!db) return;
  await db.collection('users').doc(uid).collection('vocab').doc(wordId).delete();
}

// Data Migration Logic (From single doc array to subcollection)
export async function migrateLegacyDataIfNeeded(uid) {
  if (!db) return [];
  const userDocRef = db.collection('users').doc(uid);
  const userDoc = await userDocRef.get();
  
  if (userDoc.exists && userDoc.data().vocabList) {
    const legacyList = userDoc.data().vocabList;
    if (Array.isArray(legacyList) && legacyList.length > 0) {
      showToast("旧形式のデータを新しいデータベース構造に移行しています...", "warning");
      const batch = db.batch();
      
      legacyList.forEach(card => {
        const { id, ...data } = card;
        const newDocRef = userDocRef.collection('vocab').doc(id);
        batch.set(newDocRef, {
          ...data,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      
      try {
        await batch.commit();
        // Delete legacy field
        await userDocRef.update({
          vocabList: firebase.firestore.FieldValue.delete()
        });
        showToast("データ移行が完了しました！", "success");
      } catch (e) {
        console.error("Migration failed:", e);
        showToast("データ移行に失敗しました。", "danger");
      }
    }
  }
}
