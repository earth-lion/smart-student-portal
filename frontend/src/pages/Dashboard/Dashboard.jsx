import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, User, FileText, BarChart2,
  Calendar, BookOpen, Bell, BookMarked,
  LogOut, Menu, X, GraduationCap, ChevronLeft, CreditCard
} from 'lucide-react';
import './Dashboard.css';

const navItems = [
  { to: '/dashboard/profile',       icon: <User size={20} />,        label: 'بياناتي' },
  { to: '/dashboard/grades',        icon: <FileText size={20} />,    label: 'الدرجات' },
  { to: '/dashboard/gpa',           icon: <BarChart2 size={20} />,   label: 'المعدل التراكمي' },
  { to: '/dashboard/schedule',      icon: <Calendar size={20} />,    label: 'جدولي الدراسي' },
  { to: '/dashboard/courses',       icon: <BookOpen size={20} />,    label: 'تسجيل المواد' },
  { to: '/dashboard/financials',    icon: <CreditCard size={20} />,  label: 'الماليات والرسوم' },
  { to: '/dashboard/notifications', icon: <Bell size={20} />,        label: 'الإشعارات' },
  { to: '/dashboard/resources',     icon: <BookMarked size={20} />,  label: 'المصادر التعليمية' },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('تم تسجيل الخروج');
    navigate('/');
  };

  return (
    <div className="dash">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="dash__overlay" onClick={() => setSidebarOpen(false)} />}
      {/* Sidebar */}
      <aside className={`dash__sidebar ${sidebarOpen ? 'dash__sidebar--open' : 'dash__sidebar--collapsed'}`}>
        <div className="dash__sidebar-header">
          <NavLink to="/" className="dash__brand">
            <GraduationCap size={26} className="dash__brand-icon" />
            {sidebarOpen && <span>دليل</span>}
          </NavLink>
          <button
            className="dash__collapse-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="dash__user-card">
            <div className="dash__user-avatar">
              {user?.name?.charAt(0) || 'ط'}
            </div>
            <div className="dash__user-info">
              <p className="dash__user-name">{user?.name}</p>
              <span className="badge badge-primary">طالب</span>
            </div>
          </div>
        )}

        <nav className="dash__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `dash__nav-item ${isActive ? 'dash__nav-item--active' : ''}`
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="dash__nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="dash__nav-label">{item.label}</span>}
            </NavLink>
          ))}
          
          {/* Admin Mode Toggle — only for admins */}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className="dash__nav-item"
              style={{
                marginTop: 'auto',
                border: '1px dashed rgba(255, 193, 7, 0.4)',
                background: 'rgba(255, 193, 7, 0.08)',
                color: '#FFC107'
              }}
              title={!sidebarOpen ? 'لوحة المسؤول' : undefined}
            >
              <span className="dash__nav-icon"><LayoutDashboard size={20} /></span>
              {sidebarOpen && <span className="dash__nav-label">لوحة المسؤول</span>}
            </NavLink>
          )}
        </nav>

        <button className="dash__logout" onClick={handleLogout}>
          <LogOut size={20} />
          {sidebarOpen && <span>تسجيل الخروج</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="dash__main">
        <div className="dash__topbar">
          <button className="dash__mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="dash__topbar-title">لوحة تحكم الطالب</h1>
          <div className="dash__topbar-user">
            <span>{user?.name?.split(' ')[0]}</span>
            <div className="dash__topbar-avatar">{user?.name?.charAt(0)}</div>
          </div>
        </div>

        <div className="dash__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
