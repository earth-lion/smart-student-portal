import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Award, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    email: '',
    national_id: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.national_id || !formData.content) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (formData.national_id.length !== 14 || isNaN(formData.national_id)) {
      toast.error('يجب أن يتكون الرقم القومي من 14 رقماً');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/comments', {
        email: formData.email,
        national_id: formData.national_id,
        content: formData.content
      });
      toast.success(response.data.message || 'تم إرسال رسالتك بنجاح');
      setFormData({ email: '', national_id: '', content: '' });
    } catch (error) {
      const msg = error.response?.data?.message || 'فشل إرسال الرسالة، يرجى التحقق من البيانات';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* Header section with gradient and glow */}
      <section className="contact-header">
        <div className="contact-header__glow" />
        <div className="container contact-header__inner">
          <div className="contact-badge">
            <Award size={15} />
            الدعم الفني والإرشاد
          </div>
          <h1>تواصل معنا</h1>
          <p>
            نحن هنا للإجابة على استفساراتك ومساعدتك في مسيرتك الأكاديمية. لا تتردد في مراسلتنا في أي وقت.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-content">
        <div className="container contact-grid">
          {/* Info cards (Right side / first in RTL) */}
          <div className="contact-info">
            <h2 className="contact-info__title">معلومات الاتصال</h2>
            <p className="contact-info__desc">
              يمكنك التواصل مباشرة مع إدارة شؤون الطلاب أو المرشد الأكاديمي عبر القنوات التالية:
            </p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-card__icon"><Phone size={22} /></div>
                <div>
                  <h4>الهاتف المباشر</h4>
                  <p dir="ltr" className="text-right">+20 66 342 9876</p>
                  <p dir="ltr" className="text-right">+20 10 9988 7766</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card__icon"><Mail size={22} /></div>
                <div>
                  <h4>البريد الإلكتروني</h4>
                  <p>support@mtis.edu.eg</p>
                  <p>info@mtis.edu.eg</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card__icon"><MapPin size={22} /></div>
                <div>
                  <h4>الموقع الجغرافي</h4>
                  <p>جمهورية مصر العربية، محافظة بورسعيد، حي الشرق، شارع صلاح سالم</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card__icon"><Clock size={22} /></div>
                <div>
                  <h4>ساعات العمل الرسمية</h4>
                  <p>من الأحد إلى الخميس: 9:00 صباحاً - 3:00 مساءً</p>
                  <p>الجمعة والسبت: عطلة رسمية</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Left side) */}
          <div className="contact-form-card">
            <div className="form-header">
              <MessageSquare size={24} className="form-header__icon" />
              <div>
                <h3>أرسل استفسارك</h3>
                <p>يرجى إدخال بياناتك المسجلة لنتمكن من مطابقتها والرد عليك</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="form-body">
              <div className="form-group">
                <label htmlFor="email">البريد الإلكتروني الجامعي</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@mtis.edu.eg"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="national_id">الرقم القومي (14 رقماً)</label>
                <input
                  type="text"
                  id="national_id"
                  name="national_id"
                  maxLength={14}
                  value={formData.national_id}
                  onChange={handleChange}
                  placeholder="2990101XXXXXXXX"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">تفاصيل الرسالة أو الاستفسار</label>
                <textarea
                  id="content"
                  name="content"
                  rows={5}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="اكتب هنا استفسارك بالتفصيل..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                {loading ? (
                  <span>جاري الإرسال...</span>
                ) : (
                  <>
                    <span>إرسال الرسالة</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Embed Section */}
      <section className="map-section">
        <div className="container">
          <div className="map-wrapper">
            <iframe
              title="موقع الكلية"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.015291772421!2d32.304561!3d31.261892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDE1JzQyLjgiTiAzMsKwMTgnMTYuNCJF!5e0!3m2!1sar!2seg!4v1624789547182!5m2!1sar!2seg"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
