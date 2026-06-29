import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">

        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <GraduationCap size={30} />
            <span>دليل</span>
          </Link>
          <p className="footer__desc">
            منصة إرشاد أكاديمي متكاملة تساعد الطلاب على تحقيق أهدافهم الدراسية بثقة ووضوح.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" aria-label="Youtube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer__col">
          <h4 className="footer__heading">روابط سريعة</h4>
          <ul className="footer__list">
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/about">عن الكلية</Link></li>
            <li><Link to="/contact">تواصل معنا</Link></li>
            <li><Link to="/login">تسجيل الدخول</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer__col">
          <h4 className="footer__heading">خدماتنا</h4>
          <ul className="footer__list">
            <li><Link to="/dashboard/grades">استعراض الدرجات</Link></li>
            <li><Link to="/dashboard/gpa">حساب المعدل</Link></li>
            <li><Link to="/dashboard/schedule">الجدول الدراسي</Link></li>
            <li><Link to="/dashboard/courses">تسجيل المواد</Link></li>
            <li><Link to="/dashboard/resources">المصادر التعليمية</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h4 className="footer__heading">تواصل معنا</h4>
          <ul className="footer__list footer__list--contact">
            <li><Mail size={15} /> academic@mtis.edu.eg</li>
            <li><Phone size={15} /> +20 66 123 4567</li>
            <li><MapPin size={15} /> كلية MTIS، بورسعيد، مصر</li>
          </ul>
        </div>

      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} دليل الإرشاد الأكاديمي — جميع الحقوق محفوظة</p>
        <p>صُمِّم بـ ❤️ لدعم الطلاب</p>
      </div>
    </footer>
  );
}
