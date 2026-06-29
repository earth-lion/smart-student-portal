import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, CheckCircle, AlertTriangle, ArrowLeft, ShieldCheck, Mail, User, Lock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Auth.css';

export default function CredentialLookup() {
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!nationalId || nationalId.length !== 14 || !/^\d{14}$/.test(nationalId)) {
      setError('يرجى إدخال رقم قومي صحيح مكون من 14 رقماً');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/credential-lookup', { national_id: nationalId });
      setResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'لم يتم العثور على أي حساب مرتبط بهذا الرقم القومي.';
      setError(msg);
    } finally {
      setLoading(false);
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
            هل نسيت بريدك الجامعي؟
          </h1>
          <p className="auth-panel__desc">
            أدخل رقمك القومي (14 رقم) وسيقوم النظام تلقائياً بالبحث عن حسابك الجامعي المسجل لدى إدارة الكلية وإظهار بريدك الإلكتروني.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature__icon"><ShieldCheck size={20} /></div>
              <div>
                <h4>آمن وسري</h4>
                <p>لا يتم حفظ أي بيانات بحث</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon"><GraduationCap size={20} /></div>
              <div>
                <h4>لجميع الأعضاء</h4>
                <p>يعمل للطلاب وأعضاء هيئة التدريس</p>
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
            <Search size={28} className="auth-form-icon" />
            <h2>الاستعلام بالرقم القومي</h2>
            <p>أدخل رقمك القومي للحصول على بريدك الجامعي</p>
          </div>

          {/* Result Card */}
          {result && (
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                width: 56, height: 56,
                background: '#10b981',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
                color: '#fff'
              }}>
                <CheckCircle size={28} />
              </div>
              <p style={{ color: '#065f46', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                تم العثور على حسابك!
              </p>
              <p style={{ color: '#047857', fontSize: '14px', marginBottom: '20px' }}>
                {result.role_label}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'right' }}>
                <div style={{ background: '#fff', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={18} style={{ color: '#059669', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>الاسم</p>
                    <strong style={{ color: '#111827' }}>{result.name}</strong>
                  </div>
                </div>
                <div style={{ background: '#fff', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={18} style={{ color: '#059669', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>البريد الجامعي</p>
                    <strong style={{ color: '#111827', direction: 'ltr' }}>{result.email}</strong>
                  </div>
                </div>
                {result.password && (
                  <div style={{ background: '#fff', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Lock size={18} style={{ color: '#059669', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>كلمة المرور الافتراضية</p>
                      <strong style={{ color: '#111827', direction: 'ltr' }}>{result.password}</strong>
                    </div>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '16px' }}>
                استخدم هذه البيانات لتسجيل الدخول مباشرة إلى المنصة
              </p>

              <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                الذهاب لتسجيل الدخول <ArrowLeft size={16} />
              </Link>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <AlertTriangle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
              <p style={{ color: '#991b1b', margin: 0, fontSize: '14px' }}>{error}</p>
            </div>
          )}

          {/* Form */}
          {!result && (
            <form className="auth-form" onSubmit={handleLookup} noValidate>
              <div className="form-group">
                <label className="form-label">الرقم القومي</label>
                <div className="input-wrapper">
                  <Search size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input input-with-icon"
                    placeholder="أدخل 14 رقماً"
                    value={nationalId}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 14);
                      setNationalId(val);
                      setError('');
                    }}
                    maxLength={14}
                    inputMode="numeric"
                    autoComplete="off"
                    dir="ltr"
                  />
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                  {nationalId.length} / 14 رقم
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading || nationalId.length !== 14}
              >
                {loading ? <span className="spinner" /> : <Search size={18} />}
                {loading ? 'جاري البحث...' : 'ابحث عن حسابي'}
              </button>
            </form>
          )}

          {result && (
            <button
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
              onClick={() => { setResult(null); setNationalId(''); }}
            >
              بحث جديد
            </button>
          )}

          <p className="auth-footer-text" style={{ marginTop: '20px' }}>
            <Link to="/login" className="auth-link">
              ← العودة لتسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
