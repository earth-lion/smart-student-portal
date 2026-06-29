import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Award, Compass, Users, Target, BookOpen, X, ChevronLeft, GraduationCap } from 'lucide-react';
import './Home.css';
import './About.css';

const deptsData = [
  {
    id: 1,
    name: 'قسم إدارة نظم تكنولوجيا المعلومات',
    shortDesc: 'قسم إدارة نظم تكنولوجيا المعلومات يدمج بين التقنية والإدارة بهدف تحسين أداء المؤسسات باستخدام نظم المعلومات. يدرس ...',
    fullDesc: 'قسم إدارة نظم تكنولوجيا المعلومات يدمج بين التقنية والإدارة بهدف تحسين أداء المؤسسات باستخدام نظم المعلومات. يدرس الطلاب كيفية تصميم وإدارة قواعد البيانات، وتحليل النظم البرمجية، وتخطيط البنية التحتية لتكنولوجيا المعلومات والشبكات، وتطبيق استراتيجيات الحوسبة الحديثة لدعم اتخاذ القرارات في المؤسسات العامة والخاصة.',
    icon: '💻',
    badges: ['قواعد البيانات', 'أمن الشبكات', 'نظم القرار']
  },
  {
    id: 2,
    name: 'قسم نظم معلومات الأعمال',
    shortDesc: 'قسم نظم معلومات الأعمال هو تخصص يجمع بين تقنيات المعلومات ومجال إدارة الأعمال، ويهدف إلى توظيف التكنولوجيا لتحسين ...',
    fullDesc: 'قسم نظم معلومات الأعمال هو تخصص يجمع بين تقنيات المعلومات ومجال إدارة الأعمال، ويهدف إلى توظيف التكنولوجيا لتحسين وتطوير العمليات الإدارية واتخاذ القرارات الاستراتيجية. يتعلم الطلاب في هذا القسم كيفية تصميم الأنظمة وحلول ذكاء الأعمال (Business Intelligence)، وإدارة المشاريع الرقمية، وتحليل بيانات السوق التجارية.',
    icon: '📊',
    badges: ['ذكاء الأعمال', 'التجارة الإلكترونية', 'تحليل البيانات']
  },
  {
    id: 3,
    name: 'قسم تكنولوجيا المحاسبة',
    shortDesc: 'قسم تكنولوجيا المحاسبة يجمع بين المعرفة المحاسبية والتقنيات الرقمية الحديثة، ويهدف إلى إعداد كوادر قادرة على استخدم ...',
    fullDesc: 'قسم تكنولوجيا المحاسبة يجمع بين المعرفة المحاسبية والتقنيات الرقمية الحديثة، ويهدف إلى إعداد كوادر قادرة على استخدام البرمجيات المحاسبية المتقدمة والأنظمة السحابية في إعداد التقارير المالية والتدقيق الإلكتروني والتحصيل الضريبي، بما يتناسب مع احتياجات التحول الرقمي في قطاع المال والأعمال.',
    icon: '📈',
    badges: ['المحاسبة الرقمية', 'التدقيق الإلكتروني', 'النظم الضريبية']
  },
  {
    id: 4,
    name: 'قسم تكنولوجيا الإدارة والأعمال',
    shortDesc: 'قسم نظم المعلومات الإدارية في تكنولوجيا الإدارة والأعمال يركز على دمج تقنيات الحوسبة مع مفاهيم الإدارة لتحسين الأد ...',
    fullDesc: 'قسم تكنولوجيا الإدارة والأعمال يركز على دمج تقنيات الحوسبة مع مفاهيم الإدارة التقليدية لتحسين الأداء التنظيمي، وتصميم الهياكل الرقمية للمؤسسات. يدرس الطلاب إدارة الموارد البشرية والمالية إلكترونياً، ونظم إدارة الجودة الشاملة، والتخطيط الاستراتيجي الرقمي لتحقيق التميز والريادة التنافسية.',
    icon: '🏢',
    badges: ['إدارة الموارد ERP', 'الجودة الشاملة', 'التخطيط الرقمي']
  }
];

