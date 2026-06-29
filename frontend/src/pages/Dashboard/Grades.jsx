import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FileText, Download, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const gradeColor = (grade) => {
  if (!grade) return 'var(--text-gray)';
  if (grade >= 85) return '#059669';
  if (grade >= 70) return '#0a3d9e';
  if (grade >= 60) return '#b45309';
  return '#dc2626';
};

const gradeLetter = (grade) => {
  if (!grade) return '—';
  if (grade >= 90) return 'A+';
  if (grade >= 85) return 'A';
  if (grade >= 80) return 'B+';
  if (grade >= 75) return 'B';
  if (grade >= 70) return 'C+';
  if (grade >= 65) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
};

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get('/student/grades')
      .then(r => setGrades(r.data.grades || r.data || []))
      .catch(() => setError('فشل تحميل الدرجات'))
      .finally(() => setLoading(false));
  }, []);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await api.get('/grades/pdf', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'كشف_الدرجات.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('فشل تحميل الـ PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="page-card">
      {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 50, marginBottom: 10, borderRadius: 8 }} />)}
    </div>
  );

  if (error) return <div style={{ textAlign:'center', padding: 60, color: '#ef4444' }}>{error}</div>;

  const avg = grades.length
    ? (grades.reduce((s, g) => s + (g.grade || 0), 0) / grades.length).toFixed(1)
    : '—';

  return (
    <div className="animate-fade-in">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue"><FileText size={22}/></div>
          <div><div className="stat-card__val">{grades.length}</div><div className="stat-card__lbl">عدد المواد</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green"><TrendingUp size={22}/></div>
          <div><div className="stat-card__val">{avg}</div><div className="stat-card__lbl">متوسط الدرجات</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--yellow"><TrendingUp size={22}/></div>
          <div>
            <div className="stat-card__val">{grades.filter(g => (g.grade || 0) >= 60).length}</div>
            <div className="stat-card__lbl">مواد ناجح</div>
          </div>
        </div>
      </div>

      <div className="page-card">
        <div className="page-card__header">
          <h3 className="page-card__title"><FileText size={20}/> كشف الدرجات</h3>
          <button className="btn btn-primary" style={{ fontSize: 14, padding: '9px 18px' }}
            onClick={downloadPdf} disabled={downloading}>
            <Download size={16} />
            {downloading ? 'جاري التحميل...' : 'تحميل PDF'}
          </button>
        </div>

        {grades.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-gray)', padding: 40 }}>لا توجد درجات مسجلة</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="grades-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>المادة</th>
                  <th>الكود</th>
                  <th>الساعات</th>
                  <th>الدرجة</th>
                  <th>التقدير</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 700 }}>{g.course_name || g.course?.name || '—'}</td>
                    <td><span className="badge badge-primary">{g.course_code || g.course?.code || '—'}</span></td>
                    <td>{g.credit_hours || g.course?.credit_hours || '—'}</td>
                    <td style={{ fontWeight: 800, fontSize: 18, color: gradeColor(g.grade) }}>{g.grade ?? '—'}</td>
                    <td style={{ fontWeight: 700, color: gradeColor(g.grade) }}>{gradeLetter(g.grade)}</td>
                    <td>
                      <span className={`badge ${(g.grade || 0) >= 60 ? 'badge-success' : 'badge-danger'}`}>
                        {(g.grade || 0) >= 60 ? 'ناجح' : 'راسب'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
