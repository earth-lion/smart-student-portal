import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, User, CreditCard, Copy, Check, ArrowRight, GraduationCap } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Auth.css';

export default function UniversityEmail() {
  const [form, setForm] = useState({ name: '', national_id: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'الاسم مطلوب';
    if (!form.national_id) errs.national_id = 'الرقم القومي مطلوب';
    else if (form.national_id.length !== 14) errs.national_id = 'يجب أن يكون الرقم القومي 14 رقماً';
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
    setLoading(true);
    try {
      const res = await api.post('/get-university-email', {
        name: form.name,
        national_id: form.national_id,
      });
      setResult(res.data);
      toast.success('تم العثور على البريد الجامعي!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل جلب البيانات. يرجى التحقق من الرقم القومي والاسم.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.email) return;
    navigator.clipboard.writeText(result.email);
    setCopied(true);
    toast.success('تم نسخ البريد الإلكتروني');
    setTimeout(() => setCopied(false), 2000);
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
          <h1 className="auth-panel__title">الحصول على البريد الجامعي</h1>
          <p className="auth-panel__desc">
            أدخل اسمك والرقم القومي المكون من 14 رقماً للاستعلام عن بريدك الجامعي وكلمة المرور المخصصة لك لتتمكن من إنشاء حسابك.
          </p>
        </div>
        <div className="auth-panel__shape" />
      </div>

      {/* Right Panel */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <Mail size={28} className="auth-form-icon" />
            <h2>الاستعلام عن البريد الجامعي</h2>
            <p>املأ البيانات للمتابعة</p>
          </div>

          {!result ? (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">الاسم الكامل (كما هو مسجل بالكلية)</label>
                <div className={`input-wrapper ${errors.name ? 'input-wrapper--error' : ''}`}>
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    className="form-input input-with-icon"
                    placeholder="مثال: أحمد محمد علي"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                {errors.name && <p className="form-error">⚠ {errors.name}</p>}
              </div>

              {/* National ID */}
              <div className="form-group">
                <label className="form-label">الرقم القومي (14 رقم)</label>
                <div className={`input-wrapper ${errors.national_id ? 'input-wrapper--error' : ''}`}>
                  <CreditCard size={18} className="input-icon" />
                  <input
                    type="text"
                    name="national_id"
                    maxLength={14}
                    className="form-input input-with-icon"
                    placeholder="29910010000000"
                    value={form.national_id}
                    onChange={handleChange}
                  />
                </div>
                {errors.national_id && <p className="form-error">⚠ {errors.national_id}</p>}
              </div>

              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? <span className="spinner" /> : <Mail size={18} />}
                {loading ? 'جاري الاستعلام...' : 'استعلام'}
              </button>
            </form>
          ) : (
            <div className="animate-fade-in" style={{ textAlign: 'right' }}>
              <div style={{ background: 'rgba(4, 44, 118, 0.04)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '6px' }}>اسم الطالب:</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)', marginBottom: '16px' }}>{result.name}</p>

                <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '6px' }}>البريد الإلكتروني الجامعي:</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                  <input
                    type="text"
                    readOnly
                    value={result.email}
                    className="form-input"
                    style={{ flex: 1, direction: 'ltr', background: '#fff', fontSize: '14px' }}
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="btn"
                    style={{ padding: '12px', background: 'var(--primary)', color: '#fff', borderRadius: '8px' }}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '6px' }}>كلمة المرور الافتراضية:</p>
                <input
                  type="text"
                  readOnly
                  value={result.password}
                  className="form-input"
                  style={{ direction: 'ltr', background: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/academic-registration" className="btn btn-accent" style={{ justifyContent: 'center', width: '100%' }}>
                  المتابعة لإنشاء الحساب
                  <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
                </Link>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="btn btn-outline"
                  style={{ justifyContent: 'center', width: '100%' }}
                >
                  استعلام آخر
                </button>
              </div>
            </div>
          )}

          <p className="auth-footer-text" style={{ marginTop: '24px' }}>
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="auth-link">
              سجل الدخول من هنا
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
