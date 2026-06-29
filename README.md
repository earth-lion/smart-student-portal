# 🎓 Smart Student Portal — دليل

<div dir="rtl">

منصة إرشاد أكاديمي متكاملة لإدارة الطلاب والموظفين والأكاديميين، مبنية بـ **React + Laravel**.

## 🌐 روابط المشروع

| الوصف | الرابط |
|---|---|
| 🖥️ واجهة المستخدم (Frontend Live) | [رابط GitHub Pages] |
| 📦 كود المشروع الكامل | [رابط الـ Repo] |

---

## 🛠️ التقنيات المستخدمة

**Frontend:**
- React 18 + Vite
- React Router DOM
- Recharts (للرسوم البيانية)
- Lucide React (الأيقونات)
- CSS Vanilla مخصص

**Backend:**
- Laravel 11 (PHP)
- MySQL
- Laravel Sanctum (Authentication)
- Gemini AI API (Chatbot)

---

## 🚀 تشغيل المشروع محلياً

### الـ Frontend
```bash
cd frontend
npm install
npm run dev
```

### الـ Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

---

## 📋 صفحات المشروع

| الصفحة | الوصف |
|---|---|
| `/` | الصفحة الرئيسية |
| `/about` | عن الكلية |
| `/contact` | تواصل معنا |
| `/login` | تسجيل الدخول |
| `/get-email` | استرداد بيانات الدخول |
| `/dashboard` | لوحة تحكم الطالب |
| `/admin` | لوحة تحكم الأدمن |
| `/staff` | لوحة تحكم الموظف |

---

## 👥 الأدوار (Roles)

- **Admin** — إدارة كاملة للنظام
- **Staff** — رصد الدرجات وإدارة المقررات  
- **Student** — عرض الدرجات والجدول والتسجيل

</div>
