import React, { useState, useEffect } from 'react';
import { Image, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineUsers } from "react-icons/hi2";
import { PiPrinterLight } from "react-icons/pi";
import { BsUsbDrive } from "react-icons/bs";
import { MdOutlineBadge } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { GrNotes } from "react-icons/gr";
import { TbComponents } from "react-icons/tb";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { PiCarProfileFill } from "react-icons/pi";
import christmasPlains from '../../Image/christmas-plains.png';
import userStore from '../Store/UserStore'; // Убедитесь, что путь правильный
import { observer } from 'mobx-react'; // Импортируем observer
import './NavBar.css';

const NavBar = observer(() =>  {
  const location = useLocation();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isCarMenuOpen, setIsCarMenuOpen] = useState(false); // Новое состояние для автотранспорта

  useEffect(() => {
    // Закрываем меню, если путь не связан с админ-разделом
    if (!location.pathname.includes('/admin')) {
      setIsAdminMenuOpen(false);
    }

    // Закрываем меню автотранспорта, если путь не связан с ним
    if (!location.pathname.includes('/car')) {
      setIsCarMenuOpen(false);
    }
  }, [location.pathname]);

  const handleAdminClick = (e) => {
    // Предотвращаем переход по ссылке при клике на стрелку
    if (e.target.tagName === 'svg' || e.target.tagName === 'path') {
      e.preventDefault();
      setIsAdminMenuOpen(prevState => !prevState);
    }
  };

  const handleCarClick = (e) => {
    // Предотвращаем переход по ссылке при клике на стрелку
    if (e.target.tagName === 'svg' || e.target.tagName === 'path') {
      e.preventDefault();
      setIsCarMenuOpen(prevState => !prevState);
    }
  };

  return (
    <Nav className="vertical-menu flex-column navbar-fixed">
      <div className="logo d-flex align-items-center">
        <Image src={christmasPlains} style={{ width: '50px', height: 'auto', marginLeft: '10px' }} />
        <div style={{ display: 'inline-block', marginLeft: '20px' }}>
          <p style={{ fontWeight: 'bold', color: 'white', fontSize: '20px', margin: '0', lineHeight: '1.0' }}>ВУКТЫЛЬСКОЕ</p>
          <p style={{ fontWeight: 'bold', color: '#FA922F', fontSize: '26px', margin: '0', lineHeight: '1.0' }}>ЛПУМГ</p>
        </div>
      </div>

      {(userStore.userRolesAuth.includes('USER') || userStore.userRolesAuth.includes('ADMIN')) && (
        <Link to="/staff" className={`nav-link ${location.pathname === '/staff' ? 'active' : ''}`}>
          <HiOutlineUsers className={'icon'} size={20} style={{ marginRight: '8px' }} />
          ПОЛЬЗОВАТЕЛИ
        </Link>
      )}

      {(userStore.userRolesAuth.includes('PRINT') || userStore.userRolesAuth.includes('ADMIN')) && (
        <Link to="/prints" className={`nav-link ${location.pathname === '/prints' ? 'active' : ''}`}>
          <PiPrinterLight className={'icon'} size={20} style={{ marginRight: '8px' }} />
          ПРИНТЕРЫ
        </Link>
      )}

      {(userStore.userRolesAuth.includes('USB') || userStore.userRolesAuth.includes('ADMIN')) && (
        <Link to="/usb" className={`nav-link ${location.pathname === '/usb' ? 'active' : ''}`}>
          <BsUsbDrive className={'icon'} size={20} style={{ marginRight: '8px' }} />
          FLASH USB
        </Link>
      )}

      {(userStore.userRolesAuth.includes('BADGES') || userStore.userRolesAuth.includes('ADMIN')) && (
        <Link to="/badges" className={`nav-link ${location.pathname === '/badges' ? 'active' : ''}`}>
          <MdOutlineBadge className={'icon'} size={20} style={{ marginRight: '8px' }} />
          БЕЙДЖИКИ
        </Link>
      )}

      {(userStore.userRolesAuth.includes('NOTES') || userStore.userRolesAuth.includes('ADMIN')) && (
        <Link to="/notes" className={`nav-link ${location.pathname === '/notes' || location.pathname === '/create-post' || location.pathname.match(/^\/edit-post\/\d+$/) ? 'active' : ''}`}>
          <GrNotes className={'icon'} size={20} style={{ marginRight: '8px' }} />
          ЗАМЕТКИ
        </Link>
      )}
      {(userStore.userRolesAuth.includes('IUSPT') || userStore.userRolesAuth.includes('ADMIN')) && (
        <Link to="/iuspt" className={`nav-link ${location.pathname === '/iuspt' || location.pathname.match(/^\/iuspt\/.+$/) ? 'active' : ''}`}>
          <TbComponents className={'icon'} size={20} style={{ marginRight: '8px' }} />
          ИУС П Т
        </Link>
      )}

      {(userStore.userRolesAuth.includes('CAR') || userStore.userRolesAuth.includes('ADMIN')) && (
        <>
          <Link to="/car" className={`nav-link ${location.pathname.includes('/car') ? 'active' : ''}`} onClick={handleCarClick}>
            <PiCarProfileFill className={'icon'} size={20} style={{ marginRight: '8px' }} />
            <span style={{ paddingRight: '20px' }}>АВТОТРАНСПОРТ</span>
            {isCarMenuOpen ? (
              <FaCaretDown className={'icon'} size={20} style={{ float: 'right' }} />
            ) : (
              <FaCaretRight className={'icon'} size={20} style={{ float: 'right' }} />
            )}
          </Link>

          {isCarMenuOpen && (
            <ul className="admin-dropdown">
              <li>
                <Link
                  to="/car/sprav"
                  style={{ paddingLeft: '30px' }}
                  className={location.pathname.includes('/car/sprav') ? 'admin-dropdown-active' : ''}
                >
                  Справочники
                </Link>
              </li>
              <li>
                <Link
                  to="/car/create"
                  style={{ paddingLeft: '30px' }}
                  className={location.pathname.includes('/car/create') ? 'admin-dropdown-active' : ''}
                >
                  Добавить автомобиль
                </Link>
              </li>
            </ul>
          )}
        </>
      )}

      {/* Проверка на роль ADMIN для отображения админ-меню */}
      {userStore.userRolesAuth.includes('ADMIN') && (
        <>
          <Link to="/admin" className={`nav-link ${location.pathname.includes('/admin') ? 'active' : ''}`} onClick={handleAdminClick}>
            <RiAdminLine className={'icon'} size={20} style={{ marginRight: '8px' }} />
            <span style={{ paddingRight: '20px' }}>АДМИН</span>
            {isAdminMenuOpen ? (
              <FaCaretDown className={'icon'} size={20} style={{ float: 'right' }} />
            ) : (
              <FaCaretRight className={'icon'} size={20} style={{ float: 'right' }} />
            )}
          </Link>

          {isAdminMenuOpen && (
            <ul className="admin-dropdown">
              <li>
                <Link
                  to="/admin/roles"
                  style={{ paddingLeft: '30px' }}
                  className={location.pathname.includes('/admin/roles') ? 'admin-dropdown-active' : ''}
                >
                  Справочник ролей
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/create"
                  style={{ paddingLeft: '30px' }}
                  className={location.pathname.includes('/admin/create') ? 'admin-dropdown-active' : ''}
                >
                  Создание пользователя
                </Link>
              </li>
            </ul>
          )}
        </>
      )}
    </Nav>
  );
});

export default NavBar;