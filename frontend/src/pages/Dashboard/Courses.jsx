import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  BookOpen, AlertTriangle, Plus, Trash2, Book,
  CheckCircle, Layers, CreditCard, X, Shield, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Dashboard.css';
import './Courses.css';

/* ── Mock Fawry Payment Modal ── */
function FawryModal({ courses, totalCost, onConfirm, onClose }) {
  const [step, setStep] = useState('review'); // 'review' | 'processing' | 'success'
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    if (cardNum.replace(/\s/g,'').length < 16) { toast.error('يرجى إدخال رقم البطاقة كاملاً (16 رقم)'); return; }
    setStep('processing');
    await new Promise(r => setTimeout(r, 2200));
    setStep('success');
  };

  const handleComplete = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fawry-overlay" onClick={onClose}>
      <div className="fawry-modal" onClick={e => e.stopPropagation()}>

        {step === 'review' && (
          <>
            <div className="fawry-header">
              <div className="fawry-logo">
                <CreditCard size={22} />
                <span>بوابة الدفع الإلكتروني — Fawry</span>
              </div>
              <button className="fawry-close" onClick={onClose}><X size={18}/></button>
            </div>
            <div className="fawry-body">
              <div className="fawry-order-summary">
                <h4>ملخص الطلب</h4>
                {courses.map(c => (
                  <div key={c.course_id} className="fawry-line">
                    <span>{c.name}</span>
                    <span>{c.price} ج.م.</span>
                  </div>
                ))}
                <div className="fawry-total">
                  <strong>الإجمالي</strong>
                  <strong className="fawry-total-val">{totalCost} ج.م.</strong>
                </div>
              </div>
              <form className="fawry-form" onSubmit={handlePay}>
                <p className="fawry-form-title"><Lock size={14}/> بيانات الدفع مشفرة وآمنة</p>
                <div className="fawry-field">
                  <label>رقم البطاقة</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={cardNum}
                    onChange={e => setCardNum(e.target.value.replace(/[^\d]/g,'').replace(/(.{4})/g,'$1 ').trim())}
                    dir="ltr"
                  />
                </div>
                <div className="fawry-field-row">
                  <div className="fawry-field">
                    <label>تاريخ الانتهاء</label>
                    <input type="text" placeholder="MM/YY" maxLength={5} value={expiry}
                      onChange={e => setExpiry(e.target.value)} dir="ltr"/>
                  </div>
                  <div className="fawry-field">
                    <label>CVV</label>
                    <input type="password" placeholder="***" maxLength={3} value={cvv}
                      onChange={e => setCvv(e.target.value)} dir="ltr"/>
                  </div>
                </div>
                <div className="fawry-secure-row">
                  <Shield size={13}/> هذا نظام دفع تجريبي آمن — لا يتم خصم مبالغ حقيقية
                </div>
                <button type="submit" className="fawry-pay-btn">
                  ادفع {totalCost} ج.م. الآن
                </button>
              </form>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="fawry-processing">
            <div className="fawry-spinner" />
            <h3>جاري معالجة الدفع...</h3>
            <p>يرجى الانتظار، لا تغلق هذه النافذة</p>
          </div>
        )}

        {step === 'success' && (
          <div className="fawry-success">
            <div className="fawry-success-icon">✓</div>
            <h3>تمت عملية الدفع بنجاح! 🎉</h3>
            <p>تم تسجيل المواد الدراسية وخصم الرسوم بنجاح. ستصلك رسالة تأكيد على بريدك الجامعي.</p>
            <div className="fawry-ref">
              <span>رقم مرجعي:</span>
              <strong>MTF-{Math.floor(Math.random() * 900000 + 100000)}</strong>
            </div>
            <button className="fawry-pay-btn" onClick={handleComplete}>
              الانتقال للمواد المسجلة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Courses() {
  const { user } = useAuth();
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableHours, setAvailableHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dropping, setDropping] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [totalSelectedHours, setTotalSelectedHours] = useState(0);
  const [showFawry, setShowFawry] = useState(false);

  const fetchData = async () => {
    if (!user?.student_id) return;
    setLoading(true);
    try {
      const regRes = await api.get(`/registrations/${user.student_id}/courses`);
      setRegisteredCourses(regRes.data.registered_courses || []);
      const avRes = await api.get(`/courses`, { params: { student_id: user.student_id } });
      setAvailableCourses(avRes.data.courses || []);
      setAvailableHours(avRes.data.available_hours || 0);
      setSelectedCourseIds([]);
      setTotalSelectedHours(0);
    } catch {
      toast.error('حدث خطأ أثناء تحميل بيانات المواد');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleCheckboxChange = (course) => {
    const isSelected = selectedCourseIds.includes(course.course_id);
    const newSelection = isSelected
      ? selectedCourseIds.filter(id => id !== course.course_id)
      : [...selectedCourseIds, course.course_id];
    setSelectedCourseIds(newSelection);
    const selected = availableCourses.filter(c => newSelection.includes(c.course_id));
    setTotalSelectedHours(selected.reduce((s, c) => s + (c.total_credits || 0), 0));
  };

  const handleRegisterConfirmed = async () => {
    try {
      const res = await api.post('/courses/register', {
        student_id: user.student_id,
        course_ids: selectedCourseIds,
      });
      if (res.data.registered?.length > 0) toast.success(res.data.message || 'تم تسجيل المواد بنجاح ✓');
      if (res.data.note_failed) toast.error(res.data.note_failed);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل التسجيل. يرجى مراجعة الشروط.');
    }
  };

  const handleDrop = async (courseId, courseName) => {
    if (!window.confirm(`هل أنت متأكد من حذف مادة: ${courseName}؟`)) return;
    setDropping(true);
    try {
      await api.delete('/registrations', { data: { student_id: user.student_id, course_id: courseId } });
      toast.success('تم حذف المادة بنجاح');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل حذف المادة');
    } finally {
      setDropping(false);
    }
  };

  // Compute total cost from selected courses
  const selectedCourses = availableCourses.filter(c => selectedCourseIds.includes(c.course_id));
  const totalCost = selectedCourses.reduce((s, c) => s + parseFloat(c.price || 0), 0).toFixed(0);

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: 200, borderRadius: 16, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Fawry Modal */}
      {showFawry && (
        <FawryModal
          courses={selectedCourses}
          totalCost={totalCost}
          onConfirm={handleRegisterConfirmed}
          onClose={() => setShowFawry(false)}
        />
      )}

      {/* 1. Registered Courses */}
      <div className="page-card">
        <div className="page-card__header">
          <h3 className="page-card__title"><BookOpen size={20}/> المواد المسجلة حالياً</h3>
          <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: 13 }}>
            الساعات المسجلة: {registeredCourses.reduce((s, c) => s + (c.total_credits || 0), 0)} ساعة
          </span>
        </div>
        {registeredCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-gray)' }}>
            <Book size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>لا يوجد مواد مسجلة حالياً.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="grades-table">
              <thead>
                <tr><th>المادة</th><th>الساعات</th><th>النوع</th><th>المحاضر</th><th>الرسوم</th><th>حذف</th></tr>
              </thead>
              <tbody>
                {registeredCourses.map(c => (
                  <tr key={c.course_id}>
                    <td style={{ fontWeight: 700 }}>{c.name}</td>
                    <td>{c.total_credits} ساعات</td>
                    <td><span className="badge badge-primary">{c.type === 'lecture' ? 'محاضرة' : 'عملي'}</span></td>
                    <td>{c.instructor_name || 'هيئة التدريس'}</td>
                    <td><span className="badge badge-accent">{c.price || 0} ج.م.</span></td>
                    <td>
                      <button onClick={() => handleDrop(c.course_id, c.name)}
                        className="btn" disabled={dropping}
                        style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', color: '#dc2626', borderRadius: 8, fontSize: 12 }}>
                        <Trash2 size={14}/> حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Available Courses */}
      <div className="page-card">
        <div className="page-card__header">
          <h3 className="page-card__title"><Layers size={20}/> تسجيل المقررات الدراسية</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="badge badge-accent" style={{ padding: '6px 14px', fontSize: 13 }}>
              المتاحة: {availableHours} ساعة
            </span>
            <span className="badge badge-primary" style={{ padding: '6px 14px', fontSize: 13 }}>
              المحددة: {totalSelectedHours} ساعة
            </span>
          </div>
        </div>

        {availableCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-gray)' }}>
            <CheckCircle size={40} color="#059669" style={{ opacity: 0.8, marginBottom: 12 }} />
            <p>لا توجد مواد متاحة للتسجيل حالياً.</p>
          </div>
        ) : (
          <div>
            <div style={{ overflowX: 'auto', marginBottom: 24 }}>
              <table className="grades-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>اختر</th>
                    <th>اسم المادة</th>
                    <th>الساعات</th>
                    <th>النوع</th>
                    <th>المحاضر</th>
                    <th>الرسوم</th>
                    <th>الفرقة/الترم</th>
                  </tr>
                </thead>
                <tbody>
                  {availableCourses.map(c => (
                    <tr key={c.course_id} className={selectedCourseIds.includes(c.course_id) ? 'row-selected' : ''}>
                      <td>
                        <input type="checkbox" checked={selectedCourseIds.includes(c.course_id)}
                          onChange={() => handleCheckboxChange(c)}
                          style={{ width: 18, height: 18, cursor: 'pointer' }} />
                      </td>
                      <td style={{ fontWeight: 700 }}>{c.name}</td>
                      <td>{c.total_credits} ساعات</td>
                      <td><span className="badge badge-primary">{c.type === 'lecture' ? 'محاضرة' : 'عملي'}</span></td>
                      <td>{c.instructor_name || 'هيئة التدريس'}</td>
                      <td><span className="badge badge-accent">{c.price || 0} ج.م.</span></td>
                      <td>الترم {c.semester} — الفرقة {c.academic_year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cost summary bar */}
            {selectedCourseIds.length > 0 && (
              <div className="cost-summary-bar">
                <div className="cost-summary-info">
                  <CreditCard size={18}/>
                  <span>إجمالي رسوم المواد المحددة ({selectedCourseIds.length} مادة):</span>
                  <strong className="cost-total">{totalCost} جنيه مصري</strong>
                </div>
                <button onClick={() => setShowFawry(true)} className="btn btn-accent fawry-trigger-btn">
                  <CreditCard size={16}/> ادفع وسجّل المواد عبر Fawry
                </button>
              </div>
            )}

            {selectedCourseIds.length === 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-accent" disabled style={{ fontSize: 14 }}>
                  <Plus size={16}/> حدد مواد للتسجيل
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
