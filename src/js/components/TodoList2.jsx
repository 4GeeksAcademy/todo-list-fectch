import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const TodoListF = () => {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [username, setUsername] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isUserCreated, setIsUserCreated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            setIsUserCreated(true);
            setIsModalOpen(false);
            getTodos(storedUsername);
        }
    }, []);

    useEffect(() => {
        if (isUserCreated && username) {
            getTodos(username);
        }
    }, [username, isUserCreated]);

    const handleUsernameSubmit = () => {
        const trimmedUsername = username.trim(); 
        if (trimmedUsername) {
            setIsModalOpen(false);
            addUser(trimmedUsername);
        }
    };

    const getTodos = (username) => {
        fetch(`https://playground.4geeks.com/todo/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Usuario no encontrado: ${username}`);
                }
                return response.json();
            })
            .then(data => {
                setTodos(data.todos || []);
                console.log(data.todos);
            })
            .catch(error => {
                console.error('Error al obtener las tareas:', error);
                setTodos([]);
            });
    };

    const addTodo = (e) => {
        e.preventDefault();
        if (!isUserCreated) {
            return;
        }
        const trimmedInputValue = inputValue.trim();
        if (!trimmedInputValue) {
            return; 
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "label": trimmedInputValue, "is_done": false })
        };
        fetch(`https://playground.4geeks.com/todo/todos/${username}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setInputValue("");
                getTodos(username);
            })
            .catch(error => console.error('Error al añadir la tarea:', error));
    };

    const deleteTodo = (id) => {
        const requestOptions = {
            method: 'DELETE',
            redirect: "follow"
        };
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                getTodos(username);
            })
            .catch(error => console.error('Error al eliminar la tarea:', error));
    };

    const addUser = (trimmedUsername) => {
        if (trimmedUsername) {
            fetch(`https://playground.4geeks.com/todo/users/${trimmedUsername}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            if (data.detail === "User already exists.") {
                                setErrorMessage("El usuario ya existe. Por favor, elige otro nombre de usuario.");
                                throw new Error("El usuario ya existe.");
                            }
                            throw new Error(data.detail || "Error en la respuesta de añadir usuario.");
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem('username', trimmedUsername);
                    setUsername(trimmedUsername);
                    setIsUserCreated(true);
                    setErrorMessage("");
                })
                .catch(error => console.error('Error al añadir usuario:', error));
        }
    };

    const deleteAllTodo = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        fetch(`https://playground.4geeks.com/todo/users/${username}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar todas las tareas');
                }
                return response.text();
            })
            .then(result => {
                setTodos([]);
                console.log("Las tareas han sido eliminadas");
                setIsModalOpen(true);
                setIsUserCreated(false);
                setUsername("");
                localStorage.removeItem('username');
            })
            .catch(error => console.error('Error al eliminar todas las tareas:', error));
    };

    return (
        <div className="container-sm" style={{ maxWidth: "400px", border: "1px solid #f0f0f0", padding: "15px", borderRadius: "5px" }}>
            {errorMessage && (
                <div style={{ backgroundColor: "#f8d7da", padding: "5px 10px", borderRadius: "5px", textAlign: "center", border: "1px solid #f5c6cb", marginBottom: "10px" }}>
                    {errorMessage}
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1">
                    {!isUserCreated && (
                        <div style={{ backgroundColor: "#f8d7da", padding: "5px 10px", borderRadius: "5px", border: "1px solid #f5c6cb", marginTop: "10px" }}>
                            Debes tener un usuario para agregar tareas.
                        </div>
                    )}
                </div>
            </div>

            <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Ingrese nombre de usuario</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsModalOpen(false)}></button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-control"
                                placeholder="Nombre de usuario"
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                            <button type="button" className="btn btn-primary btn-sm" onClick={handleUsernameSubmit}>Enviar</button>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={addTodo} className="my-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="form-control"
                    placeholder="What's need's to be done?"
                    disabled={!isUserCreated}
                />
            </form>

            {todos.length === 0 && (
                <p>No hay tareas, añadir una tarea.</p>
            )}

            <ul className="list-group">
                {todos.map((todo) => (
                    <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {todo.label}
                        <button className="btn btn-sm" style={{ color: "grey", border: "none" }} onClick={() => deleteTodo(todo.id)}>×</button>
                    </li>
                ))}
            </ul>

            <p className="mt-3">Total de tareas: {todos.length}</p>

            <div className="d-flex justify-content-between">
                <button className="btn btn-danger btn-sm" onClick={deleteAllTodo}>Eliminar todas las tareas</button>
                {!isUserCreated && (
                    <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>Ingresar un nuevo usuario</button>
                )}
            </div>
        </div>
    );
};

export default TodoListF;























