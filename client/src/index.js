
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { observer } from 'mobx-react'; // Импортируем observer
import userStore from './features/admin/store/UserStore';
import 'antd/dist/reset.css'
import './app/App.css';
import App from './app/App';
import LoginPage from './features/admin/pages/LoginPage';

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