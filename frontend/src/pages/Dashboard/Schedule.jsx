import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Clock, MapPin, User, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import './Dashboard.css';

export default function Schedule() {
  const [filters, setFilters] = useState({
    year_id: '1',
    semester_id: '1',
    department_id: '1',
    type: 'lecture',
  });
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchSchedule = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get('/schedule', {
        params: {
          year_id: parseInt(filters.year_id),
          semester_id: parseInt(filters.semester_id),
          department_id: parseInt(filters.department_id),
          type: filters.type,
        },
      });
      if (res.data.status === 'success') {
        setSchedules(res.data.data || []);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      setSchedules([]);
      if (err.response?.status !== 404) {
        toast.error('حدث خطأ أثناء تحميل الجدول');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const departments = [
    { id: '1', name: 'عام' },
    { id: '2', name: 'هندسة البرمجيات' },
    { id: '3', name: 'علوم الحاسب' },
    { id: '4', name: 'نظم المعلومات' },
  ];

  const years = [
    { id: '1', name: 'الفرقة الأولى' },
    { id: '2', name: 'الفرقة الثانية' },
    { id: '3', name: 'الفرقة الثالثة' },
    { id: '4', name: 'الفرقة الرابعة' },
  ];

  const semesters = [
    { id: '1', name: 'الفصل الأول' },
    { id: '2', name: 'الفصل الثاني' },
  ];

  const types = [
    { id: 'lecture', name: 'محاضرات' },
    { id: 'section', name: 'دروس عملية (Sections)' },
    { id: 'exam', name: 'امتحانات' },
  ];

  const formatTime = (timeString) => {
    if (!timeString) return '—';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'م' : 'ص';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const daysOrder = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'السبت'];

  const groupedByDay = daysOrder.reduce((acc, day) => {
    const items = schedules.filter((s) => s.day === day);
    if (items.length > 0) {
      acc[day] = items.sort((a, b) => a.start_time.localeCompare(b.start_time));
    }
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div className="page-card">
        <div className="page-card__header">
          <h3 className="page-card__title">
            <Calendar size={20} />
            الجدول الدراسي والامتحانات
          </h3>
          <button
            onClick={fetchSchedule}
            className="btn btn-outline"
            style={{ padding: '8px 16px', fontSize: 13 }}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            تحديث
          </button>
        </div>

        {/* Filter Bar */}
        <div className="profile-grid" style={{ marginBottom: 24, gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">القسم</label>
            <select
              value={filters.department_id}
              onChange={(e) => setFilters({ ...filters, department_id: e.target.value })}
              className="form-input"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">الفرقة الدراسية</label>
            <select
              value={filters.year_id}
              onChange={(e) => setFilters({ ...filters, year_id: e.target.value })}
              className="form-input"
            >
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">الفصل الدراسي</label>
            <select
              value={filters.semester_id}
              onChange={(e) => setFilters({ ...filters, semester_id: e.target.value })}
              className="form-input"
            >
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">نوع الجدول</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="form-input"
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={fetchSchedule}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 30 }}
          disabled={loading}
        >
          <Search size={18} />
          عرض الجدول
        </button>

        {loading ? (
          <div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 100, marginBottom: 16, borderRadius: 12 }}
              />
            ))}
          </div>
        ) : Object.keys(groupedByDay).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-gray)' }}>
            <Calendar size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p>لا يوجد جدول دراسي مطابق للخيارات المحددة.</p>
          </div>
        ) : (
          <div className="schedule-list">
            {Object.entries(groupedByDay).map(([day, items]) => (
              <div
                key={day}
                className="day-section"
                style={{
                  marginBottom: 24,
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                <div
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    padding: '12px 20px',
                    fontWeight: '700',
                    fontSize: '16px',
                  }}
                >
                  {day}
                </div>
                <div style={{ padding: '8px 16px' }}>
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 0',
                        borderBottom: index < items.length - 1 ? '1px solid var(--border)' : 'none',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '15px' }}>
                          {item.course?.name || 'مادة دراسية'}
                        </span>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-gray)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} /> {item.course?.instructor_name || 'هيئة التدريس'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> {formatTime(item.start_time)} - {formatTime(item.end_time)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="badge badge-primary">
                          {item.type === 'lecture' ? 'محاضرة' : item.type === 'section' ? 'عملي' : 'امتحان'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
