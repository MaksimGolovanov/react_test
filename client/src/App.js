import React from 'react';

import { Container } from 'react-bootstrap';
import { useLocation, Routes, Route } from 'react-router-dom';
import Clock from './Components/Clock';
import NavBar from './Components/NavBar/NavBar';
import Staff from './Components/Staff/Staff';
import Prints from './Components/Prints/Prints';
import Notes from './Components/Notes/Notes';
import Admin from './Components/Admin/Admin';
import CreatePost from './Components/Notes/CreatePost';
import EditPost from './Components/Notes/EditPost';
import RoleSprav from './Components/Admin/RoleSprav';
import AdminCreate from './Components/Admin/AdminCreate';
import AdminEditUser from './Components/Admin/AdminEditUser';
import PrivateRoute from '../src/Components/Admin/PrivateRoute';
import Car from './Components/Car/Car';
import CarCreate from './Components/Car/CarCreate';
import CarSprav from './Components/Car/CarSprav';
import IusPt from './Components/IusPT/IusPt';
import IusPtUser from './Components/IusPT/IusPtUser';

import './App.css';







function App() {
  const location = useLocation();
  let pageTitle;

  switch (true) {
    case location.pathname.startsWith('/staff'):
      pageTitle = 'ПОЛЬЗОВАТЕЛИ';
      break;
    case location.pathname.startsWith('/prints'):
      pageTitle = 'УЧЕТ ПРИНТЕРОВ';
      break;
    case location.pathname.startsWith('/notes'):
      pageTitle = 'ЗАПИСНАЯ КНИЖКА';
      break;
    case location.pathname.startsWith('/create-post'):
      pageTitle = 'СОЗДАНИЕ ЗАПИСИ';
      break;
    case location.pathname.startsWith('/edit-post/'):
      pageTitle = 'РЕДАКТИРОВАНИЕ ЗАПИСИ';
      break;
    case location.pathname.startsWith('/admin'):
      pageTitle = 'АДМИНИСТРИРОВАНИЕ';
      break;
    case location.pathname.startsWith('/car'):
      pageTitle = 'ЗАКАЗ АВТОТРАНСПОРТА';
      break;
    case location.pathname.startsWith('/iuspt'):
      pageTitle = 'ИУС П Т';
      break;
    default:
      pageTitle = '';
  }

  return (
    <Container fluid className='d-flex flex-row h-100'>
      <div>
        <NavBar />
      </div>
      <div className='flex-fill '>
        <div className='d-flex flex-fill align-items-center justify-content-between head sticky-header'>
          <div>
            <p className="m-2" style={{ fontWeight: 'bold', color: '#707070', fontSize: '36px', lineHeight: '1.0' }}>
              {pageTitle}
            </p>
          </div>
          <div className="m-2">
            <Clock />
          </div>
        </div>

        <div className='content p-4'>
          <Routes>
            <Route path="/" element={<PrivateRoute requiredRole={['ADMIN', 'USER']}><Staff /></PrivateRoute>} />
            <Route path="/staff" element={<PrivateRoute requiredRole={['ADMIN', 'USER']}><Staff /></PrivateRoute>} />
            <Route path="/prints" element={<PrivateRoute requiredRole={['ADMIN', 'PRINT']}><Prints /></PrivateRoute>} />
            <Route path="/notes" element={<PrivateRoute requiredRole={['ADMIN', 'NOTES']}><Notes /></PrivateRoute>} />
            <Route path="/create-post" element={<PrivateRoute requiredRole={['ADMIN']}><CreatePost /></PrivateRoute>} />
            <Route path="/edit-post/:id" element={<PrivateRoute requiredRole={['ADMIN']}><EditPost /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute requiredRole={['ADMIN']}><Admin /></PrivateRoute>} />
            <Route path="/admin/roles" element={<PrivateRoute requiredRole={['ADMIN']}><RoleSprav /></PrivateRoute>} />
            <Route path="/admin/create" element={<PrivateRoute requiredRole={['ADMIN']}><AdminCreate /></PrivateRoute>} />
            <Route path="/admin/edit/:id" element={<PrivateRoute requiredRole={['ADMIN']}><AdminEditUser /></PrivateRoute>} />
            <Route path="/car" element={<PrivateRoute requiredRole={['ADMIN']}><Car /></PrivateRoute>} />
            <Route path="/car/create" element={<PrivateRoute requiredRole={['ADMIN', 'CAR']}><CarCreate /></PrivateRoute>} />
            <Route path="/car/sprav" element={<PrivateRoute requiredRole={['ADMIN', 'CAR']}><CarSprav /></PrivateRoute>} />
            <Route path="/iuspt/edit/:id" element={<PrivateRoute requiredRole={['ADMIN']}><IusPtUser /></PrivateRoute>} />
            <Route path="/iuspt" element={<PrivateRoute requiredRole={['ADMIN']}><IusPt /></PrivateRoute>} />

          </Routes>
        </div>
      </div>
    </Container>
  );
}

export default App;