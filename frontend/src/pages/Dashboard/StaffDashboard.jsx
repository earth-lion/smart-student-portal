import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap, LayoutDashboard, BookOpen, Clock,
  FileSpreadsheet, Users, Calendar, LogOut, Menu, X, ChevronLeft,
  Plus, Edit, ClipboardList
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './StaffDashboard.css';

/* ── Sidebar Nav Items ── */
const staffNav = [
  { id: 'overview',  label: 'نظرة عامة',   icon: <LayoutDashboard size={20}/> },
  { id: 'courses',   label: 'مقرراتي',     icon: <BookOpen size={20}/> },
  { id: 'grades',    label: 'رصد الدرجات',  icon: <FileSpreadsheet size={20}/> },
  { id: 'schedule',  label: 'جدول المحاضرات', icon: <Calendar size={20}/> },
];

export default function StaffDashboard() {
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Data states
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  // Grade dialog state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesRes, studentsRes, schedulesRes] = await Promise.all([
        api.get('/staff/courses'),
        api.get('/staff/students'),
        api.get('/staff/schedules')
      ]);
      setCourses(coursesRes.data || []);
      setStudents(studentsRes.data || []);
      setSchedules(schedulesRes.data || []);
    } catch (err) {
      toast.error('فشل جلب بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/');
  };

  // Grade submit handler
  const handleOpenGradeModal = (std) => {
    setSelectedStudent(std);
    setGradeInput(std.grade !== null && std.grade !== undefined ? std.grade.toString() : '');
    setShowGradeModal(true);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseInt(gradeInput);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      toast.error('يرجى إدخال درجة صالحة بين 0 و 100');
      return;
    }

    setSubmittingGrade(true);
    try {
      await api.post('/staff/grades', {
        student_id: selectedStudent.student_id,
        course_id: selectedStudent.course_id,
        grade: parsed
      });
      toast.success('تم رصد وتحديث درجة الطالب بنجاح ✓');
      setShowGradeModal(false);
      // Reload students list to reflect changes
      const studentsRes = await api.get('/staff/students');
      setStudents(studentsRes.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل رصد درجة الطالب');
    } finally {
      setSubmittingGrade(false);
    }
  };

  const handleExportCSV = () => {
    let csv = 'رقم الجلوس,اسم الطالب,القسم,المقرر الدراسي,الدرجة الحالية\n';
    students.forEach(std => {
      csv += `${std.seat_number},${std.student_name},${std.department},${std.course_name},${std.grade !== null ? std.grade : 'معلق'}\n`;
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'تقرير_درجات_الطلاب.csv';
    link.click();
  };

  return (
    <div className="stf-layout">
      {/* Mobile overlay — closes sidebar when tapping outside */}
      {sidebarOpen && <div className="stf-overlay" onClick={() => setSidebarOpen(false)} />}
      {/* Sidebar */}
      <aside className={`stf-sidebar ${sidebarOpen ? 'stf-sidebar--open' : 'stf-sidebar--collapsed'}`}>
        <div className="stf-sidebar-header">
          <Link to="/" className="stf-brand">
            <GraduationCap size={26} className="stf-brand-icon" />
            {sidebarOpen && <span>دليل — الأكاديمي</span>}
          </Link>
          <button className="stf-collapse-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={18}/> : <Menu size={18}/>}
          </button>
        </div>

        <div className="stf-role-badge">
          {sidebarOpen && <><Users size={14}/> عضو هيئة تدريس / مدرس</>}
        </div>

        <nav className="stf-nav">
          {staffNav.map(item => (
            <button
              key={item.id}
              className={`stf-nav-item ${active === item.id ? 'stf-nav-item--active' : ''}`}
              onClick={() => setActive(item.id)}
              title={!sidebarOpen ? item.label : undefined}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="stf-back-btn" onClick={handleLogout}>
          <LogOut size={20}/>
          {sidebarOpen && <span>تسجيل خروج</span>}
        </button>
      </aside>

      {/* Main Container */}
      <main className="stf-main">
        <div className="stf-topbar">
          <button className="stf-mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
          <h1 className="stf-topbar-title">
            {active === 'overview' && 'لوحة التحكم الأكاديمية'}
            {active === 'courses' && 'المقررات الدراسية الموكلة'}
            {active === 'grades' && 'بوابة رصد درجات الطلاب'}
            {active === 'schedule' && 'جدول المحاضرات واللقاءات'}
          </h1>
          <div className="stf-topbar-badge">
            <div className="stf-topbar-dot" /> بوابة المدرس نشطة
          </div>
        </div>

        <div className="stf-content">
          {loading && active !== 'grades' ? (
            <div className="stf-loading"><span className="spinner" /> جاري تحميل البيانات الأكاديمية...</div>
          ) : (
            <>
              {/* ── OVERVIEW PANEL ── */}
              {active === 'overview' && (
                <div>
                  <div className="stf-welcome-banner">
                    <div>
                      <h2>أهلاً بك يا دكتور {user?.name} 👋</h2>
                      <p>من هنا يمكنك إدخال وتعديل درجات الطلاب، استعراض المجموعات المسجلة تحت إشرافك، والاطلاع على جدول محاضراتك الأسبوعي.</p>
                    </div>
                    <GraduationCap size={64} className="stf-welcome-icon" />
                  </div>

                  <div className="stf-kpi-grid">
                    <div className="stf-kpi stf-kpi--blue">
                      <BookOpen size={28}/>
                      <div><span className="stf-kpi-val">{courses.length}</span><span className="stf-kpi-lbl">مقررات أقوم بتدريسها</span></div>
                    </div>
                    <div className="stf-kpi stf-kpi--gold">
                      <Users size={28}/>
                      <div><span className="stf-kpi-val">{students.length}</span><span className="stf-kpi-lbl">طالب مسجل بمقرراتي</span></div>
                    </div>
                    <div className="stf-kpi stf-kpi--green">
                      <Calendar size={28}/>
                      <div><span className="stf-kpi-val">{schedules.length}</span><span className="stf-kpi-lbl">ساعات مدرجة بالجدول</span></div>
                    </div>
                  </div>

                  <div className="stf-stats-detail-grid">
                    <div className="adm-card">
                      <h3 style={{ marginBottom: 15 }}>📋 الملف الأكاديمي والمهني</h3>
                      <div className="stats-row">
                        <span>الاسم الكامل</span>
                        <strong>{user?.name}</strong>
                      </div>
                      <div className="stats-row">
                        <span>البريد الإلكتروني الجامعي</span>
                        <strong>{user?.email}</strong>
                      </div>
                      <div className="stats-row">
                        <span>المسمى الوظيفي</span>
                        <strong>{user?.job_title || 'عضو هيئة تدريس'}</strong>
                      </div>
                      <div className="stats-row">
                        <span>القسم الأكاديمي</span>
                        <strong>{user?.department || 'شؤون التعليم والطلاب'}</strong>
                      </div>
                      <div className="stats-row">
                        <span>الراتب الشهري الأساسي</span>
                        <strong>{user?.salary ? `${user?.salary} ج.م` : '-'}</strong>
                      </div>
                      <div className="stats-row">
                        <span>تاريخ التعيين</span>
                        <strong>{user?.hire_date || '-'}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── COURSES PANEL ── */}
              {active === 'courses' && (
                <div className="table-responsive">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>كود المادة</th>
                        <th>اسم المقرر الدراسي</th>
                        <th>الساعات المعتمدة</th>
                        <th>سعر الساعة الدراسية</th>
                        <th>القسم التابع له</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.course_id}>
                          <td><strong>{course.course_id}</strong></td>
                          <td>{course.name}</td>
                          <td>{course.total_credits} ساعات</td>
                          <td>{course.price} ج.م</td>
                          <td>{course.department || 'عام'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── GRADES PANEL ── */}
              {active === 'grades' && (
                <div>
                  <div className="panel-actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
                      اضغط على زر <strong>رصد الدرجة</strong> أمام أي طالب لإدخال أو تعديل النتيجة الأكاديمية للفصل الدراسي الحالي.
                    </p>
                    <button className="btn btn-outline" onClick={handleExportCSV} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <FileSpreadsheet size={16} /> تحميل كشف الدرجات (CSV)
                    </button>
                  </div>
                  
                  <div className="table-responsive">
                    <table className="adm-table">
                      <thead>
                        <tr>
                          <th>رقم الجلوس</th>
                          <th>اسم الطالب</th>
                          <th>القسم</th>
                          <th>المقرر الدراسي</th>
                          <th>الدرجة الحالية (من 100)</th>
                          <th>حالة الرصد</th>
                          <th>العمليات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((std, idx) => (
                          <tr key={idx}>
                            <td><strong>{std.seat_number}</strong></td>
                            <td>{std.student_name}</td>
                            <td>{std.department}</td>
                            <td>{std.course_name}</td>
                            <td>
                              <strong>{std.grade !== null && std.grade !== undefined ? `${std.grade} / 100` : '-'}</strong>
                            </td>
                            <td>
                              <span className={`badge badge--${std.grade !== null ? 'success' : 'danger'}`}>
                                {std.grade !== null ? 'تم الرصد ✓' : 'معلق'}
                              </span>
                            </td>
                            <td>
                              <button className="btn-edit" onClick={() => handleOpenGradeModal(std)}>
                                <Edit size={14} style={{ marginLeft: 4 }} />
                                رصد الدرجة
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── SCHEDULE PANEL ── */}
              {active === 'schedule' && (
                <div className="table-responsive">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>المادة</th>
                        <th>كود المادة</th>
                        <th>اليوم</th>
                        <th>وقت البدء</th>
                        <th>وقت الانتهاء</th>
                        <th>رقم القاعة/المدرج</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map(slot => (
                        <tr key={slot.id}>
                          <td><strong>{slot.course?.name || 'مقرر دراسي'}</strong></td>
                          <td>{slot.course_id}</td>
                          <td>{slot.day}</td>
                          <td>{slot.start_time}</td>
                          <td>{slot.end_time}</td>
                          <td>{slot.room || 'قاعة المحاضرات'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Grade entry modal */}
      {showGradeModal && selectedStudent && (
        <div className="adm-modal-overlay">
          <div className="adm-modal" style={{ maxWidth: '400px' }}>
            <div className="adm-modal-header">
              <h3>رصد درجة طالب</h3>
              <button className="close-btn" onClick={() => setShowGradeModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleGradeSubmit} className="adm-form">
              <div style={{ marginBottom: 15 }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#64748b' }}>اسم الطالب</p>
                <strong>{selectedStudent.student_name}</strong>
              </div>
              <div style={{ marginBottom: 15 }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#64748b' }}>المقرر الدراسي</p>
                <strong>{selectedStudent.course_name}</strong>
              </div>
              <div className="form-group">
                <label>الدرجة النهائية (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  autoFocus
                  placeholder="أدخل الرقم"
                  value={gradeInput}
                  onChange={e => setGradeInput(e.target.value)}
                />
              </div>
              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary" disabled={submittingGrade}>
                  {submittingGrade ? 'جاري الحفظ...' : 'حفظ النتيجة'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowGradeModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
