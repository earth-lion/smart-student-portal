import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Mail, Phone, MapPin, CreditCard, BookOpen, Star, Hash } from 'lucide-react';
import './Dashboard.css';

export default function StudentProfile() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.student_id) { setLoading(false); return; }
    api.get(`/students/${user.student_id}`)
      .then(r => setStudent(r.data))
      .catch(() => setError('فشل تحميل بيانات الطالب'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div>
      <div className="stats-row">
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 12 }} />)}
      </div>
      <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
    </div>
  );

  if (error) return <div style={{ textAlign:'center', padding: 60, color: '#ef4444' }}>{error}</div>;
  if (!student) return <div style={{ textAlign:'center', padding: 60, color: 'var(--text-gray)' }}>لا توجد بيانات</div>;

  const info = [
    { icon: <Mail size={18}/>,     label: 'البريد الإلكتروني', value: student.email },
    { icon: <Phone size={18}/>,    label: 'رقم الهاتف',         value: student.phone_number || '—' },
    { icon: <MapPin size={18}/>,   label: 'العنوان',             value: student.address || '—' },
    { icon: <CreditCard size={18}/>,label:'الرقم القومي',       value: student.national_id },
    { icon: <BookOpen size={18}/>, label: 'القسم',              value: student.department },
    { icon: <Star size={18}/>,     label: 'الفرقة الدراسية',   value: `الفرقة ${student.academic_year}` },
    { icon: <Hash size={18}/>,     label: 'رقم الجلوس',        value: student.seat_number || '—' },
    { icon: <BookOpen size={18}/>, label: 'سنة القبول',         value: student.admission_year },
  ];

  return (
    <div className="animate-fade-in">
      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue"><Star size={22}/></div>
          <div>
            <div className="stat-card__val">{student.current_gpa ?? '—'}</div>
            <div className="stat-card__lbl">المعدل التراكمي</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--yellow"><BookOpen size={22}/></div>
          <div>
            <div className="stat-card__val">{student.total_credits ?? 0}</div>
            <div className="stat-card__lbl">الساعات المعتمدة</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green"><User size={22}/></div>
          <div>
            <div className="stat-card__val">{student.financial_status === 'paid' ? '✓' : '!'}</div>
            <div className="stat-card__lbl">الحالة المالية</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--red"><Hash size={22}/></div>
          <div>
            <div className="stat-card__val">{student.id}</div>
            <div className="stat-card__lbl">رقم الطالب</div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="page-card">
        <div className="profile-top">
          <div className="profile-avatar">
            {student.image_url && !student.image_url.includes('default')
              ? <img src={student.image_url} alt={student.name} />
              : <span>{student.name?.charAt(0)}</span>
            }
          </div>
          <div>
            <h2 className="profile-name">{student.name}</h2>
            <p className="profile-sub">{student.department} — الفرقة {student.academic_year}</p>
            <span className={`badge ${student.financial_status === 'paid' ? 'badge-success' : 'badge-danger'}`}>
              {student.financial_status === 'paid' ? 'الرسوم مسددة' : 'يوجد مستحقات'}
            </span>
          </div>
        </div>

        <div className="profile-grid">
          {info.map((item, i) => (
            <div key={i} className="profile-info-item">
              <div className="profile-info-icon">{item.icon}</div>
              <div>
                <p className="profile-info-label">{item.label}</p>
                <p className="profile-info-value">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial */}
      {student.financial_data && (
        <div className="page-card">
          <div className="page-card__header">
            <h3 className="page-card__title"><CreditCard size={20}/> البيانات المالية</h3>
          </div>
          <div className="financial-grid">
            <div className="financial-item">
              <span>الرسوم الثابتة</span>
              <span>{student.financial_data.fixed_fee?.toLocaleString()} ج.م</span>
            </div>
            <div className="financial-item">
              <span>رسوم المواد المسجلة</span>
              <span>{student.financial_data.courses_fee?.toLocaleString()} ج.م</span>
            </div>
            <div className="financial-item financial-item--total">
              <span>الإجمالي المستحق</span>
              <span>{student.financial_data.total_due?.toLocaleString()} ج.م</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
