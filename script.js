let tasks = [];

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('new-task');

    tasks = loadTasks();
    tasks.forEach(task => renderTask(task));

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText) {
            const newTask = {text: taskText, completed: false};
            tasks.push(newTask);
            saveTasks(tasks);
            renderTask(newTask);
            input.value = '';
        }
    })



    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showFilteredTasks(btn.dataset.filter);
        });
    })

});



function loadTasks() {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
};


function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};


function renderTask(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
        li.classList.add('completed');
    }

    const span = document.createElement('span');
    span.textContent = task.text;

    const completeBtn = document.createElement('button');
    completeBtn.textContent = '✓';
    completeBtn.className = 'complete-btn';
    completeBtn.addEventListener('click', () => {
        task.completed = !task.completed;
        li.classList.toggle('completed');
        saveTasks(tasks);
    });

    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
        showModal(() => {
            tasks = tasks.filter(t => t !== task);
            li.remove();
            saveTasks(tasks);
        })
    });

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    document.getElementById('task-list').appendChild(li);
};



function showFilteredTasks(filter) {
    const task = document.getElementById('search').value.trim();
    document.getElementById('sidebar-task-list').innerHTML = '';
    
    let filtered = [];
    if (filter === 'all') filtered = tasks;
    else if (filter === 'pending') filtered = tasks.filter(t => !t.completed);
    else if (filter === 'completed') filtered = tasks.filter(t => t.completed);

    if (task) {
        filtered = filtered.filter(t => t.text.toLowerCase().includes(task.toLowerCase()));
    }

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) li.style.textDecoration = 'line-through';
        document.getElementById('sidebar-task-list').appendChild(li);
    });
}


function showModal(onConfirm) {
    const overlay = document.getElementById('modal-overlay');
    //const msg = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    //msg.textContent = message;

    overlay.style.display = 'flex';

    confirmBtn.addEventListener('click', onConfirmHandler);
    cancelBtn.addEventListener('click', onCancelHandler);

    function onConfirmHandler() {
        close();
        onConfirm();
    }
    function onCancelHandler() {
        close();
    }
    function close() {
        overlay.style.display = 'none';
        confirmBtn.removeEventListener('click', onConfirmHandler);
        cancelBtn.removeEventListener('click', onCancelHandler);
    }


}