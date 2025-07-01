import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [todos, darkMode]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addTodo = () => {
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input,
        completed: false,
        priority: 'medium',
        date: new Date().toLocaleDateString()
      };
      setTodos([...todos, newTodo]);
      setInput('');
      showNotification('Task added successfully!');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    showNotification('Task deleted!', 'warning');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    const todo = todos.find(t => t.id === id);
    showNotification(`Task marked as ${todo.completed ? 'incomplete' : 'complete'}!`);
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    showNotification('Task updated!');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const changePriority = (id, priority) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, priority } : todo
    ));
    showNotification(`Priority changed to ${priority}!`);
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
    showNotification('Completed tasks cleared!', 'warning');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (editingId !== null) {
        saveEdit(editingId);
      } else {
        addTodo();
      }
    }
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      {/* Theme Toggle */}
      <button 
        onClick={() => setDarkMode(!darkMode)} 
        className="theme-toggle"
        aria-label="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <h1>Todo App</h1>
      
      {/* Input Area */}
      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button onClick={addTodo} className="todo-button">
          Add Task
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button 
          onClick={() => setFilter('all')} 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')} 
          className={`filter-button ${filter === 'active' ? 'active' : ''}`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
        >
          Completed
        </button>
      </div>

      {/* Todo List */}
      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No tasks found. Add one above!</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <li 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}
            >
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="todo-checkbox"
                />
                
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="edit-input"
                    autoFocus
                  />
                ) : (
                  <span className="todo-text">{todo.text}</span>
                )}
                
                <span className={`priority-badge priority-${todo.priority}`}>
                  {todo.priority}
                </span>
                
                <span className="todo-date">{todo.date}</span>
              </div>
              
              <div className="todo-actions">
                {editingId === todo.id ? (
                  <>
                    <button 
                      onClick={() => saveEdit(todo.id)} 
                      className="edit-button"
                      aria-label="Save"
                    >
                      ✔️
                    </button>
                    <button 
                      onClick={cancelEdit} 
                      className="delete-button"
                      aria-label="Cancel"
                    >
                      ✖️
                    </button>
                  </>
                ) : (
                  <>
                    <select
                      value={todo.priority}
                      onChange={(e) => changePriority(todo.id, e.target.value)}
                      className="priority-select"
                    >
                      <option value="high" id='high'>High</option>
                      <option value="medium" id='medium'>Medium</option>
                      <option value="low" id='low'>Low</option>
                    </select>
                    
                    <button 
                      onClick={() => startEditing(todo.id, todo.text)} 
                      className="edit-button"
                      aria-label="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => deleteTodo(todo.id)} 
                      className="delete-button"
                      aria-label="Delete"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Stats and Clear Button */}
      <div className="todo-stats">
        <span>{todos.filter(t => !t.completed).length} tasks left</span>
        <span>{todos.filter(t => t.completed).length} completed</span>
        {todos.some(todo => todo.completed) && (
          <button onClick={clearCompleted} className="clear-button">
            Clear Completed
          </button>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        className="fab"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  );
}

export default App;