export default function About() {
  const [selectedDept, setSelectedDept] = useState(null);

  return (
    <div className="about-page-view" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero Header */}
      <section className="hero" style={{ padding: '80px 0 50px', minHeight: 'auto' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="hero__badge" style={{ margin: '0 auto 20px' }}>
            <Award size={16} />
            تعرف علينا وعلى كليتنا
          </div>
          <h1 className="hero__title" style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '20px' }}>
            عن منصة <span className="hero__title--accent">دليل الأكاديمية</span>
          </h1>
          <p className="hero__desc" style={{ maxWidth: '800px', margin: '0 auto' }}>
            المنصة الإلكترونية الأولى لتسهيل الحياة الأكاديمية والإرشاد الطلابي داخل الكلية، بهدف إيجاد قنوات تواصل فعالة ومؤتمتة بين الطالب، المرشد الأكاديمي، وإدارة الكلية.
          </p>
        </div>
      </section>

      {/* Campus Hero Image Section */}
      <section className="about-hero-image-section">
        <div className="container">
          <div className="about-hero-image-card">
            <img src="/about_hero.png" alt="مبنى الكلية" className="about-hero-img" />
            <div className="about-hero-overlay">
              <h3>صرح أكاديمي متميز ومجهز بأحدث الوسائل التعليمية</h3>
              <p>نلتزم بتقديم بيئة تعليمية رائدة تدعم الابتكار والريادة للطلاب.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="depts-section">
        <div className="container">
          <div className="depts-header">
            <h2 className="depts-title">الأقسام العلمية والأكاديمية</h2>
          </div>
          
          <div className="depts-grid">
            {deptsData.map(dept => (
              <div key={dept.id} className="dept-card">
                <div>
                  <div className="dept-card__header">
                    <div className="dept-card__icon">{dept.icon}</div>
                    <div className="dept-card__title-wrap">
                      <h3 className="dept-card__title">{dept.name}</h3>
                      <div className="dept-card__accent-line" />
                    </div>
                  </div>
                  <p className="dept-card__desc">
                    • {dept.shortDesc}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedDept(dept)} 
                  className="dept-card__btn"
                >
                  قراءة المزيد
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="features-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <p className="section-title text-center">رؤيتنا وقيمنا الأكاديمية</p>
          <div className="underline-accent" style={{ margin: '8px auto 40px' }} />
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon"><Target size={28} /></div>
              <h3 className="feature-card__title">رؤية واضحة</h3>
              <p className="feature-card__desc">
                أن نكون النموذج الرائد في تقديم الخدمات الطلابية والإرشاد الأكاديمي الرقمي على مستوى الجامعات المصرية.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card__icon"><Compass size={28} /></div>
              <h3 className="feature-card__title">إرشاد موجه</h3>
              <p className="feature-card__desc">
                توجيه الطالب خطوة بخطوة في اختيار التخصص والمقررات بما يتناسب مع قدراته واهتماماته وخطة تخرجه.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card__icon"><Users size={28} /></div>
              <h3 className="feature-card__title">بيئة تشاركية</h3>
              <p className="feature-card__desc">
                تعزيز التواصل البناء والمستمر بين الطلاب وأعضاء هيئة التدريس لتبادل الخبرات وحل المشكلات الأكاديمية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Popup for Details */}
      {selectedDept && (
        <div className="dept-modal-overlay" onClick={() => setSelectedDept(null)}>
          <div className="dept-modal" onClick={e => e.stopPropagation()}>
            <div className="dept-modal__header">
              <div className="dept-modal__title-wrap">
                <span className="dept-modal__icon">{selectedDept.icon}</span>
                <h3 className="dept-modal__title">{selectedDept.name}</h3>
              </div>
              <button className="dept-modal__close" onClick={() => setSelectedDept(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="dept-modal__body">
              <p className="dept-modal__desc">{selectedDept.fullDesc}</p>
              
              <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '12px', fontSize: '14px' }}>
                مجالات التركيز الأكاديمي بالقسم:
              </div>
              <div className="dept-modal__badge-grid">
                {selectedDept.badges.map((b, index) => (
                  <div key={index} className="dept-modal__badge">{b}</div>
                ))}
              </div>
            </div>
            
            <div className="dept-modal__footer">
              <button className="btn btn-primary" onClick={() => setSelectedDept(null)}>
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
