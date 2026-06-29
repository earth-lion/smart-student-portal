import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Bell, Star, Archive, Trash2, Check, Inbox, RefreshCw, MailOpen, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import './Dashboard.css';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox', 'favorites', 'archived'

  const fetchNotifications = async () => {
    if (!user?.student_id) return;
    setLoading(true);
    try {
      let endpoint = '/notifications';
      if (activeTab === 'favorites') {
        endpoint = '/notifications/favorite';
      } else if (activeTab === 'archived') {
        endpoint = '/notifications/archived';
      }

      const res = await api.get(endpoint, {
        params: { student_id: user.student_id }
      });
      setNotifications(res.data || []);
    } catch (err) {
      toast.error('فشل تحميل الإشعارات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, activeTab]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      toast.success('تم تحديد الإشعار كمقروء');
    } catch {
      toast.error('حدث خطأ أثناء تحديث الإشعار');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await api.post(`/notifications/${id}/favorite`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_favorite: !n.is_favorite } : n));
      toast.success('تم تحديث المفضلة');
      if (activeTab === 'favorites') {
        fetchNotifications();
      }
    } catch {
      toast.error('فشل تعديل المفضلة');
    }
  };

  const handleArchive = async (id) => {
    try {
      await api.put(`/notifications/${id}/archived`);
      toast.success('تم أرشفة الإشعار بنجاح');
      fetchNotifications();
    } catch {
      toast.error('فشل أرشفة الإشعار');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('هل أنت متأكد من رغبتك في حذف هذا الإشعار نهائياً؟');
    if (!confirm) return;

    try {
      await api.delete(`/notifications/${id}`);
      toast.success('تم حذف الإشعار نهائياً');
      fetchNotifications();
    } catch {
      toast.error('فشل حذف الإشعار');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-card">
        <div className="page-card__header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
          <h3 className="page-card__title">
            <Bell size={20} />
            مركز الإشعارات والتنبيهات
          </h3>
          <button
            onClick={fetchNotifications}
            className="btn btn-outline"
            style={{ padding: '8px 16px', fontSize: 13 }}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            تحديث
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`btn ${activeTab === 'inbox' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 18px', fontSize: '14px', borderRadius: '10px' }}
          >
            <Inbox size={16} />
            الواردة
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`btn ${activeTab === 'favorites' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 18px', fontSize: '14px', borderRadius: '10px' }}
          >
            <Star size={16} />
            المفضلة
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`btn ${activeTab === 'archived' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 18px', fontSize: '14px', borderRadius: '10px' }}
          >
            <Archive size={16} />
            المؤرشفة
          </button>
        </div>

        {loading ? (
          <div>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 100, marginBottom: 14, borderRadius: 12 }} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-gray)' }}>
            <Bell size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p>لا توجد إشعارات حالياً في هذا القسم.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  background: n.is_read ? '#fff' : 'rgba(4, 44, 118, 0.03)',
                  border: '1px solid var(--border)',
                  borderRight: n.is_read ? '1px solid var(--border)' : '4px solid var(--primary)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px',
                  transition: 'all 0.2s',
                  boxShadow: n.is_read ? 'none' : '0 4px 12px rgba(4, 44, 118, 0.05)',
                }}
              >
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      className={`badge ${n.category === 'general' ? 'badge-primary' : 'badge-accent'}`}
                      style={{ fontSize: '11px' }}
                    >
                      {n.category === 'general' ? 'عام' : 'شخصي'}
                    </span>
                    {!n.is_read && (
                      <span className="badge badge-danger" style={{ fontSize: '10px', padding: '2px 6px' }}>
                        جديد
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                    {n.title}
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: '12px' }}>
                    {n.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-gray)' }}>
                    <Calendar size={13} />
                    <span>{formatDate(n.created_at || n.updated_at)}</span>
                  </div>
                </div>

                {/* Operations */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="btn"
                      style={{ padding: '8px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', borderRadius: '8px' }}
                      title="تحديد كمقروء"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleFavorite(n.id)}
                    className="btn"
                    style={{
                      padding: '8px',
                      background: n.is_favorite ? 'rgba(255, 193, 7, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                      color: n.is_favorite ? '#b45309' : 'var(--text-gray)',
                      borderRadius: '8px',
                    }}
                    title={n.is_favorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                  >
                    <Star size={16} fill={n.is_favorite ? '#b45309' : 'none'} />
                  </button>
                  {activeTab !== 'archived' && (
                    <button
                      onClick={() => handleArchive(n.id)}
                      className="btn"
                      style={{ padding: '8px', background: 'rgba(4, 44, 118, 0.08)', color: 'var(--primary)', borderRadius: '8px' }}
                      title="أرشفة"
                    >
                      <Archive size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="btn"
                    style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderRadius: '8px' }}
                    title="حذف نهائياً"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
