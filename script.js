// Load tasks from local storage
window.onload = () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  storedTasks.forEach(task => renderTask(task));
};

function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();
  if (taskText === '') return;

  const task = {
    text: taskText,
    timestamp: new Date().toLocaleString(),
    completed: false
  };

  renderTask(task);
  saveTask(task);
  input.value = '';
  input.focus();
}

function renderTask(task) {
  const li = document.createElement('li');
  if (task.completed) li.classList.add('completed');

  const taskDetails = document.createElement('span');
  taskDetails.className = 'task-details';
  taskDetails.innerHTML = `${task.text} <span class="timestamp">(${task.timestamp})</span>`;
  taskDetails.onclick = () => {
    li.classList.toggle('completed');
    task.completed = !task.completed;
    updateStorage();
  };

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Delete';
  removeBtn.onclick = () => {
    li.remove();
    removeTask(task);
  };

  li.appendChild(taskDetails);
  li.appendChild(removeBtn);
  document.getElementById('taskList').appendChild(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(taskToRemove) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task.text !== taskToRemove.text || task.timestamp !== taskToRemove.timestamp);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    const text = li.querySelector('.task-details').childNodes[0].nodeValue.trim();
    const timestamp = li.querySelector('.timestamp').textContent.replace(/[()]/g, '');
    const completed = li.classList.contains('completed');
    tasks.push({ text, timestamp, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
