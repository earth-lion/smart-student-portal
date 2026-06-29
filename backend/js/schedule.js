

 const toggle = document.querySelector(".toggle");
  const sidebar = document.querySelector(".sidebar");

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
  sidebar.addEventListener("click", () => {
    sidebar.classList.remove("active");
  })
document.getElementById("filterBtn").addEventListener("click", async () => {
  const type = document.getElementById("content").value;
  const year_id = document.getElementById("year").value;
  const department_id = document.getElementById("department").value;
  const semester_id = 1; 

  if (!type || !year_id || !department_id) {
    alert("يرجى اختيار نوع الجدول والفرقة والقسم أولاً.");
    return;
  }

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/schedule`, {
      params: {
        year_id,
        semester_id,
        department_id,
        type
      }
    });

    const data = response.data.data;

    clearTables();
    renderSchedule(data, type);

  } catch (error) {
    alert(error.response?.data?.message || "حدث خطأ أثناء جلب البيانات");
  }
});

// تنظيف محتوى خلايا الجدول بدون حذف رؤوس الأيام
function clearTables() {
  document.querySelectorAll("table tbody td").forEach(td => {
    if (!td.classList.contains("day-column")) {
      td.innerHTML = "";
    }
  });
}

// تحويل أيام الأسبوع من العربية للإنجليزية
function arabicDayToEnglish(day) {
  if (!day) return "";

  const normalizedDay = day.trim().toLowerCase().normalize("NFD").replace(/[\u064B-\u065F]/g, "");

  const daysMap = {
    "الاحد": "sunday",
    "الأحد": "sunday",
    "الاثنين": "monday",
    "الأثنين": "monday",
    "الثلاثاء": "tuesday",
    "الأربعاء": "wednesday",
    "الاربعاء": "wednesday",
    "الخميس": "thursday"
  };

  return daysMap[normalizedDay] || "";
}

// تحويل وقت البداية إلى رقم الحصة
function getSlotNumber(startTime) {
  switch (startTime) {
    case "09:00:00": return 1;
    case "11:00:00": return 2;
    case "13:00:00": return 3;
    case "15:00:00": return 4;
    default:
      console.warn(`🕑 وقت غير معروف: ${startTime}`);
      return 0;
  }
}

// عرض الجدول حسب نوعه وتعبئة البيانات
function renderSchedule(data, type) {
  document.getElementById("table1").style.display = (type === "lecture") ? "table" : "none";
  document.getElementById("table2").style.display = (type === "section") ? "table" : "none";
  document.getElementById("table3").style.display = (type === "exam") ? "table" : "none";

  data.forEach(item => {
    const dayEng = arabicDayToEnglish(item.day);
    const slot = getSlotNumber(item.start_time);

    if (!dayEng || slot === 0) {
      console.warn(`⛔ تجاهل بيانات غير صالحة: ${item.day} - ${item.start_time}`);
      return;
    }

    const cellId = `${dayEng}${slot}`;
    const cell = document.querySelector(`#table${type === "lecture" ? 1 : type === "section" ? 2 : 3} #${cellId}`);

    if (cell) {
      const courseName = item.course?.name || "مادة غير معروفة";
      const instructor = item.instructor || "مدرس غير معروف";
      cell.innerHTML += `<div><strong>${courseName}</strong><br>${instructor}</div>`;
    }
  });
}

