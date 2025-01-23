import React from 'react';

import { Container } from 'react-bootstrap';
import { useLocation, Routes, Route } from 'react-router-dom';
import Clock from './Components/Clock';
import NavBar from './Components/NavBar/NavBar';
import PrivateRoute from './shared/PrivateRoute';

import {Prints} from './features/prints'
import {NotesRoutes} from './features/notes'
import { IusPtRoutes } from './features/ius-pt'
import {StaffRoutes } from './features/staff'
import {AdminRoutes } from './features/admin'
import {CarRoutes } from './features/cars'
import {Staff} from './features/staff'
import LoginPage from './features/admin/pages/LoginPage'
import ButtonLogout from './Components/button/buttonLogout'



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
          <div className="m-2 d-flex align-items-center">
            <Clock />
            <ButtonLogout className="ml-3" />
          </div>
        </div>
        
        <div className='content p-4'>
          <Routes>
            <Route path="/" element={<PrivateRoute requiredRole={['ADMIN', 'USER']}><Staff /></PrivateRoute>} />
            <Route path="/staff/*" element={<StaffRoutes />} />
            <Route path="/prints" element={<PrivateRoute requiredRole={['ADMIN', 'PRINT']}><Prints /></PrivateRoute>} />
            <Route path="/*" element={<NotesRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/car/*" element={<CarRoutes />} />
            <Route path="/iuspt/*" element={<IusPtRoutes />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </Container>
  );
}

export default App;