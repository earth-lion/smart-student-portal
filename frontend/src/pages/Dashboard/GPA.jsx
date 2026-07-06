import { useState } from 'react';
import api from '../../services/api';
import { BarChart2, Plus, Trash2, TrendingUp, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './Dashboard.css';

const GRADE_POINTS = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

const emptyRow = () => ({ courseName: '', creditHours: '3', grade: 'A' });

export default function GPA() {
  const [courses, setCourses] = useState([emptyRow()]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Seed history
  const initialHistory = [
    { term: 'الفرقة ١ - ترم ١', gpa: 3.12 },
    { term: 'الفرقة ١ - ترم ٢', gpa: 3.25 },
    { term: 'الفرقة ٢ - ترم ١', gpa: 3.45 }
  ];

  const addRow = () => setCourses([...courses, emptyRow()]);
  const removeRow = (i) => setCourses(courses.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => {
    const copy = [...courses];
    copy[i] = { ...copy[i], [field]: val };
    setCourses(copy);
  };

  const calcLocal = () => {
    let totalPoints = 0, totalCredits = 0;
    courses.forEach(c => {
      const credits = parseFloat(c.creditHours) || 0;
      const points = GRADE_POINTS[c.grade] ?? 0;
      totalPoints += points * credits;
      totalCredits += credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    const valid = courses.every(c => c.creditHours && c.grade);
    if (!valid) { toast.error('أكمل بيانات جميع المواد'); return; }
    setLoading(true);
    try {
      const res = await api.post('/calculate-gpa', {
        courses: courses.map(c => ({
          course_name: c.courseName || 'مادة',
          credit_hours: parseFloat(c.creditHours),
          grade: c.grade,
        })),
      });
      setResult(res.data);
    } catch {
      const gpa = calcLocal();
      setResult({ gpa, total_credits: courses.reduce((s, c) => s + parseFloat(c.creditHours || 0), 0) });
    } finally {
      setLoading(false);
    }
  };

  const gpaColor = (gpa) => {
    const g = parseFloat(gpa);
    if (g >= 3.5) return '#059669';
    if (g >= 3.0) return '#042C76';
    if (g >= 2.0) return '#b45309';
    return '#dc2626';
  };

  // Compile history with dynamic prediction if available
  const historyData = [...initialHistory];
  if (result) {
    historyData.push({ term: 'المتوقع ترم ٢', gpa: parseFloat(result.gpa), isPredict: true });
  }

  // SVG Chart Calculations
  const chartHeight = 150;
  const chartWidth = 320;
  const paddingX = 40;
  const paddingY = 20;

  // Map GPAs (0 to 4.0) to Y coordinate (chartHeight - paddingY down to paddingY)
  const getY = (val) => {
    const minGpa = 2.0; // clamp min display to 2.0 to show differences better
    const maxGpa = 4.0;
    const ratio = (val - minGpa) / (maxGpa - minGpa);
    return chartHeight - paddingY - ratio * (chartHeight - 2 * paddingY);
  };

  // Map index to X coordinate
  const getX = (idx) => {
    const steps = historyData.length - 1;
    return paddingX + (idx / steps) * (chartWidth - 2 * paddingX);
  };

  // Build SVG Path
  let pathD = '';
  historyData.forEach((pt, i) => {
    const x = getX(i);
    const y = getY(pt.gpa);
    if (i === 0) pathD = `M ${x} ${y}`;
    else pathD += ` L ${x} ${y}`;
  });

  // Build Gradient fill path
  let areaD = '';
  if (historyData.length > 0) {
    areaD = `${pathD} L ${getX(historyData.length - 1)} ${chartHeight - paddingY} L ${getX(0)} ${chartHeight - paddingY} Z`;
  }

  return (
    <div className="animate-fade-in gpa-dashboard-grid">
      {/* Left: Calculator */}
      <div className="page-card">
        <div className="page-card__header">
          <h3 className="page-card__title"><BarChart2 size={20}/> حاسبة المعدل التراكمي GPA</h3>
        </div>

        <form onSubmit={handleCalculate}>
          <div style={{ overflowX: 'auto', marginBottom: 20 }}>
            <table className="grades-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>اسم المادة (اختياري)</th>
                  <th>الساعات المعتمدة</th>
                  <th>التقدير</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <input className="form-input" style={{ padding: '8px 12px', fontSize: 14 }}
                        placeholder="مثال: هندسة برمجيات" value={c.courseName}
                        onChange={e => updateRow(i, 'courseName', e.target.value)} />
                    </td>
                    <td>
                      <select className="form-input" style={{ padding: '8px 12px', fontSize: 14 }}
                        value={c.creditHours} onChange={e => updateRow(i, 'creditHours', e.target.value)}>
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="form-input" style={{ padding: '8px 12px', fontSize: 14 }}
                        value={c.grade} onChange={e => updateRow(i, 'grade', e.target.value)}>
                        {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </td>
                    <td>
                      {courses.length > 1 && (
                        <button type="button" onClick={() => removeRow(i)}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-outline" onClick={addRow} style={{ fontSize: 14 }}>
              <Plus size={16}/> إضافة مادة
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ fontSize: 14 }}>
              {loading ? <span className="spinner" /> : <BarChart2 size={16}/>}
              {loading ? 'جاري الحساب...' : 'احسب المعدل'}
            </button>
          </div>
        </form>

        {result && (
          <div className="gpa-result animate-fade-up" style={{ marginTop: 28 }}>
            <div className="gpa-result__circle" style={{ borderColor: gpaColor(result.gpa) }}>
              <span style={{ color: gpaColor(result.gpa) }}>{result.gpa}</span>
              <small>GPA</small>
            </div>
            <div className="gpa-result__details">
              <div className="gpa-result__item">
                <span>إجمالي الساعات</span>
                <strong>{result.total_credits}</strong>
              </div>
              <div className="gpa-result__item">
                <span>التقدير العام للفصل</span>
                <strong style={{ color: gpaColor(result.gpa) }}>
                  {parseFloat(result.gpa) >= 3.5 ? 'امتياز' :
                   parseFloat(result.gpa) >= 3.0 ? 'جيد جداً' :
                   parseFloat(result.gpa) >= 2.0 ? 'جيد' : 'مقبول'}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Trend Chart */}
      <div className="gpa-trend-card">
        <h3 className="page-card__title" style={{ marginBottom: 10 }}>
          <TrendingUp size={20} style={{ color: 'var(--accent)' }}/> منحنى تطور المعدل
        </h3>
        <p className="gpa-chart-desc">
          يوضح هذا الرسم البياني تطور مستواك الأكاديمي ترماً بترم ومعدل التنبؤ المستقبلي عند حساب الترم الحالي.
        </p>

        <div className="gpa-chart-container">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#042C76" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#042C76" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[2.0, 2.5, 3.0, 3.5, 4.0].map((val) => (
              <g key={val}>
                <line
                  x1={paddingX - 10}
                  y1={getY(val)}
                  x2={chartWidth - paddingX}
                  y2={getY(val)}
                  stroke="#e8eaf6"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text x={paddingX - 15} y={getY(val) + 4} fontSize="8" fill="#888" textAnchor="end">{val.toFixed(1)}</text>
              </g>
            ))}

            {/* Fill Area */}
            {areaD && <path d={areaD} fill="url(#chartGrad)" />}

            {/* Line Path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#042C76"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Dots */}
            {historyData.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={getX(i)}
                  cy={getY(pt.gpa)}
                  r={pt.isPredict ? "5" : "4"}
                  fill={pt.isPredict ? "#FFC107" : "#042C76"}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Tooltip Label */}
                <text
                  x={getX(i)}
                  y={getY(pt.gpa) - 10}
                  fontSize="8"
                  fontWeight="bold"
                  fill={pt.isPredict ? "#b45309" : "#042C76"}
                  textAnchor="middle"
                >
                  {pt.gpa}
                </text>
                {/* X Axis Label */}
                <text
                  x={getX(i)}
                  y={chartHeight - 4}
                  fontSize="7"
                  fill="#888"
                  textAnchor="middle"
                >
                  {pt.term}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div style={{ marginTop: 20, fontSize: 12, display: 'flex', gap: 14, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#042C76', display: 'inline-block' }} />
            <span>المعدل الفعلي</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFC107', display: 'inline-block' }} />
            <span>المعدل المتوقع (تنبؤ)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
