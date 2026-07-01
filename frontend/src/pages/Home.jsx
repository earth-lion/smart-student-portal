import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  BarChart2,
  Calendar,
  Bell,
  FileText,
  Award,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Clock,
  Users,
  Star,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

/* ── Data ────────────────────────────────────────────── */

const features = [
  {
    icon: <BarChart2 size={26} />,
    title: "إرشاد أكاديمي شخصي",
    desc: "نصائح مخصصة بناءً على مسارك الدراسي وأهدافك المستقبلية.",
    color: "#042C76",
  },
  {
    icon: <Calendar size={26} />,
    title: "تخطيط الجدول الدراسي",
    desc: "جدولك الدراسي بشكل منظم في متناول يدك في أي وقت.",
    color: "#1a4fa0",
  },
  {
    icon: <BookOpen size={26} />,
    title: "تسجيل المقررات",
    desc: "سجّل مواد الفصل الدراسي بسهولة وبخطوات بسيطة.",
    color: "#FFC107",
  },
  {
    icon: <FileText size={26} />,
    title: "استعراض الدرجات",
    desc: "تابع درجاتك وحمّل كشف نتيجتك بصيغة PDF بضغطة واحدة.",
    color: "#042C76",
  },
  {
    icon: <TrendingUp size={26} />,
    title: "حساب المعدل GPA",
    desc: "احسب معدلك التراكمي بدقة فورية وتتبع تطورك ترماً بترم.",
    color: "#1a4fa0",
  },
  {
    icon: <Bell size={26} />,
    title: "مركز الإشعارات",
    desc: "لا تفوّتك أي رسالة أو إعلان هام من إدارة الكلية.",
    color: "#FFC107",
  },
  {
    icon: <Shield size={26} />,
    title: "بيانات آمنة",
    desc: "بياناتك الأكاديمية محمية بأعلى معايير الأمان والخصوصية.",
    color: "#042C76",
  },
  {
    icon: <Zap size={26} />,
    title: "أداء فائق السرعة",
    desc: "واجهة سريعة وسلسة تعمل على جميع الأجهزة والشاشات.",
    color: "#1a4fa0",
  },
];

