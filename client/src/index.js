import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { observer } from 'mobx-react'; // Импортируем observer
import userStore from './Components/Store/UserStore';

import App from './App';
import LoginPage from './Components/Admin/LoginPage';

// Создаем обёртку для компонентов, которые должны отслеживать изменения
const Root = observer(() => {
  return (
    <Router>
      {userStore.isAuthenticated ? <App /> : <LoginPage />}
    </Router>
  );
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);