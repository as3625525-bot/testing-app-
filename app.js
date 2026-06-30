const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const dashboard = document.getElementById('dashboard');
const categoriesDiv = document.getElementById('categories');
const entriesList = document.getElementById('entriesList');
const entryText = document.getElementById('entryText');
const saveEntryBtn = document.getElementById('saveEntryBtn');
const selectedCategoryTitle = document.getElementById('selectedCategoryTitle');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const categoryDialog = document.getElementById('categoryDialog');
const newCategoryName = document.getElementById('newCategoryName');
const createCategoryBtn = document.getElementById('createCategoryBtn');

const defaultCategories = [
  'To Do List',
  'Missions',
  'English Spoken',
  'Stock Market',
  'Trading',
  'Learning Python',
  'Learning SQL',
  'Learning ML',
  'Learning GIT',
  'Exercise'
];

let currentUser = localStorage.getItem('currentUser') || '';
let currentCategory = '';
let categories = JSON.parse(localStorage.getItem('categories')) || defaultCategories;
let entries = JSON.parse(localStorage.getItem('entries')) || [];

function saveAll() {
  localStorage.setItem('categories', JSON.stringify(categories));
  localStorage.setItem('entries', JSON.stringify(entries));
  if (currentUser) localStorage.setItem('currentUser', currentUser);
}

function renderCategories() {
  categoriesDiv.innerHTML = '';
  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card' + (cat === currentCategory ? ' active' : '');
    card.textContent = cat;
    card.onclick = () => {
      currentCategory = cat;
      selectedCategoryTitle.textContent = cat;
      renderCategories();
      renderEntries();
    };
    categoriesDiv.appendChild(card);
  });
}

function renderEntries() {
  entriesList.innerHTML = '';
  const filtered = entries.filter(e => e.user === currentUser && e.category === currentCategory);
  if (!filtered.length) {
    entriesList.innerHTML = '<p>No entries yet.</p>';
    return;
  }

  filtered.reverse().forEach((e, index) => {
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `
      <div>${e.text}</div>
      <small>${e.date}</small>
      <button class="secondary" data-id="${e.id}">Delete</button>
    `;
    div.querySelector('button').onclick = () => {
      entries = entries.filter(item => item.id !== e.id);
      saveAll();
      renderEntries();
    };
    entriesList.appendChild(div);
  });
}

function login() {
  const name = usernameInput.value.trim();
  if (!name) return alert('Please enter your name');
  currentUser = name;
  localStorage.setItem('currentUser', currentUser);
  dashboard.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  loginBtn.classList.add('hidden');
  usernameInput.classList.add('hidden');
  if (!currentCategory) {
    currentCategory = categories[0];
    selectedCategoryTitle.textContent = currentCategory;
  }
  renderCategories();
  renderEntries();
}

function logout() {
  currentUser = '';
  currentCategory = '';
  localStorage.removeItem('currentUser');
  dashboard.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  loginBtn.classList.remove('hidden');
  usernameInput.classList.remove('hidden');
  usernameInput.value = '';
}

loginBtn.onclick = login;
logoutBtn.onclick = logout;

saveEntryBtn.onclick = () => {
  if (!currentUser) return alert('Login first');
  if (!currentCategory) return alert('Select a category first');
  const text = entryText.value.trim();
  if (!text) return alert('Write something first');

  entries.push({
    id: Date.now().toString(),
    user: currentUser,
    category: currentCategory,
    text,
    date: new Date().toLocaleString()
  });

  entryText.value = '';
  saveAll();
  renderEntries();
};

addCategoryBtn.onclick = () => {
  categoryDialog.showModal();
};

createCategoryBtn.onclick = (e) => {
  e.preventDefault();
  const name = newCategoryName.value.trim();
  if (!name) return;
  if (!categories.includes(name)) {
    categories.push(name);
    saveAll();
    renderCategories();
  }
  newCategoryName.value = '';
  categoryDialog.close();
};

if (currentUser) {
  dashboard.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  loginBtn.classList.add('hidden');
  usernameInput.classList.add('hidden');
  currentCategory = categories[0];
  selectedCategoryTitle.textContent = currentCategory;
  renderCategories();
  renderEntries();
}
