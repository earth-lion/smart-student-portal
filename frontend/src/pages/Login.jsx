import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'بريد إلكتروني غير صالح';
    if (!form.password) errs.password = 'كلمة المرور مطلوبة';
    else if (form.password.length < 8) errs.password = 'كلمة المرور 8 أحرف على الأقل';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success(`أهلاً ${result.user?.name?.split(' ')[0]} 👋`);
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else if (result.user?.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-panel auth-panel--left">
        <div className="auth-panel__content">
          <Link to="/" className="auth-logo">
            <GraduationCap size={36} />
            <span>دليل</span>
          </Link>
          <h1 className="auth-panel__title">
            مرحباً بعودتك إلى منصتك الأكاديمية
          </h1>
          <p className="auth-panel__desc">
            سجّل دخولك للوصول إلى جدولك الدراسي، درجاتك، وجميع خدماتك الأكاديمية.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature__icon"><ShieldCheck size={20} /></div>
              <div>
                <h4>آمن ومحمي</h4>
                <p>بياناتك مشفرة بالكامل مع Laravel Sanctum</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon"><GraduationCap size={20} /></div>
              <div>
                <h4>للطلاب والإداريين</h4>
                <p>صلاحيات مخصصة لكل نوع مستخدم</p>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-panel__shape" />
      </div>

      {/* Right Form */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <LogIn size={28} className="auth-form-icon" />
            <h2>تسجيل الدخول</h2>
            <p>أدخل بياناتك للمتابعة</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <div className={`input-wrapper ${errors.email ? 'input-wrapper--error' : ''}`}>
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-input input-with-icon"
                  placeholder="example@university.edu.eg"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="form-error">⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
              <div className={`input-wrapper ${errors.password ? 'input-wrapper--error' : ''}`}>
                <Lock size={18} className="input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  className="form-input input-with-icon input-with-icon-end"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-icon-end"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">⚠ {errors.password}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : <LogIn size={18} />}
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="auth-footer-notice" style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
            <p>يتم إنشاء الحسابات الجامعية تلقائياً عبر إدارة الكلية.</p>
            <p style={{ marginTop: '8px' }}>
              نسيت بريدك الجامعي؟{' '}
              <Link to="/get-email" className="auth-link">ابحث برقمك القومي</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
