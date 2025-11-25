import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Загрузка задач при запуске
  useEffect(() => {
    fetchTasks();
  }, []);

  // Получить все задачи
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
    }
  };

  // Добавить новую задачу
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post(`${API_URL}/tasks`, {
        title,
        description
      });
      setTitle('');
      setDescription('');
      fetchTasks(); 
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error);
    }
  };

  // Переключить статус выполнения
  const toggleTask = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`, {
        completed: !completed
      });
      fetchTasks(); 
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };

  // Удалить задачу
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Мой список задач</h1>
        
        {/* Форма добавления задачи */}
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Название задачи..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="task-input"
          />
          <textarea
            placeholder="Описание (необязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="task-textarea"
          />
          <button type="submit" className="add-btn">
            Добавить задачу
          </button>
        </form>

        {/* Список задач */}
        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p>Задач нет.</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <small>
                    Создано: {new Date(task.created_at).toLocaleDateString()}
                  </small>
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`status-btn ${task.completed ? 'completed' : ''}`}
                  >
                    {task.completed ? 'Выполнено' : 'В работе'}
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="delete-btn"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
