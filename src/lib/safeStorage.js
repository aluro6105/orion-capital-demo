/**
 * safeStorage — localStorage con fallback a sessionStorage y luego a memoria.
 * Safari en modo privado bloquea localStorage completamente (lanza SecurityError).
 * Esto garantiza que la app funcione en cualquier entorno móvil.
 */

const memoryStore = {};

function getStorage() {
  try {
    localStorage.setItem('__test__', '1');
    localStorage.removeItem('__test__');
    return localStorage;
  } catch {
    try {
      sessionStorage.setItem('__test__', '1');
      sessionStorage.removeItem('__test__');
      return sessionStorage;
    } catch {
      return null; // use in-memory fallback
    }
  }
}

const storage = getStorage();

export function safeGet(key) {
  try {
    if (storage) return storage.getItem(key);
    return memoryStore[key] ?? null;
  } catch {
    return memoryStore[key] ?? null;
  }
}

export function safeSet(key, value) {
  try {
    if (storage) { storage.setItem(key, value); }
    else { memoryStore[key] = value; }
  } catch {
    memoryStore[key] = value;
  }
}

export function safeRemove(key) {
  try {
    if (storage) storage.removeItem(key);
    else delete memoryStore[key];
  } catch {
    delete memoryStore[key];
  }
}