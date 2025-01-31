import React from 'react'
import ReactDOM from 'react-dom/client'

//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap"

// index.css'
import '../styles/index.css'

// components
import Home from './components/Home';

import Tittle from './components/Tittle';
import TodoListF from './components/TodoList2';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="text-center">
    <Tittle/>
    </div>
    <TodoListF/>
  </React.StrictMode>,
)
