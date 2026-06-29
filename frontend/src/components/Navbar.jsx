import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, GraduationCap, User, LogOut, LayoutDashboard, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/about', label: 'عن الكلية' },
    { to: '/contact', label: 'تواصل معنا' },
  ];

  const isTransparentPage = ['/', '/contact', '/about'].includes(location.pathname);
  const navbarClass = `navbar ${scrolled ? 'navbar--scrolled' : ''} ${isTransparentPage && !scrolled ? 'navbar--transparent' : ''}`;

  return (
    <nav className={navbarClass}>
      <div className="container navbar__inner">

        {/* Theme Toggle Button */}
        <button className="theme-toggle-nav" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <GraduationCap size={32} className="navbar__logo-icon" />
          <span>دليل</span>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`navbar__link ${isActive(link.to) ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <Link to={user?.role === 'admin' ? '/admin' : (user?.role === 'staff' ? '/staff' : '/dashboard')} className="btn btn-outline navbar__btn-dash">
                <LayoutDashboard size={17} />
                لوحتي
              </Link>
              <button className="navbar__user-btn" onClick={handleLogout}>
                <User size={18} />
                <span>{user?.name?.split(' ')[0]}</span>
                <LogOut size={15} className="navbar__logout-icon" />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">تسجيل الدخول</Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="navbar__toggle" onClick={() => setIsOpen(!isOpen)} aria-label="toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${isOpen ? 'navbar__mobile--open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`navbar__mobile-link ${isActive(link.to) ? 'navbar__mobile-link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
        {isAuthenticated ? (
          <>
            <Link to={user?.role === 'admin' ? '/admin' : (user?.role === 'staff' ? '/staff' : '/dashboard')} className="navbar__mobile-link">لوحة التحكم</Link>
            <button className="navbar__mobile-logout" onClick={handleLogout}>
              <LogOut size={16} /> تسجيل الخروج
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar__mobile-cta">تسجيل الدخول</Link>
        )}
      </div>
    </nav>
  );
}
