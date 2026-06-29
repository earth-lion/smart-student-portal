import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap, LayoutDashboard, MessageSquare, Bell,
  BookMarked, LogOut, Menu, X, ChevronLeft,
  Users, Send, Trash2, CheckCircle, Clock,
  Upload, Plus, BookOpen, Calendar, Book, Layers, AlertTriangle
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './AdminDashboard.css';

/* ── Sidebar nav items ── */
const adminNav = [
  { id: 'overview',       label: 'نظرة عامة',      icon: <LayoutDashboard size={20}/> },
  { id: 'students',       label: 'إدارة الطلاب',   icon: <Users size={20}/> },
  { id: 'staff',          label: 'إدارة الموظفين',  icon: <Layers size={20}/> },
  { id: 'messages',       label: 'رسائل الطلاب',   icon: <MessageSquare size={20}/> },
  { id: 'notifications',  label: 'إرسال إشعار',    icon: <Bell size={20}/> },
  { id: 'resources',      label: 'المصادر والكتب',  icon: <BookMarked size={20}/> },
  { id: 'schedules',      label: 'جدولة المحاضرات', icon: <Calendar size={20}/> },
  { id: 'audit',          label: 'سجل النشاطات',   icon: <Clock size={20}/> },
];

/* ── Static configuration choices ── */
const coursesData = [
  { id: 1, name: 'مقدمة في تكنولوجيا المعلومات' },
  { id: 2, name: 'خوارزميات وهياكل البيانات' },
  { id: 3, name: 'قواعد البيانات' },
  { id: 4, name: 'هندسة البرمجيات' },
  { id: 5, name: 'رياضيات الحاسب' },
];

const departmentsData = [
  { id: 1, name: 'علوم الحاسب (CS)' },
  { id: 2, name: 'هندسة البرمجيات (SE)' },
  { id: 3, name: 'نظم المعلومات (IS)' },
];

const yearsData = [
  { id: 1, name: 'الفرقة الأولى' },
  { id: 2, name: 'الفرقة الثانية' },
  { id: 3, name: 'الفرقة الثالثة' },
  { id: 4, name: 'الفرقة الرابعة' },
];

