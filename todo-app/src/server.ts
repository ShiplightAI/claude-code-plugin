import http from 'http';
import url from 'url';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

let todos: Todo[] = [];
let nextId = 1;

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
    h1 { text-align: center; margin-bottom: 24px; color: #333; }
    #add-form { display: flex; gap: 8px; margin-bottom: 24px; }
    #todo-input { flex: 1; padding: 10px 14px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 10px 16px; font-size: 15px; cursor: pointer; border: none; border-radius: 4px; }
    #add-btn { background: #4CAF50; color: white; }
    #add-btn:hover { background: #45a049; }
    #todo-list { list-style: none; }
    .todo-item { display: flex; align-items: center; gap: 10px; background: white; padding: 12px 16px; margin-bottom: 8px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .todo-item.completed span { text-decoration: line-through; color: #999; }
    .todo-item span { flex: 1; font-size: 16px; }
    .complete-btn { background: #2196F3; color: white; font-size: 13px; padding: 6px 12px; }
    .complete-btn:hover { background: #1976D2; }
    .delete-btn { background: #f44336; color: white; font-size: 13px; padding: 6px 12px; }
    .delete-btn:hover { background: #d32f2f; }
    .completed .complete-btn { background: #9e9e9e; }
    #empty-msg { text-align: center; color: #999; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>Todo List</h1>
  <form id="add-form">
    <input id="todo-input" type="text" placeholder="Add a new todo..." autocomplete="off" />
    <button id="add-btn" type="submit">Add</button>
  </form>
  <ul id="todo-list"></ul>
  <p id="empty-msg">No todos yet. Add one above!</p>
  <script>
    async function loadTodos() {
      const res = await fetch('/api/todos');
      const todos = await res.json();
      render(todos);
    }

    function render(todos) {
      const list = document.getElementById('todo-list');
      const empty = document.getElementById('empty-msg');
      list.innerHTML = '';
      empty.style.display = todos.length ? 'none' : 'block';
      todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        li.innerHTML = \`
          <span>\${escapeHtml(todo.text)}</span>
          <button class="complete-btn" onclick="toggleTodo(\${todo.id})">\${todo.completed ? 'Undo' : 'Done'}</button>
          <button class="delete-btn" onclick="deleteTodo(\${todo.id})">Delete</button>
        \`;
        list.appendChild(li);
      });
    }

    function escapeHtml(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    document.getElementById('add-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('todo-input');
      const text = input.value.trim();
      if (!text) return;
      await fetch('/api/todos', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({text}) });
      input.value = '';
      loadTodos();
    });

    async function toggleTodo(id) {
      await fetch('/api/todos/' + id + '/toggle', { method: 'POST' });
      loadTodos();
    }

    async function deleteTodo(id) {
      await fetch('/api/todos/' + id, { method: 'DELETE' });
      loadTodos();
    }

    loadTodos();
  </script>
</body>
</html>`;

function sendJSON(res: http.ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '/', true);
  const pathname = parsed.pathname || '/';

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(HTML);
    return;
  }

  if (pathname === '/api/todos' && req.method === 'GET') {
    sendJSON(res, 200, todos);
    return;
  }

  if (pathname === '/api/todos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { text } = JSON.parse(body);
      const todo: Todo = { id: nextId++, text, completed: false };
      todos.push(todo);
      sendJSON(res, 201, todo);
    });
    return;
  }

  const toggleMatch = pathname.match(/^\/api\/todos\/(\d+)\/toggle$/);
  if (toggleMatch && req.method === 'POST') {
    const id = parseInt(toggleMatch[1]);
    const todo = todos.find(t => t.id === id);
    if (todo) { todo.completed = !todo.completed; sendJSON(res, 200, todo); }
    else sendJSON(res, 404, { error: 'Not found' });
    return;
  }

  const deleteMatch = pathname.match(/^\/api\/todos\/(\d+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const id = parseInt(deleteMatch[1]);
    todos = todos.filter(t => t.id !== id);
    sendJSON(res, 200, { ok: true });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = 3456;
server.listen(PORT, () => {
  console.log(`Todo app running at http://localhost:${PORT}`);
});
