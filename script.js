let currentFilter = 'all';

window.onload = () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  storedTasks.forEach(renderTask);
};

function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  const category = document.getElementById('categoryInput').value;
  const priority = document.getElementById('priorityInput').value;
  if (text === '') return;

  const task = {
    text,
    category,
    priority,
    timestamp: new Date().toLocaleString(),
    completed: false
  };

  saveTask(task);
  renderTask(task);
  document.getElementById('taskInput').value = '';
}

function renderTask(task) {
  const li = document.createElement('li');
  if (task.completed) li.classList.add('completed');

  li.setAttribute('data-completed', task.completed);
  li.setAttribute('data-category', task.category);
  li.setAttribute('data-priority', task.priority);

  const main = document.createElement('div');
  main.className = 'task-main';

  const content = document.createElement('span');
  content.textContent = task.text;
  content.onclick = () => {
    li.classList.toggle('completed');
    task.completed = !task.completed;
    li.setAttribute('data-completed', task.completed);
    updateStorage();
    applyFilter(currentFilter);
  };

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Delete';
  removeBtn.onclick = () => {
    li.remove();
    removeTask(task);
  };

  main.appendChild(content);
  main.appendChild(removeBtn);

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `
    <span>📂 ${task.category}</span>
    <span>⚡ ${task.priority}</span>
    <span>🕒 ${task.timestamp}</span>
  `;

  li.appendChild(main);
  li.appendChild(meta);
  document.getElementById('taskList').appendChild(li);

  applyFilter(currentFilter); // ensure it respects current filter
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(taskToRemove) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(t => t.text !== taskToRemove.text || t.timestamp !== taskToRemove.timestamp);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    const text = li.querySelector('.task-main span').textContent.trim();
    const [cat, pri, time] = li.querySelector('.meta').innerText.split('\n')[0].split('⚡')[0].split('📂 ')[1].split(' ');
    const completed = li.classList.contains('completed');
    tasks.push({
      text,
      category: li.getAttribute('data-category'),
      priority: li.getAttribute('data-priority'),
      timestamp: time,
      completed
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks(filterType) {
  currentFilter = filterType;
  applyFilter(filterType);
}

function applyFilter(filterType) {
  document.querySelectorAll('#taskList li').forEach(li => {
    const isCompleted = li.classList.contains('completed');
    if (
      filterType === 'all' ||
      (filterType === 'completed' && isCompleted) ||
      (filterType === 'pending' && !isCompleted)
    ) {
      li.style.display = 'block';
    } else {
      li.style.display = 'none';
    }
  });
}