const events = [
  {
    img: "/ev1.png",
    date: "25",
    month: "Aug",
    year: "2025",
    title: "حفل تخرج دفعة 2025 🎓",
    desc: "احتفل بإنجازات طلابنا المتميزين في ليلة لا تُنسى",
    time: "7:00 مساءً",
    location: "كلية MTIS، بورسعيد",
    tag: "احتفالي",
  },
  {
    img: "/ev2.png",
    date: "26",
    month: "Sep",
    year: "2025",
    title: "استقبال الطلاب الجدد 👋",
    desc: "يوم الترحيب بطلابنا الجدد والتعرف على الكلية",
    time: "10:00 صباحاً",
    location: "كلية MTIS، بورسعيد",
    tag: "تعريفي",
  },
  {
    img: "/ev3.png",
    date: "3",
    month: "Oct",
    year: "2025",
    title: "معرض الابتكار التقني 💡",
    desc: "عرض مشاريع طلابية إبداعية في مجالات التكنولوجيا",
    time: "9:00 صباحاً",
    location: "قاعة المعارض، بورسعيد",
    tag: "تقني",
  },
  {
    img: "/ev4.png",
    date: "11",
    month: "Nov",
    year: "2025",
    title: "يوم سوق العمل 💼",
    desc: "ندوة عن متطلبات سوق العمل وكيفية بناء مستقبلك المهني",
    time: "2:00 مساءً",
    location: "كلية MTIS، بورسعيد",
    tag: "مهني",
  },
  {
    img: "/ev5.png",
    date: "15",
    month: "Dec",
    year: "2025",
    title: "أسبوع العلم والإبداع 📚",
    desc: "فعاليات علمية وورش عمل تثري المسيرة الأكاديمية",
    time: "8:00 صباحاً",
    location: "مكتبة الكلية، بورسعيد",
    tag: "أكاديمي",
  },
  {
    img: "/ev6.png",
    date: "20",
    month: "Jan",
    year: "2026",
    title: "البطولة الرياضية الجامعية 🏆",
    desc: "منافسات رياضية بين أقسام الكلية في أجواء احتفالية",
    time: "3:00 مساءً",
    location: "ملعب الكلية، بورسعيد",
    tag: "رياضي",
  },
  {
    img: "/ev1.png",
    date: "5",
    month: "Feb",
    year: "2026",
    title: "مهرجان الثقافات 🎨",
    desc: "احتفال بالتنوع الثقافي وعرض الفنون الإبداعية",
    time: "11:00 صباحاً",
    location: "ساحة الكلية، بورسعيد",
    tag: "ثقافي",
  },
  {
    img: "/ev2.png",
    date: "10",
    month: "Mar",
    year: "2026",
    title: "ملتقى المرشدين الأكاديميين 🧑‍🏫",
    desc: "لقاء طلابي مع أعضاء هيئة التدريس والمرشدين",
    time: "12:00 ظهراً",
    location: "قاعة الاجتماعات، MTIS",
    tag: "إرشادي",
  },
  {
    img: "/ev3.png",
    date: "22",
    month: "Mar",
    year: "2026",
    title: "هاكاثون البرمجة ⌨️",
    desc: "مسابقة تطوير البرمجيات لمدة 24 ساعة متواصلة",
    time: "6:00 صباحاً",
    location: "مختبرات الحاسوب، MTIS",
    tag: "تقني",
  },
  {
    img: "/ev4.png",
    date: "5",
    month: "Apr",
    year: "2026",
    title: "يوم الباحث العلمي 🔬",
    desc: "عرض الأبحاث الطلابية والمشاريع التخرجية",
    time: "9:00 صباحاً",
    location: "قاعة المؤتمرات الكبرى",
    tag: "بحثي",
  },
  {
    img: "/ev5.png",
    date: "18",
    month: "Apr",
    year: "2026",
    title: "دورة مهارات التواصل 🗣️",
    desc: "ورشة عمل لتطوير مهارات التحدث أمام الجمهور",
    time: "4:00 مساءً",
    location: "المسرح الجامعي، MTIS",
    tag: "تطويري",
  },
  {
    img: "/ev6.png",
    date: "1",
    month: "May",
    year: "2026",
    title: "احتفالية نهاية العام 🎉",
    desc: "تكريم المتفوقين وإعلان نتائج الجوائز الأكاديمية",
    time: "7:00 مساءً",
    location: "القاعة الرئيسية، MTIS",
    tag: "تكريمي",
  },
];

const stats = [
  { num: 1200, suffix: "+", label: "طالب مسجل", icon: <Users size={22} /> },
  { num: 50, suffix: "+", label: "مادة دراسية", icon: <BookOpen size={22} /> },
  { num: 98, suffix: "%", label: "رضا الطلاب", icon: <Star size={22} /> },
  { num: 20, suffix: "+", label: "مستشار أكاديمي", icon: <Award size={22} /> },
];

