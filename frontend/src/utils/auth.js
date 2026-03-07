const USERS_KEY = "__bv_users__";

export function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function validatePassword(pw) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    special: /[@$!%*?&#^()_\-+=]/.test(pw),
  };
}

export function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