/* ── Overview stats ── */
const OverviewPanel = ({ stats, messagesCount, resourcesCount, schedulesCount }) => {
  const counts = stats?.counts || {
    students: 10,
    staff: 10,
    courses: 5,
    resources: resourcesCount,
    schedules: schedulesCount
  };
  const academic = stats?.academic || { gpa_avg: 3.4, gpa_warning_count: 0 };
  const financial = stats?.financial || { total_due: 0, total_paid: 0, total_remaining: 0 };

  return (
    <div className="adm-overview">
      <div className="adm-welcome-banner">
        <div>
          <h2>مرحباً بك في لوحة التحكم الإدارية 👋</h2>
          <p>يمكنك من هنا إدارة شؤون الطلاب، الموظفين، إعداد الجداول، رفع المناهج الدراسية ومتابعة الأداء الأكاديمي والمالي للكلية.</p>
        </div>
        <GraduationCap size={64} className="adm-welcome-icon" />
      </div>
      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--blue">
          <Users size={28}/>
          <div><span className="adm-kpi-val">{counts.students}</span><span className="adm-kpi-lbl">إجمالي الطلاب</span></div>
        </div>
        <div className="adm-kpi adm-kpi--gold">
          <Layers size={28}/>
          <div><span className="adm-kpi-val">{counts.staff}</span><span className="adm-kpi-lbl">أعضاء التدريس والموظفين</span></div>
        </div>
        <div className="adm-kpi adm-kpi--green">
          <BookMarked size={28}/>
          <div><span className="adm-kpi-val">{counts.resources}</span><span className="adm-kpi-lbl">المصادر التعليمية</span></div>
        </div>
        <div className="adm-kpi adm-kpi--dark">
          <Calendar size={28}/>
          <div><span className="adm-kpi-val">{counts.schedules}</span><span className="adm-kpi-lbl">مواعيد المحاضرات</span></div>
        </div>
      </div>

      <div className="adm-stats-detail-grid">
        <div className="adm-card">
          <h3 style={{ marginBottom: 15 }}>📊 مؤشرات التحصيل الأكاديمي للكلية</h3>
          <div className="stats-row">
            <span>متوسط المعدل التراكمي (GPA)</span>
            <strong>{academic.gpa_avg} / 4.00</strong>
          </div>
          <div className="stats-row">
            <span>طلاب تحت الإنذار الأكاديمي (GPA &lt; 2.0)</span>
            <strong className={academic.gpa_warning_count > 0 ? "warning-txt" : ""}>{academic.gpa_warning_count} طالب</strong>
          </div>
          <div style={{ width: '100%', height: 220, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'الناجحين (GPA > 2.0)', value: counts.students - academic.gpa_warning_count, fill: '#042C76' },
                { name: 'الإنذار الأكاديمي', value: academic.gpa_warning_count, fill: '#ef4444' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="adm-card">
          <h3 style={{ marginBottom: 15 }}>💰 تقرير الرسوم والمستحقات الدراسية</h3>
          <div className="stats-row">
            <span>إجمالي المستحقات الكليّة</span>
            <strong>{financial.total_due} ج.م</strong>
          </div>
          <div className="stats-row">
            <span>الرسوم المحصلة والمدفوعة</span>
            <strong className="success-txt">{financial.total_paid} ج.م</strong>
          </div>
          <div className="stats-row">
            <span>المتبقي غير المحصل</span>
            <strong className="warning-txt">{financial.total_remaining} ج.م</strong>
          </div>
          <div style={{ width: '100%', height: 220, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'تم تحصيله', value: Number(financial.total_paid) },
                    { name: 'متبقي (متأخرات)', value: Number(financial.total_remaining) }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <RechartsTooltip formatter={(value) => `${value} ج.م`} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Messages Panel ── */
const MessagesPanel = ({ messages, setMessages, loading, refreshMessages }) => {
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [sendingReply, setSendingReply] = useState({});
  const [search, setSearch] = useState('');

  if (loading) return <div className="adm-loading"><span className="spinner" /> جاري التحميل...</div>;

  const handleSendReply = async (msgId, studentId, studentName, contentExcerpt) => {
    const text = replyTexts[msgId];
    if (!text || !text.trim()) {
      toast.error('يرجى كتابة نص الرد أولاً');
      return;
    }
    setSendingReply(prev => ({ ...prev, [msgId]: true }));
    try {
      await api.post('/notifications/send', {
        title: `رد من إدارة الكلية بخصوص استفسارك`,
        message: text,
        category: 'personal',
        student_id: studentId
      });
      toast.success(`تم إرسال الرد إلى الطالب ${studentName} كإشعار بنجاح ✓`);
      setReplyTexts(prev => ({ ...prev, [msgId]: '' }));
      setActiveReplyId(null);
    } catch (err) {
      toast.error('فشل إرسال الرد');
    } finally {
      setSendingReply(prev => ({ ...prev, [msgId]: false }));
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    try {
      await api.delete(`/comments/${msgId}`);
      toast.success('تم حذف الرسالة بنجاح');
      refreshMessages();
    } catch {
      toast.error('فشل حذف الرسالة');
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.student?.name?.toLowerCase().includes(search.toLowerCase()) || 
    msg.content?.toLowerCase().includes(search.toLowerCase()) ||
    (msg.student?.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-panel animate-fade-in">
      <div className="adm-panel-header" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3><MessageSquare size={20}/> رسائل الطلاب والتعليقات ({filteredMessages.length})</h3>
        </div>
        <div className="adm-search-bar" style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <input
            type="text"
            style={{ flex: 1, padding: '8px 12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '13px' }}
            placeholder="🔍 ابحث باسم الطالب أو البريد أو مضمون الرسالة..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {filteredMessages.length === 0 ? (
        <div className="adm-empty">
          <CheckCircle size={48} />
          <p>لا توجد رسائل مطابقة للبحث.</p>
        </div>
      ) : (
        <div className="adm-messages-list">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="adm-msg-card">
              <div className="adm-msg-avatar">{msg.student?.name?.charAt(0) || '؟'}</div>
              <div className="adm-msg-body">
                <div className="adm-msg-meta">
                  <strong>{msg.student?.name || 'طالب مجهول'}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="adm-msg-time">
                      <Clock size={12}/> {new Date(msg.created_at).toLocaleString('ar-EG')}
                    </span>
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="adm-action-btn adm-action-btn--danger"
                      title="حذف الرسالة"
                      style={{ width: '24px', height: '24px', borderRadius: '4px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <p className="adm-msg-content" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span className="adm-msg-email" style={{ fontSize: '11px', color: '#888' }}>
                    البريد: {msg.student?.email || '-'} | الهوية: {msg.student?.national_id || '-'}
                  </span>
                  <button 
                    onClick={() => setActiveReplyId(activeReplyId === msg.id ? null : msg.id)}
                    className="dept-card__btn"
                    style={{ padding: '6px 14px', fontSize: '12px', background: 'var(--primary)', color: '#fff' }}
                  >
                    رد على الاستفسار
                  </button>
                </div>

                {activeReplyId === msg.id && (
                  <div className="adm-msg-reply-box">
                    <textarea
                      className="adm-msg-reply-input"
                      rows={3}
                      value={replyTexts[msg.id] || ''}
                      onChange={e => setReplyTexts({ ...replyTexts, [msg.id]: e.target.value })}
                      placeholder="اكتب ردك الأكاديمي هنا للرد على الطالب..."
                    />
                    <div className="adm-msg-reply-actions">
                      <button 
                        onClick={() => setActiveReplyId(null)}
                        className="adm-msg-reply-btn adm-msg-reply-btn--cancel"
                      >
                        إلغاء
                      </button>
                      <button 
                        onClick={() => handleSendReply(msg.id, msg.student_id, msg.student?.name || 'الطالب', msg.content)}
                        className="adm-msg-reply-btn adm-msg-reply-btn--send"
                        disabled={sendingReply[msg.id]}
                        style={{ background: 'var(--accent)', color: '#000' }}
                      >
                        {sendingReply[msg.id] ? 'جاري الإرسال...' : 'إرسال الرد'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Notifications Panel ── */
const NotificationsPanel = () => {
  const [form, setForm] = useState({ title: '', message: '', category: 'general' });
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) { toast.error('يرجى ملء العنوان ونص الإشعار'); return; }
    setSending(true);
    try {
      await api.post('/notifications/send', form);
      toast.success('تم إرسال الإشعار لجميع الطلاب بنجاح ✓');
      setForm({ title: '', message: '', category: 'general' });
    } catch {
      toast.error('فشل إرسال الإشعار');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="adm-panel animate-fade-in">
      <div className="adm-panel-header">
        <h3><Bell size={20}/> إرسال تنبيه أو إشعار فوري</h3>
      </div>
      <div className="adm-notif-info">
        <AlertTriangle size={16}/> سيظهر هذا التنبيه لجميع الطلاب في لوحة التحكم الخاصة بهم فور الإرسال.
      </div>
      <form className="adm-notif-form" onSubmit={handleSend}>
        <div className="adm-form-group">
          <label>عنوان الإشعار</label>
          <input
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            placeholder="مثال: بدء امتحانات الفصل الدراسي الأول"
          />
        </div>
        <div className="adm-form-group">
          <label>التصنيف</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option value="general">عام</option>
            <option value="academic">أكاديمي</option>
            <option value="financial">مالي ومصروفات</option>
          </select>
        </div>
        <div className="adm-form-group">
          <label>مضمون الرسالة</label>
          <textarea
            rows={5}
            value={form.message}
            onChange={e => setForm({...form, message: e.target.value})}
            placeholder="اكتب نص الإعلان هنا بالتفصيل..."
          />
        </div>
        <button type="submit" className="btn btn-primary adm-send-btn" disabled={sending}>
          {sending ? <span className="spinner" /> : <Send size={16}/>}
          {sending ? 'جاري الإرسال...' : 'نشر الإشعار الآن'}
        </button>
      </form>
    </div>
  );
};

/* ── Resources & Books Panel ── */
const ResourcesPanel = ({ resources, refreshResources }) => {
  const [subTab, setSubTab] = useState('list'); // 'list' | 'add'
  const [form, setForm] = useState({
    title: '',
    resource_type: 'محاضرات', // 'محاضرات' | 'كتب'
    instructor_name: '',
    course_id: 1,
    department_id: 2,
    academic_year: 1
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error('يرجى كتابة عنوان المصدر أو الكتاب'); return; }
    setSubmitting(true);

    const data = new FormData();
    data.append('title', form.title);
    data.append('resource_type', form.resource_type);
    data.append('instructor_name', form.instructor_name || 'هيئة التدريس');
    data.append('course_id', form.course_id);
    data.append('department_id', form.department_id);
    data.append('academic_year', form.academic_year);
    if (selectedFile) {
      data.append('file', selectedFile);
    }

    try {
      await api.post('/resources', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('تم إضافة المصدر الأكاديمي بنجاح ✓');
      setForm({
        title: '',
        resource_type: 'محاضرات',
        instructor_name: '',
        course_id: 1,
        department_id: 2,
        academic_year: 1
      });
      setSelectedFile(null);
      refreshResources();
      setSubTab('list');
    } catch {
      toast.error('فشل إضافة المصدر');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المصدر التعليمي؟')) return;
    try {
      await api.delete(`/resources/${id}`);
      toast.success('تم حذف المصدر بنجاح');
      refreshResources();
    } catch {
      toast.error('فشل حذف المصدر');
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title?.toLowerCase().includes(search.toLowerCase()) ||
                          (res.instructor_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || res.resource_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="adm-panel animate-fade-in">
      <div className="adm-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3><BookMarked size={20}/> إدارة المصادر والكتب الدراسية</h3>
        <div className="adm-sub-tabs">
          <button className={`adm-tab-btn ${subTab === 'list' ? 'adm-tab-btn--active' : ''}`} onClick={() => setSubTab('list')}>
            <Layers size={14}/> المصادر الحالية ({filteredResources.length})
          </button>
          <button className={`adm-tab-btn ${subTab === 'add' ? 'adm-tab-btn--active' : ''}`} onClick={() => setSubTab('add')}>
            <Plus size={14}/> إضافة مصدر/كتاب جديد
          </button>
        </div>
      </div>

      {subTab === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              style={{ flex: 1, padding: '8px 12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '13px' }}
              placeholder="🔍 ابحث باسم المصدر أو المحاضر..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              style={{ width: '150px', padding: '8px 12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '13px' }}
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="all">كل الأنواع</option>
              <option value="محاضرات">محاضرات</option>
              <option value="كتب">كتب</option>
              <option value="تمارين وعملي">تمارين وعملي</option>
            </select>
          </div>
          
          <div className="adm-table-wrap">
            {filteredResources.length === 0 ? (
              <div className="adm-empty">
                <Book size={48} />
                <p>لا توجد مصادر تعليمية مطابقة للبحث.</p>
              </div>
            ) : (
              <table className="adm-table">
              <thead>
                <tr>
                  <th>العنوان</th>
                  <th>نوع المصدر</th>
                  <th>المقرر الدراسي</th>
                  <th>المحاضر</th>
                  <th>القسم</th>
                  <th>الفرقة</th>
                  <th>العمليات</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map(res => (
                  <tr key={res.resource_id}>
                    <td style={{ fontWeight: 700 }}>{res.title}</td>
                    <td>
                      <span className={`badge ${res.resource_type === 'كتب' ? 'badge-accent' : 'badge-primary'}`}>
                        {res.resource_type}
                      </span>
                    </td>
                    <td>{res.course?.name || `مقرر #${res.course_id}`}</td>
                    <td>{res.instructor_name || 'هيئة التدريس'}</td>
                    <td>{departmentsData.find(d => d.id === res.department_id)?.name || 'عام'}</td>
                    <td>{yearsData.find(y => y.id === res.academic_year)?.name || `الفرقة ${res.academic_year}`}</td>
                    <td>
                      <button onClick={() => handleDelete(res.resource_id)} className="adm-action-btn adm-action-btn--danger" title="حذف">
                        <Trash2 size={15}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </div>
        </div>
      ) : (
        <form className="adm-notif-form" onSubmit={handleSubmit}>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>عنوان المصدر / اسم الكتاب</label>
              <input
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="مثال: كتاب هندسة البرمجيات المتقدمة"
              />
            </div>
            <div className="adm-form-group">
              <label>نوع المصدر الأكاديمي</label>
              <select value={form.resource_type} onChange={e => setForm({...form, resource_type: e.target.value})}>
                <option value="محاضرات">محاضرة تعليمية</option>
                <option value="كتب">كتاب دراسي (eBook)</option>
                <option value="تمارين وعملي">تمارين وعملي</option>
              </select>
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>اسم المحاضر / المؤلف</label>
              <input
                value={form.instructor_name}
                onChange={e => setForm({...form, instructor_name: e.target.value})}
                placeholder="مثال: د. محمد الشافعي"
              />
            </div>
            <div className="adm-form-group">
              <label>المقرر المرتبط</label>
              <select value={form.course_id} onChange={e => setForm({...form, course_id: parseInt(e.target.value)})}>
                {coursesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>القسم الدراسي</label>
              <select value={form.department_id} onChange={e => setForm({...form, department_id: parseInt(e.target.value)})}>
                {departmentsData.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="adm-form-group">
              <label>الفرقة الدراسية</label>
              <select value={form.academic_year} onChange={e => setForm({...form, academic_year: parseInt(e.target.value)})}>
                {yearsData.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
              </select>
            </div>
          </div>

          <div className="adm-upload-zone" style={{ border: selectedFile ? '2px dashed var(--primary)' : '1px dashed #444', position: 'relative' }}>
            <Upload size={30} style={{ color: selectedFile ? 'var(--primary)' : '#888' }} />
            <p>{selectedFile ? `الملف المحدد: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)` : 'اضغط هنا أو اسحب لإرفاق ملف الكتاب أو المحاضرة (PDF, PPTX)'}</p>
            <input 
              type="file" 
              accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.zip"
              onChange={e => setSelectedFile(e.target.files[0])}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
          </div>

          <button type="submit" className="btn btn-primary adm-send-btn" disabled={submitting}>
            {submitting ? <span className="spinner" /> : <Plus size={16}/>}
            {submitting ? 'جاري حفظ البيانات...' : 'حفظ المصدر ونشره للطلاب'}
          </button>
        </form>
      )}
    </div>
  );
};

/* ── Schedules Panel ── */
const SchedulesPanel = ({ schedules, refreshSchedules }) => {
  const [subTab, setSubTab] = useState('list'); // 'list' | 'add'
  const [form, setForm] = useState({
    course_id: 1,
    type: 'lecture', // 'lecture' | 'section'
    day: 'الأحد',
    start_time: '09:00',
    end_time: '11:00',
    year_id: 1,
    semester_id: 1,
    department_id: 2
  });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/schedule', form);
      toast.success('تم إضافة موعد الحصة إلى الجدول بنجاح ✓');
      refreshSchedules();
      setSubTab('list');
    } catch {
      toast.error('حدث خطأ أثناء إضافة الموعد');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا الموعد من الجدول الدراسي؟')) return;
    try {
      await api.delete(`/schedule/${id}`);
      toast.success('تم حذف الموعد بنجاح');
      refreshSchedules();
    } catch {
      toast.error('فشل حذف الموعد');
    }
  };

  const filteredSchedules = schedules.filter(sch => {
    const matchesSearch = sch.course?.name?.toLowerCase().includes(search.toLowerCase()) ||
                          sch.day?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'all' || sch.department_id === parseInt(deptFilter);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="adm-panel animate-fade-in">
      <div className="adm-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3><Calendar size={20}/> إدارة الجداول الدراسية</h3>
        <div className="adm-sub-tabs">
          <button className={`adm-tab-btn ${subTab === 'list' ? 'adm-tab-btn--active' : ''}`} onClick={() => setSubTab('list')}>
            <Layers size={14}/> مواعيد الجدول ({filteredSchedules.length})
          </button>
          <button className={`adm-tab-btn ${subTab === 'add' ? 'adm-tab-btn--active' : ''}`} onClick={() => setSubTab('add')}>
            <Plus size={14}/> إضافة موعد بالجدول
          </button>
        </div>
      </div>

      {subTab === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              style={{ flex: 1, padding: '8px 12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '13px' }}
              placeholder="🔍 ابحث باسم المادة أو اليوم الدراسي..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              style={{ width: '180px', padding: '8px 12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '13px' }}
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
            >
              <option value="all">كل الأقسام</option>
              {departmentsData.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          
          <div className="adm-table-wrap">
            {filteredSchedules.length === 0 ? (
              <div className="adm-empty">
                <Calendar size={48} />
                <p>لا توجد حصص أو محاضرات مطابقة للبحث.</p>
              </div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>المقرر الدراسي</th>
                    <th>النوع</th>
                    <th>اليوم</th>
                    <th>التوقيت</th>
                    <th>الترم</th>
                    <th>الفرقة</th>
                    <th>القسم</th>
                    <th>العمليات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map(sch => (
                  <tr key={sch.id}>
                    <td style={{ fontWeight: 700 }}>{sch.course?.name || `مادة #${sch.course_id}`}</td>
                    <td>
                      <span className={`badge ${sch.type === 'lecture' ? 'badge-primary' : 'badge-accent'}`}>
                        {sch.type === 'lecture' ? 'محاضرة' : 'سيكشن/عملي'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{sch.day}</td>
                    <td dir="ltr" style={{ fontWeight: 600 }}>
                      {sch.start_time?.substring(0, 5)} - {sch.end_time?.substring(0, 5)}
                    </td>
                    <td>الترم {sch.semester_id}</td>
                    <td>{yearsData.find(y => y.id === sch.year_id)?.name || `الفرقة ${sch.year_id}`}</td>
                    <td>{departmentsData.find(d => d.id === sch.department_id)?.name || 'عام'}</td>
                    <td>
                      <button onClick={() => handleDelete(sch.id)} className="adm-action-btn adm-action-btn--danger" title="حذف">
                        <Trash2 size={15}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </div>
        </div>
      ) : (
        <form className="adm-notif-form" onSubmit={handleSubmit}>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>المادة الدراسية</label>
              <select value={form.course_id} onChange={e => setForm({...form, course_id: parseInt(e.target.value)})}>
                {coursesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="adm-form-group">
              <label>النوع</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="lecture">محاضرة (Lecture)</option>
                <option value="section">سيكشن/عملي (Section)</option>
              </select>
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>اليوم الدراسي</label>
              <select value={form.day} onChange={e => setForm({...form, day: e.target.value})}>
                {['السبت', 'الأحد', 'الأثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="adm-form-group">
              <label>الترم الدراسي</label>
              <select value={form.semester_id} onChange={e => setForm({...form, semester_id: parseInt(e.target.value)})}>
                <option value={1}>الترم الأول</option>
                <option value={2}>الترم الثاني</option>
              </select>
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>وقت البدء</label>
              <input
                type="time"
                value={form.start_time}
                onChange={e => setForm({...form, start_time: e.target.value})}
              />
            </div>
            <div className="adm-form-group">
              <label>وقت الانتهاء</label>
              <input
                type="time"
                value={form.end_time}
                onChange={e => setForm({...form, end_time: e.target.value})}
              />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>القسم الدراسي المستهدف</label>
              <select value={form.department_id} onChange={e => setForm({...form, department_id: parseInt(e.target.value)})}>
                {departmentsData.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="adm-form-group">
              <label>الفرقة المستهدفة</label>
              <select value={form.year_id} onChange={e => setForm({...form, year_id: parseInt(e.target.value)})}>
                {yearsData.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary adm-send-btn" disabled={submitting}>
            {submitting ? <span className="spinner" /> : <Plus size={16}/>}
            {submitting ? 'جاري الإضافة...' : 'إضافة الموعد للجدول الدراسي'}
          </button>
        </form>
      )}
    </div>
  );
};

/* ── Students Panel ── */
const StudentsPanel = ({ refreshStats }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    student_id: '',
    name: '', email: '', password: '', national_id: '',
    phone_number: '', address: '', department: 'هندسة البرمجيات (SE)',
    academic_year: '1', seat_number: '', financial_status: 'paid'
  });
  const [isEdit, setIsEdit] = useState(false);

  const fetchStudents = () => {
    setLoading(true);
    api.get('/admin/students')
      .then(res => setStudents(res.data))
      .catch(() => toast.error('فشل جلب قائمة الطلاب'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/admin/students/${form.student_id}`, form);
        toast.success('تم تحديث بيانات الطالب بنجاح');
      } else {
        await api.post('/admin/students', form);
        toast.success('تم تسجيل الطالب بنجاح وإنشاء الحساب الجامعي');
      }
      setShowModal(false);
      fetchStudents();
      if (refreshStats) refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء حفظ البيانات');
    }
  };

  const handleEdit = (std) => {
    setForm({
      student_id: std.student_id,
      name: std.name,
      email: std.email,
      password: '',
      national_id: std.national_id,
      phone_number: std.phone_number || '',
      address: std.address || '',
      department: std.department || 'هندسة البرمجيات (SE)',
      academic_year: std.academic_year || '1',
      seat_number: std.seat_number || '',
      financial_status: std.financial_status || 'paid'
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطالب نهائياً؟')) return;
    try {
      await api.delete(`/admin/students/${id}`);
      toast.success('تم حذف الطالب وحساباته بنجاح');
      fetchStudents();
      if (refreshStats) refreshStats();
    } catch (err) {
      toast.error('فشل حذف الطالب');
    }
  };

  const openAddModal = () => {
    setForm({
      name: '', email: '', password: '', national_id: '',
      phone_number: '', address: '', department: 'هندسة البرمجيات (SE)',
      academic_year: '1', seat_number: '', financial_status: 'paid'
    });
    setIsEdit(false);
    setShowModal(true);
  };

  return (
    <div className="adm-panel">
      <div className="panel-actions">
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> إضافة طالب جديد
        </button>
      </div>

      {loading ? (
        <div className="adm-loading"><span className="spinner" /> جاري تحميل الطلاب...</div>
      ) : (
        <div className="table-responsive">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>الإيميل</th>
                <th>الباسوورد</th>
                <th>القسم</th>
                <th>السنة الدراسية</th>
                <th>GPA</th>
                <th>العمليات</th>
              </tr>
            </thead>
            <tbody>
              {students.map((std, idx) => (
                <tr key={std.student_id}>
                  <td><strong>{idx + 1}</strong></td>
                  <td style={{ fontWeight: 700 }}>{std.name}</td>
                  <td style={{ direction: 'ltr', textAlign: 'right' }}>{std.email}</td>
                  <td style={{ direction: 'ltr', textAlign: 'right', fontWeight: 600, color: '#f59e0b' }}>
                    {std.plain_password || 'Ahmed@2024'}
                  </td>
                  <td>{std.department}</td>
                  <td>
                    {std.academic_year === '1' ? 'الأولى' : 
                     std.academic_year === '2' ? 'الثانية' : 
                     std.academic_year === '3' ? 'الثالثة' : 
                     std.academic_year === '4' ? 'الرابعة' : `الفرقة ${std.academic_year}`}
                  </td>
                  <td><strong>{std.current_gpa}</strong></td>
                  <td>
                    <div className="table-btns">
                      <button className="btn-edit" onClick={() => handleEdit(std)}>تعديل</button>
                      <button className="btn-delete" onClick={() => handleDelete(std.student_id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <div className="adm-modal-header">
              <h3>{isEdit ? 'تعديل بيانات طالب' : 'تسجيل طالب جديد'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="adm-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>الاسم الكامل</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input type="email" required disabled={isEdit} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                {!isEdit && (
                  <div className="form-group">
                    <label>كلمة المرور المؤقتة</label>
                    <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                  </div>
                )}
                <div className="form-group">
                  <label>الرقم القومي (14 رقم)</label>
                  <input type="text" required disabled={isEdit} maxLength={14} value={form.national_id} onChange={e => setForm({...form, national_id: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input type="text" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>العنوان</label>
                  <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>القسم الدراسي</label>
                  <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                    <option value="هندسة البرمجيات (SE)">هندسة البرمجيات (SE)</option>
                    <option value="علوم الحاسب (CS)">علوم الحاسب (CS)</option>
                    <option value="نظم المعلومات (IS)">نظم المعلومات (IS)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>الفرقة الدراسية</label>
                  <select value={form.academic_year} onChange={e => setForm({...form, academic_year: e.target.value})}>
                    <option value="1">الفرقة الأولى</option>
                    <option value="2">الفرقة الثانية</option>
                    <option value="3">الفرقة الثالثة</option>
                    <option value="4">الفرقة الرابعة</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>رقم الجلوس</label>
                  <input type="text" value={form.seat_number} onChange={e => setForm({...form, seat_number: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>الحالة المالية</label>
                  <select value={form.financial_status} onChange={e => setForm({...form, financial_status: e.target.value})}>
                    <option value="paid">مسدد للرسوم الدراسية</option>
                    <option value="unpaid">غير مسدد (متعثر)</option>
                  </select>
                </div>
              </div>
              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary">حفظ البيانات</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Staff Panel ── */
const StaffPanel = ({ refreshStats }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: '', name: '', email: '', password: '', job_title: '',
    department: 'هندسة البرمجيات (SE)', phone_number: '', national_id: '',
    address: '', salary: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  const fetchStaff = () => {
    setLoading(true);
    api.get('/admin/staff')
      .then(res => setStaff(res.data))
      .catch(() => toast.error('فشل جلب قائمة الموظفين'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/admin/staff/${form.id}`, form);
        toast.success('تم تحديث بيانات الموظف بنجاح');
      } else {
        await api.post('/admin/staff', form);
        toast.success('تم إضافة الموظف بنجاح وإنشاء حساب الدخول');
      }
      setShowModal(false);
      fetchStaff();
      if (refreshStats) refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء حفظ البيانات');
    }
  };

  const handleEdit = (st) => {
    setForm({
      id: st.id,
      name: st.name,
      email: st.email,
      password: '',
      job_title: st.job_title || '',
      department: st.department || 'هندسة البرمجيات (SE)',
      phone_number: st.phone_number || '',
      national_id: st.national_id || '',
      address: st.address || '',
      salary: st.salary || ''
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الموظف نهائياً؟')) return;
    try {
      await api.delete(`/admin/staff/${id}`);
      toast.success('تم حذف الموظف وحساب الدخول الخاص به');
      fetchStaff();
      if (refreshStats) refreshStats();
    } catch (err) {
      toast.error('فشل حذف الموظف');
    }
  };

  const openAddModal = () => {
    setForm({
      name: '', email: '', password: '', job_title: '',
      department: 'هندسة البرمجيات (SE)', phone_number: '', national_id: '',
      address: '', salary: ''
    });
    setIsEdit(false);
    setShowModal(true);
  };

  return (
    <div className="adm-panel">
      <div className="panel-actions">
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> إضافة موظف/أستاذ جديد
        </button>
      </div>

      {loading ? (
        <div className="adm-loading"><span className="spinner" /> جاري تحميل الموظفين...</div>
      ) : (
        <div className="table-responsive">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>الإيميل</th>
                <th>الباسوورد</th>
                <th>المسمى الوظيفي</th>
                <th>القسم</th>
                <th>العمليات</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((st, idx) => (
                <tr key={st.id}>
                  <td><strong>{idx + 1}</strong></td>
                  <td style={{ fontWeight: 700 }}>{st.name}</td>
                  <td style={{ direction: 'ltr', textAlign: 'right' }}>{st.email}</td>
                  <td style={{ direction: 'ltr', textAlign: 'right', fontWeight: 600, color: '#f59e0b' }}>
                    {st.plain_password || (st.email ? (st.email.split('@')[0].charAt(0).toUpperCase() + st.email.split('@')[0].slice(1) + '@Staff') : '')}
                  </td>
                  <td>{st.job_title}</td>
                  <td>{st.department}</td>
                  <td>
                    <div className="table-btns">
                      <button className="btn-edit" onClick={() => handleEdit(st)}>تعديل</button>
                      <button className="btn-delete" onClick={() => handleDelete(st.id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <div className="adm-modal-header">
              <h3>{isEdit ? 'تعديل بيانات موظف' : 'إضافة موظف/أستاذ جديد'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="adm-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>الاسم الكامل</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input type="email" required disabled={isEdit} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                {!isEdit && (
                  <div className="form-group">
                    <label>كلمة المرور</label>
                    <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                  </div>
                )}
                <div className="form-group">
                  <label>المسمى الوظيفي</label>
                  <input type="text" required placeholder="مثال: أستاذ مساعد، رئيس قسم" value={form.job_title} onChange={e => setForm({...form, job_title: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>القسم / الإدارة</label>
                  <input type="text" required placeholder="مثال: هندسة البرمجيات (SE)" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>الرقم القومي</label>
                  <input type="text" maxLength={14} value={form.national_id} onChange={e => setForm({...form, national_id: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input type="text" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>العنوان</label>
                  <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>الراتب الشهري (ج.م)</label>
                  <input type="number" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} />
                </div>
              </div>
              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary">حفظ البيانات</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Audit Panel ── */
const AuditPanel = ({ logs }) => (
  <div className="adm-panel">
    <div className="audit-logs-list">
      {logs.length === 0 ? (
        <p className="no-logs">لا توجد سجلات نشاطات حالياً.</p>
      ) : (
        logs.map(log => (
          <div key={log.id} className="audit-log-item">
            <div className="audit-icon-wrap"><Clock size={16} /></div>
            <div className="audit-body">
              <div className="audit-meta">
                <strong>{log.action}</strong> • بواسطة {log.user} • <span className="audit-time">{log.time}</span>
              </div>
              <p className="audit-desc">{log.details}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ── Main Component ── */
export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const navigate = useNavigate();

  const loadData = () => {
    setLoadingMessages(true);
    api.get('/comments')
      .then(res => setMessages(res.data.data || []))
      .catch(() => toast.error('فشل جلب رسائل الطلاب'))
      .finally(() => setLoadingMessages(false));

    api.get('/resources')
      .then(res => setResources(res.data || []))
      .catch(() => toast.error('فشل جلب المصادر التعليمية'));

    api.get('/schedule')
      .then(res => setSchedules(res.data.data || []))
      .catch(() => toast.error('فشل جلب جدول المحاضرات'));

    api.get('/admin/system-stats')
      .then(res => setStats(res.data))
      .catch(() => {});

    api.get('/admin/audit-logs')
      .then(res => setAuditLogs(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const panels = {
    overview:      <OverviewPanel stats={stats} messagesCount={messages.length} resourcesCount={resources.length} schedulesCount={schedules.length} />,
    students:      <StudentsPanel refreshStats={loadData} />,
    staff:         <StaffPanel refreshStats={loadData} />,
    messages:      <MessagesPanel messages={messages} setMessages={setMessages} loading={loadingMessages} refreshMessages={loadData} />,
    notifications: <NotificationsPanel />,
    resources:     <ResourcesPanel resources={resources} refreshResources={loadData} />,
    schedules:     <SchedulesPanel schedules={schedules} refreshSchedules={loadData} />,
    audit:         <AuditPanel logs={auditLogs} />,
  };

  const panelTitles = {
    overview: 'لوحة الإدارة الرئيسية',
    students: 'إدارة وتوجيه الطلاب',
    staff: 'إدارة شؤون أعضاء التدريس والموظفين',
    messages: 'رسائل واستفسارات الطلاب',
    notifications: 'إرسال إعلان عام للطلاب',
    resources: 'إدارة الكتب والمصادر الدراسية',
    schedules: 'إدارة وجدولة المحاضرات',
    audit: 'سجل نشاطات النظام والعمليات',
  };

  return (
    <div className="adm-layout">
      {/* Mobile overlay — closes sidebar when tapping outside */}
      {sidebarOpen && <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />}
      {/* Sidebar */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'adm-sidebar--open' : 'adm-sidebar--collapsed'}`}>
        <div className="adm-sidebar-header">
          <Link to="/" className="adm-brand">
            <GraduationCap size={26} className="adm-brand-icon" />
            {sidebarOpen && <span>دليل — الإدارة</span>}
          </Link>
          <button className="adm-collapse-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={18}/> : <Menu size={18}/>}
          </button>
        </div>

        <div className="adm-role-badge">
          {sidebarOpen && <><Users size={14}/> مسؤول النظام / المشرف</>}
        </div>

        <nav className="adm-nav">
          {adminNav.map(item => (
            <button
              key={item.id}
              className={`adm-nav-item ${active === item.id ? 'adm-nav-item--active' : ''}`}
              onClick={() => setActive(item.id)}
              title={!sidebarOpen ? item.label : undefined}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="adm-back-btn" onClick={() => navigate('/')}>
          <LogOut size={20}/>
          {sidebarOpen && <span>خروج للرئيسية</span>}
        </button>
      </aside>

      {/* Main */}
      <main className="adm-main">
        <div className="adm-topbar">
          <button className="adm-mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
          <h1 className="adm-topbar-title">{panelTitles[active]}</h1>
          <div className="adm-topbar-badge">
            <div className="adm-topbar-dot" /> نظام الإرشاد نشط
          </div>
        </div>
        <div className="adm-content">
          {panels[active]}
        </div>
      </main>
    </div>
  );
}
