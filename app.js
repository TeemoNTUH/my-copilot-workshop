// 我的待辦清單應用程式
// 使用 localStorage 保存資料，重新整理頁面後仍可保留內容。

const STORAGE_KEY = 'root-todo-app-items';
const THEME_STORAGE_KEY = 'root-todo-app-theme';
const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

// 取得畫面需要操作的元素
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');
const filterControls = document.getElementById('filter-controls');

// 待辦資料會集中存放在這個陣列中
let todos = loadTodos();
let currentFilter = 'all';
let savedTheme = loadThemePreference();

// 從 localStorage 讀取資料，如果資料異常就改用空陣列
function loadTodos() {
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.warn('讀取待辦資料失敗，已改用空清單。', error);
    return [];
  }
}

// 將目前待辦資料寫回 localStorage
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 讀取使用者手動選擇的主題，沒有則回傳 null 代表跟隨系統
function loadThemePreference() {
  const savedValue = localStorage.getItem(THEME_STORAGE_KEY);
  return savedValue === 'light' || savedValue === 'dark' ? savedValue : null;
}

// 寫入使用者目前選擇的主題
function saveThemePreference(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

// 取得目前應套用的主題，優先採用使用者手動選擇
function getPreferredTheme() {
  if (savedTheme) {
    return savedTheme;
  }

  return systemThemeMedia.matches ? 'dark' : 'light';
}

// 套用主題到整個頁面，並同步更新按鈕文字
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;

  if (theme === 'dark') {
    themeIcon.textContent = '☀️';
    themeLabel.textContent = '淺色模式';
    themeToggle.setAttribute('aria-label', '切換為淺色模式');
    return;
  }

  themeIcon.textContent = '🌙';
  themeLabel.textContent = '深色模式';
  themeToggle.setAttribute('aria-label', '切換為深色模式');
}

// 依據目前篩選條件回傳要顯示的待辦資料
function getVisibleTodos() {
  if (currentFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 清單為空時，依據目前篩選條件顯示對應提示
function getEmptyStateMessage() {
  if (currentFilter === 'active') {
    return '目前沒有未完成的待辦事項!';
  }

  if (currentFilter === 'completed') {
    return '目前沒有已完成的事項；剛剛取消勾選的項目還在「全部」清單裡。';
  }

  return '還沒有任何待辦事項,新增一個吧!';
}

// 同步更新篩選按鈕的選取狀態
function updateFilterButtons() {
  const buttons = filterControls.querySelectorAll('.filter-button');

  buttons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

// 產生每一筆待辦都能使用的唯一識別碼
function createTodoId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 新增待辦項目
function addTodoItem(text) {
  todos.push({
    id: createTodoId(),
    text,
    completed: false,
  });

  saveTodos();
  renderTodoList();
}

// 切換待辦項目的完成狀態
function toggleTodoItem(id) {
  todos = todos.map((todo) => {
    if (todo.id !== id) {
      return todo;
    }

    return {
      ...todo,
      completed: !todo.completed,
    };
  });

  saveTodos();
  renderTodoList();
}

// 刪除指定的待辦項目
function deleteTodoItem(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodoList();
}

// 依照目前資料重新繪製整份清單
function renderTodoList() {
  list.replaceChildren();

  const visibleTodos = getVisibleTodos();

  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'todo-item completed' : 'todo-item';
    item.dataset.id = todo.id;

    // 左側勾選框可切換完成狀態
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記「${todo.text}」是否完成`);

    // 中間文字顯示待辦內容
    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    // 右側按鈕用來刪除待辦
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn-delete';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  // 清單為空時顯示提示文字，內容會隨篩選條件改變
  emptyState.textContent = getEmptyStateMessage();
  emptyState.hidden = visibleTodos.length > 0;

  // 同步篩選按鈕目前的選取狀態
  updateFilterButtons();

  // 底部同步顯示未完成項目數量
  const remainingItems = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${remainingItems} 項`;
}

// 送出表單時新增待辦，空白內容則直接忽略
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    return;
  }

  addTodoItem(text);
  input.value = '';
  input.focus();
});

// 使用事件委派處理勾選與刪除按鈕
list.addEventListener('click', (event) => {
  const item = event.target.closest('.todo-item');
  if (!item) {
    return;
  }

  const { id } = item.dataset;

  if (event.target.matches('input[type="checkbox"]')) {
    toggleTodoItem(id);
  }

  if (event.target.matches('.btn-delete')) {
    deleteTodoItem(id);
  }
});

// 點選篩選按鈕後切換清單顯示條件
filterControls.addEventListener('click', (event) => {
  const button = event.target.closest('.filter-button');
  if (!button) {
    return;
  }

  currentFilter = button.dataset.filter;
  renderTodoList();
});

// 主題切換按鈕會在淺色與深色之間切換，並記住使用者選擇
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  savedTheme = nextTheme;
  saveThemePreference(nextTheme);
  applyTheme(nextTheme);
});

// 只有在使用者未手動切換時，才跟隨系統主題設定更新
function handleSystemThemeChange() {
  if (savedTheme !== null) {
    return;
  }

  applyTheme(getPreferredTheme());
}

if (typeof systemThemeMedia.addEventListener === 'function') {
  systemThemeMedia.addEventListener('change', handleSystemThemeChange);
} else if (typeof systemThemeMedia.addListener === 'function') {
  systemThemeMedia.addListener(handleSystemThemeChange);
}

// 首次載入頁面時先套用主題，再把畫面繪製出來
applyTheme(getPreferredTheme());
renderTodoList();
