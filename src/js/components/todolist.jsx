import React, { useState, useEffect } from 'react';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState(""); 

    
    const fetchTodos = () => {
        fetch('https://playground.4geeks.com/todo/users/martin')
            .then(response => response.json())
            .then(data => {
                console.log('Tareas obtenidas:', data.todos);
                setTodos(data.todos);
            })
            .catch(error => console.error('Error fetching todos:', error));
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    
    const addTodo = () => {
        if (inputValue.trim()) {
            const newTodo = { label: inputValue, is_done: false };

            fetch('https://playground.4geeks.com/todo/todos/martin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Añadiendo tarea:', data);
                fetchTodos();  
            })
            .catch(error => console.error('Error adding todo:', error));
            setInputValue("");
        }
    };

    
    const deleteTodo = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                fetchTodos();  
            }
        })
        .catch(error => console.error('Error deleting todo:', error));
    };

    
    const deleteAllTodos = () => {
        fetch('https://playground.4geeks.com/todo/users/martin', {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setTodos([]);  
                console.log('Todas las tareas han sido eliminadas.');
            }
        })
        .catch(error => console.error('Error deleting all todos:', error));
    };

    return (
        <div className="container">
            <form onSubmit={(e) => { e.preventDefault(); addTodo(); }}>
                <div className="input-container">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="¿Qué necesitas hacer?"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
            </form>
            <div className="task-list">
                {todos.length > 0 ? (
                    todos.map((todo, index) => (
                        <div key={index} className="task-item">
                            <span style={{ textDecoration: todo.is_done ? 'line-through' : 'none' }}>
                                {todo.label}
                            </span>
                            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>X</button>
                        </div>
                    ))
                ) : (
                    <div className="no-tasks">No hay tareas, añade una tarea</div>
                )}
            </div>
            <div className="footer">
                <div className="task-counter">
                    {todos.length} Items left
                </div>
                <button className="delete-all-btn" onClick={deleteAllTodos}>Eliminar todas las tareas</button>
            </div>
        </div>
    );
};

export default TodoList;

























