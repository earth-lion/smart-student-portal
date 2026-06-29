const toggle = document.querySelector(".toggle");
      const sidebar = document.querySelector(".sidebar");
      toggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
      });
      sidebar.addEventListener("click", () => {
        sidebar.classList.remove("active");
      });
   
  const subjectTable = document.getElementById("subjectTable");
  const buttons = document.querySelectorAll(".btn button");
  const sectionSelect = document.getElementById("sectionSelect");

  let selectedGrade = "الفرقة الاولى";
  let selectedSection = "";

  // جلب البيانات من localStorage
  const registeredCourses = JSON.parse(localStorage.getItem("registered_courses") || "[]");
      console.log(registeredCourses)
  function fetchSubjects() {
    const filteredSubjects = registeredCourses.filter(subj => {
      return subj.grade === selectedGrade &&
             (selectedSection === "" || subj.section === selectedSection);
    });

    renderSubjects(filteredSubjects);
  }

 function renderSubjects(subjects) {
  const tbody = document.getElementById("subjectTableBody");
  tbody.innerHTML = ""; 
  if (!Array.isArray(subjects) || subjects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">لا توجد مواد مطابقة.</td></tr>`;
    return;
  }

  subjects.forEach(subj => {
    const row = `
      <tr>
        <td>${subj.name}</td>
        <td>${subj.instructor || "غير محدد"}</td>
        <td>${subj.hours || "غير محدد"}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}


  // عند الضغط على زر الفرقة
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedGrade = btn.textContent.trim();
      fetchSubjects();
    });
  });

  // عند تغيير القسم
  sectionSelect.addEventListener("change", () => {
    selectedSection = sectionSelect.value === "disabled" ? "" : sectionSelect.value;
    fetchSubjects();
  });

  document.addEventListener("DOMContentLoaded", fetchSubjects);

