import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import '../App.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-between">
      <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={`../palace.svg`} alt="Palace Icon" style={{ width: '40px', marginRight: '10px' }} />
          {t('palaceLovers')}
        </Link>
        <div className="d-flex">
          {i18n.language === 'lv' && (
            <button className="btn btn-link nav-link" onClick={() => changeLanguage('en')}>EN</button>
          )}
          {i18n.language === 'en' && (
            <button className="btn btn-link nav-link" onClick={() => changeLanguage('lv')}>LV</button>
          )}
          <ul className="navbar-nav flex-row">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-palace">{t('addPalace')}</Link>
                </li>
                {user.roles && user.roles.includes('Admin') && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">{t('admin')}</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>{t('logout')}</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">{t('login')}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">{t('register')}</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