/* ── Counter Hook ─────────────────────────────────── */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / (duration / 16);
        const tick = () => {
          start += step;
          if (start < target) {
            setCount(Math.floor(start));
            requestAnimationFrame(tick);
          } else setCount(target);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ── Stat Card ───────────────────────────────────── */
function StatCard({ num, suffix, label, icon }) {
  const [count, ref] = useCounter(num);
  return (
    <div ref={ref} className="home-stat-card">
      <div className="home-stat-card__icon">{icon}</div>
      <div className="home-stat-card__num">
        {count}
        {suffix}
      </div>
      <div className="home-stat-card__label">{label}</div>
    </div>
  );
}

/* ── Event Carousel ──────────────────────────────── */
const VISIBLE = 4;
function EventCarousel() {
  const [index, setIndex] = useState(0);
  const total = events.length;
  const maxIndex = total - VISIBLE;

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
      3500,
    );
    return () => clearInterval(id);
  }, [maxIndex]);

  const prev = () => setIndex((i) => (i === 0 ? maxIndex : i - 1));
  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));

  const tagColors = {
    احتفالي: "#FFC107",
    تعريفي: "#4CAF50",
    تقني: "#2196F3",
    مهني: "#9C27B0",
    أكاديمي: "#042C76",
    رياضي: "#F44336",
    ثقافي: "#FF5722",
    إرشادي: "#00BCD4",
    بحثي: "#795548",
    تطويري: "#607D8B",
    تكريمي: "#E91E63",
  };

  return (
    <div className="carousel-wrapper">
      <button
        className="carousel-btn carousel-btn--prev"
        onClick={prev}
        aria-label="السابق"
      >
        <ChevronRight size={22} />
      </button>

      <div className="carousel-track-outer">
        <div
          className="carousel-track"
          style={{ transform: `translateX(${index * (100 / VISIBLE)}%)` }}
        >
          {events.map((ev, i) => (
            <div key={i} className="ev-card">
              <div className="ev-card__img-wrap">
                <img src={ev.img} alt={ev.title} loading="lazy" />
                <div className="ev-card__date-badge">
                  <span className="ev-card__day">{ev.date}</span>
                  <span className="ev-card__month">{ev.month}</span>
                  <span className="ev-card__year">{ev.year}</span>
                </div>
                <span
                  className="ev-card__tag"
                  style={{ background: tagColors[ev.tag] || "#042C76" }}
                >
                  {ev.tag}
                </span>
              </div>
              <div className="ev-card__body">
                <h3 className="ev-card__title">{ev.title}</h3>
                <p className="ev-card__desc">{ev.desc}</p>
                <div className="ev-card__meta">
                  <span>
                    <Clock size={13} /> {ev.time}
                  </span>
                  <span>
                    <MapPin size={13} /> {ev.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="carousel-btn carousel-btn--next"
        onClick={next}
        aria-label="التالي"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Dots */}
      <div className="carousel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === index ? "carousel-dot--active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────── */
export default function Home() {
  const { user } = useAuth();
  return (
    <div className="home">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="hero">
        {/* Animated Particle Canvas */}
        <div className="hero__particles">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                "--x": `${Math.random() * 100}%`,
                "--y": `${Math.random() * 100}%`,
                "--d": `${4 + Math.random() * 8}s`,
                "--s": `${4 + Math.random() * 8}px`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="container hero__inner">
          {/* Left — Text */}
          <div className="hero__text animate-fade-up">
            <div className="hero__badge">
              <Award size={15} />
              منصة الإرشاد الأكاديمي الأولى
            </div>
            <h1 className="hero__title">
              اختر الطريق الصحيح
              <span className="hero__title--gradient"> لمسيرتك الأكاديمية</span>
            </h1>
            <p className="hero__desc">
              منصتنا توفر لك تجربة إرشاد أكاديمي متكاملة — تخطيط الجدول، تتبع
              التقدم، تسجيل المقررات، واستعراض درجاتك، كل ذلك في مكان واحد متاح
              على مدار الساعة.
            </p>
            <div className="hero__actions">
              <Link to="/login" className="btn btn-accent hero__btn">
                تسجيل الدخول <ArrowLeft size={18} />
              </Link>
              <Link to="/get-email" className="hero__btn-ghost">
                الحصول على بريدك الجامعي
              </Link>
            </div>
          </div>

          {/* Right — Dashboard Preview Card */}
          <div className="hero__visual animate-slide-in delay-200">
            <div className="hero__mockup">
              <div className="hero__mockup-bar">
                <span />
                <span />
                <span />
                <div className="hero__mockup-url">portal.mtis.edu.eg</div>
              </div>
              {!user ? (
                <div className="hero__mockup-locked">
                  <div className="hero__mockup-lock-icon">🔒</div>
                  <h3>لوحة الطالب مغلقة</h3>
                  <p>
                    يرجى تسجيل الدخول لعرض وتحديث بياناتك الأكاديمية ومعدلك
                    الدراسي التراكمي.
                  </p>
                  <Link
                    to="/login"
                    className="btn btn-accent btn-sm hero__mockup-login-btn"
                  >
                    تسجيل الدخول <ArrowLeft size={14} />
                  </Link>
                </div>
              ) : user.role === "admin" ? (
                /* ── Admin Panel Preview Card ── */
                <div className="hero__mockup-body">
                  <div
                    className="hero__student-card"
                    style={{
                      background: "rgba(255,193,7,0.12)",
                      borderColor: "rgba(255,193,7,0.3)",
                    }}
                  >
                    <div
                      className="hero__avatar"
                      style={{
                        background: "linear-gradient(135deg,#b45309,#FFC107)",
                        color: "#000",
                      }}
                    >
                      {user.name?.charAt(0) || "م"}
                    </div>
                    <div>
                      <p className="hero__student-name">{user.name}</p>
                      <p
                        className="hero__student-dep"
                        style={{ color: "#FFC107" }}
                      >
                        🛡️ مسؤول النظام — صلاحيات إدارية كاملة
                      </p>
                    </div>
                  </div>

                  {/* Quick-access admin tiles */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      margin: "12px 0",
                    }}
                  >
                    {[
                      { icon: "📨", label: "رسائل الطلاب", to: "/admin" },
                      { icon: "🔔", label: "إرسال إشعار", to: "/admin" },
                      { icon: "📚", label: "إدارة المصادر", to: "/admin" },
                      { icon: "🗓️", label: "جدولة المحاضرات", to: "/admin" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "700",
                          textDecoration: "none",
                          transition: "all 0.2s",
                        }}
                      >
                        <span style={{ fontSize: "18px" }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <Link
                    to="/admin"
                    className="btn btn-accent"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      marginTop: "4px",
                      fontSize: "13px",
                    }}
                  >
                    الدخول للوحة التحكم الإدارية <ArrowLeft size={14} />
                  </Link>
                </div>
              ) : (
                /* ── Student Card ── */
                <div className="hero__mockup-body">
                  <div className="hero__student-card">
                    <div className="hero__avatar">
                      {user.name?.charAt(0) || "ط"}
                    </div>
                    <div>
                      <p className="hero__student-name">{user.name}</p>
                      <p className="hero__student-dep">
                        {user.department || "الكلية"} — الفرقة{" "}
                        {user.academic_year === 1
                          ? "الأولى"
                          : user.academic_year === 2
                            ? "الثانية"
                            : user.academic_year === 3
                              ? "الثالثة"
                              : "الرابعة"}
                      </p>
                    </div>
                  </div>
                  <div className="hero__kpis">
                    <div className="hero__kpi hero__kpi--blue">
                      <span className="hero__kpi-val">
                        {user.current_gpa || "—"}
                      </span>
                      <span className="hero__kpi-lbl">المعدل التراكمي</span>
                    </div>
                    <div className="hero__kpi hero__kpi--gold">
                      <span className="hero__kpi-val">
                        {user.total_credits || "—"}
                      </span>
                      <span className="hero__kpi-lbl">ساعة معتمدة</span>
                    </div>
                    <div className="hero__kpi hero__kpi--blue">
                      <span className="hero__kpi-val">6</span>
                      <span className="hero__kpi-lbl">مواد مسجلة</span>
                    </div>
                  </div>
                  <div className="hero__progress-wrap">
                    <div className="hero__progress-hd">
                      <span>التقدم نحو التخرج</span>
                      <span>
                        {Math.round(((user.total_credits || 0) / 120) * 100)}%
                      </span>
                    </div>
                    <div className="hero__progress-bar">
                      <div
                        className="hero__progress-fill"
                        style={{
                          width: `${((user.total_credits || 0) / 120) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="hero__notif-row">
                    <Bell size={14} />
                    <span>تم قبول تسجيل مواد الترم بنجاح ✓</span>
                  </div>
                  <div className="hero__notif-row hero__notif-row--gold">
                    <TrendingUp size={14} />
                    <span>معدلك الدراسي مستقر ومنتظم 🎉</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS COUNTER ===== */}
      <section className="home-stats-section">
        <div className="container home-stats-grid">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <p className="section-sup">ماذا نقدم لك؟</p>
            <h2 className="section-title">خدماتنا الأكاديمية</h2>
            <div className="section-line" />
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card animate-fade-up"
                style={{ "--delay": `${i * 60}ms` }}
              >
                <div
                  className="feature-card__icon"
                  style={{ "--clr": f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
                <div className="feature-card__arrow">
                  <ArrowLeft size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EVENTS CAROUSEL ===== */}
      <section className="events-section">
        <div className="container">
          <div className="section-header">
            <p className="section-sup">على الهواء دائماً</p>
            <h2 className="section-title">فعاليات الكلية</h2>
            <div className="section-line" />
          </div>
          <EventCarousel />
        </div>
      </section>

      {/* ===== ABOUT / WHO ===== */}
      <section className="about-section">
        <div className="container about-inner">
          <div className="about-visual">
            <div className="about-img-grid">
              <img
                src={`${import.meta.env.BASE_URL}ev5.png`}
                alt="library"
                className="about-img about-img--tall"
              />
              <div className="about-img-col">
                <img
                  src={`${import.meta.env.BASE_URL}ev3.png`}
                  alt="tech"
                  className="about-img"
                />
                <img
                  src={`${import.meta.env.BASE_URL}ev4.png`}
                  alt="career"
                  className="about-img"
                />
              </div>
            </div>
            <div className="about-badge-float">
              <Award size={20} />
              <span>أفضل منصة أكاديمية 2025</span>
            </div>
          </div>

          <div className="about-text animate-fade-up">
            <p className="section-sup">من نحن؟</p>
            <h2 className="section-title">رحلتك الأكاديمية تبدأ هنا</h2>
            <div className="section-line" style={{ marginBottom: 24 }} />
            <p className="about-desc">
              نحن منصة إرشاد أكاديمي متكاملة تهدف إلى مساعدة طلاب كلية MTIS في
              اتخاذ قراراتهم الدراسية بثقة ووضوح. نوفر أدوات ذكية لتسجيل
              المقررات، حساب المعدل التراكمي، تخطيط الجداول الدراسية، والحصول
              على نصائح أكاديمية شخصية مخصصة.
            </p>
            <div className="about-pillars">
              <div className="about-pillar">
                <div className="about-pillar__icon">🔭</div>
                <div>
                  <h4>رؤيتنا</h4>
                  <p>
                    تمكين الطلاب من تحقيق نجاح أكاديمي مستدام من خلال الإرشاد
                    الذكي والتخطيط السليم.
                  </p>
                </div>
              </div>
              <div className="about-pillar">
                <div className="about-pillar__icon">🎯</div>
                <div>
                  <h4>مهمتنا</h4>
                  <p>
                    تقديم حلول مبتكرة لدعم الطلاب أكاديمياً وإرشادهم نحو أفضل
                    المسارات الدراسية والمهنية.
                  </p>
                </div>
              </div>
              <div className="about-pillar">
                <div className="about-pillar__icon">💡</div>
                <div>
                  <h4>قيمنا</h4>
                  <p>
                    الشفافية، الجودة، والاستدامة في تقديم الخدمات الأكاديمية لكل
                    طالب بشكل متساوٍ.
                  </p>
                </div>
              </div>
              <div className="about-pillar">
                <div className="about-pillar__icon">🤝</div>
                <div>
                  <h4>شراكتنا</h4>
                  <p>
                    نعمل جنباً إلى جنب مع هيئة التدريس لضمان أفضل تجربة أكاديمية
                    لكل طالب.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner__glow" />
            <div className="cta-banner__text">
              <h2>مستعد تبدأ رحلتك الأكاديمية؟</h2>
              <p>
                انضم لأكثر من ١٢٠٠ طالب يستخدمون دليل لتحقيق أهدافهم الدراسية.
              </p>
            </div>
            <div className="cta-banner__actions">
              <Link to="/login" className="btn btn-accent">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
