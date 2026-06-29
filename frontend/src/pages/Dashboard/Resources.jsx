import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { BookOpen, FolderOpen, Download, Search, RefreshCw, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import './Dashboard.css';

export default function Resources() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    department_id: '1',
    academic_year: '1',
  });
  const [resources, setResources] = useState([]);
  const [expandedResource, setExpandedResource] = useState(null); // stores resource_id if expanded
  const [files, setFiles] = useState({}); // stores { resource_id: [files] }
  const [loading, setLoading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    setSearched(true);
    setExpandedResource(null);
    try {
      const res = await api.get('/resources', {
        params: {
          department_id: parseInt(filters.department_id),
          academic_year: parseInt(filters.academic_year),
        },
      });
      setResources(res.data || []);
    } catch {
      toast.error('حدث خطأ أثناء تحميل المصادر الدراسية');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleToggleExpand = async (resourceId) => {
    if (expandedResource === resourceId) {
      setExpandedResource(null);
      return;
    }

    setExpandedResource(resourceId);

    // If files are already loaded, don't fetch again
    if (files[resourceId]) return;

    setLoadingFiles(true);
    try {
      const res = await api.get(`/resources/${resourceId}/files`);
      setFiles({
        ...files,
        [resourceId]: res.data.files || [],
      });
    } catch {
      toast.error('فشل تحميل ملفات المادة الدراسية');
    } finally {
      setLoadingFiles(false);
    }
  };

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

  return (
    <div className="animate-fade-in">
      <div className="page-card">
        <div className="page-card__header">
          <h3 className="page-card__title">
            <BookOpen size={20} />
            المصادر التعليمية والمحاضرات
          </h3>
          <button
            onClick={fetchResources}
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
              value={filters.academic_year}
              onChange={(e) => setFilters({ ...filters, academic_year: e.target.value })}
              className="form-input"
            >
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={fetchResources}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 30 }}
          disabled={loading}
        >
          <Search size={18} />
          البحث عن مصادر
        </button>

        {loading ? (
          <div>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 80, marginBottom: 14, borderRadius: 12 }}
              />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-gray)' }}>
            <FolderOpen size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p>لا توجد مصادر تعليمية مرفوعة لهذه الفرقة والقسم حالياً.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {resources.map((res) => {
              const isExpanded = expandedResource === res.resource_id;
              const resourceFiles = files[res.resource_id] || [];

              return (
                <div
                  key={res.resource_id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#fff',
                  }}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => handleToggleExpand(res.resource_id)}
                    style={{
                      padding: '18px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: isExpanded ? 'rgba(4, 44, 118, 0.02)' : '#fff',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '16px' }}>
                        {res.resource_name}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--text-gray)' }}>
                        المادة: {res.course?.name || 'مقرر دراسي'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge badge-primary">
                        {res.resource_type || 'محاضرات'}
                      </span>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Expanded Files */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '16px 20px',
                        background: '#fafbfe',
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      {loadingFiles && !files[res.resource_id] ? (
                        <div className="skeleton" style={{ height: 50, borderRadius: 8 }} />
                      ) : resourceFiles.length === 0 ? (
                        <p style={{ fontSize: '14px', color: 'var(--text-gray)', textAlign: 'center', padding: '10px 0' }}>
                          لا توجد ملفات مرفوعة لهذه المادة الدراسية بعد.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {resourceFiles.map((file) => (
                            <div
                              key={file.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 14px',
                                background: '#fff',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText size={18} color="var(--primary)" />
                                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                  {file.file_name}
                                </span>
                                <span className="badge badge-accent" style={{ fontSize: '10px' }}>
                                  {file.file_type?.toUpperCase()}
                                </span>
                              </div>
                              <a
                                href={`http://localhost:8000${file.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  borderRadius: '6px',
                                }}
                              >
                                <Download size={14} />
                                تحميل
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
