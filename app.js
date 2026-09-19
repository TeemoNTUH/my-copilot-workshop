// 我的待辦清單應用程式
// 使用 localStorage 保存資料，重新整理頁面後仍可保留內容。

const STORAGE_KEY = 'root-todo-app-items';

// 取得畫面需要操作的元素
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');

// 待辦資料會集中存放在這個陣列中
let todos = loadTodos();

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

  todos.forEach((todo) => {
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

  // 清單為空時顯示提示文字
  emptyState.hidden = todos.length > 0;

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

// 首次載入頁面時先把畫面繪製出來
renderTodoList();
