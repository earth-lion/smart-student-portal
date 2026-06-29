import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, User, Lock, Eye, EyeOff, GraduationCap, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { register, loading } = useAuth();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'الاسم مطلوب';
    else if (form.name.trim().length < 3) errs.name = 'الاسم 3 أحرف على الأقل';
    if (!form.email) errs.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'بريد إلكتروني غير صالح';
    if (!form.password) errs.password = 'كلمة المرور مطلوبة';
    else if (form.password.length < 8) errs.password = 'كلمة المرور 8 أحرف على الأقل';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'كلمات المرور غير متطابقة';
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
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      setSuccess(true);
      toast.success('تم إنشاء الحساب بنجاح!');
    } else {
      toast.error(result.message);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-panel auth-panel--right" style={{ flex: 1 }}>
          <div className="auth-form-wrapper" style={{ textAlign: 'center' }}>
            <CheckCircle size={64} color="#059669" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ color: 'var(--primary)', fontSize: 26, fontWeight: 800, marginBottom: 12 }}>تم التسجيل بنجاح!</h2>
            <p style={{ color: 'var(--text-gray)', marginBottom: 30 }}>
              تم إنشاء حسابك. يمكنك الآن تسجيل الدخول والوصول إلى لوحة التحكم.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              تسجيل الدخول الآن
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-panel auth-panel--left">
        <div className="auth-panel__content">
          <Link to="/" className="auth-logo">
            <GraduationCap size={36} />
            <span>دليل</span>
          </Link>
          <h1 className="auth-panel__title">إنشاء حساب جديد على المنصة</h1>
          <p className="auth-panel__desc">
            سجّل بالبريد الجامعي الخاص بك للوصول إلى جميع الخدمات الأكاديمية.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature__icon"><Mail size={20} /></div>
              <div>
                <h4>بريد جامعي فقط</h4>
                <p>التسجيل متاح فقط للبريد الجامعي المعتمد</p>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-panel__shape" />
      </div>

      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <User size={28} className="auth-form-icon" />
            <h2>إنشاء حساب</h2>
            <p>أدخل بياناتك لإنشاء حسابك</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">الاسم الكامل</label>
              <div className={`input-wrapper ${errors.name ? 'input-wrapper--error' : ''}`}>
                <User size={18} className="input-icon" />
                <input type="text" name="name" className="form-input input-with-icon"
                  placeholder="أحمد محمد علي" value={form.name} onChange={handleChange} />
              </div>
              {errors.name && <p className="form-error">⚠ {errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">البريد الجامعي</label>
              <div className={`input-wrapper ${errors.email ? 'input-wrapper--error' : ''}`}>
                <Mail size={18} className="input-icon" />
                <input type="email" name="email" className="form-input input-with-icon"
                  placeholder="s.12345@university.edu.eg" value={form.email} onChange={handleChange} />
              </div>
              {errors.email && <p className="form-error">⚠ {errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
              <div className={`input-wrapper ${errors.password ? 'input-wrapper--error' : ''}`}>
                <Lock size={18} className="input-icon" />
                <input type={showPass ? 'text' : 'password'} name="password"
                  className="form-input input-with-icon input-with-icon-end"
                  placeholder="••••••••" value={form.password} onChange={handleChange} />
                <button type="button" className="input-icon-end" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">⚠ {errors.password}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">تأكيد كلمة المرور</label>
              <div className={`input-wrapper ${errors.confirmPassword ? 'input-wrapper--error' : ''}`}>
                <Lock size={18} className="input-icon" />
                <input type="password" name="confirmPassword"
                  className="form-input input-with-icon"
                  placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
              </div>
              {errors.confirmPassword && <p className="form-error">⚠ {errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </button>
          </form>

          <p className="auth-footer-text">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="auth-link">سجل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
