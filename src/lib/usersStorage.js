// Default users previously stored in src/assets/users.json — embedded here so
// the app relies solely on localStorage going forward.
const defaultUsers = [
  { id: 1, username: "user1", password: "password123" },
  { id: 2, username: "admin", password: "adminpassword" },
  { id: 3, username: "testuser", password: "testpassword" },
  { id: 4, username: "janedoe", password: "strongpassword" },
];

const STORAGE_KEY = "users";

export function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUsers.slice();
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load users from storage", err);
    return defaultUsers.slice();
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users", err);
  }
}

export function findUser(username, password) {
  const users = loadUsers();
  return users.find((u) => u.username === username && u.password === password);
}

export function addUser(user) {
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
}

export function isDefaultUser(username) {
  if (!username) return false;
  return defaultUsers.some((u) => u.username === username);
}
