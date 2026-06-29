document.addEventListener("DOMContentLoaded", () => {

  const min = document.getElementById('min');
  const max = document.getElementById('max'); 
  const total = document.getElementById('total');
  const confirmButton = document.querySelector(".confirm-button");
  const note = document.querySelector(".note");
  let maxAllowedHours=0;
  let totalHours = 0;
  const toggle = document.querySelector(".toggle");
  const sidebar = document.querySelector(".sidebar");

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
  sidebar.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });

  const studentId = localStorage.getItem("studentId");
  if (!studentId) {
    alert("يجب تسجيل الدخول أولًا.");
    window.location.href = "login.html";
    return;
  }

  axios.get("http://127.0.0.1:8000/api/courses", {
    params: { student_id: studentId },
    headers: {
      Authorization: `Bearer 10|your_token_here`
    }
  })
  .then(response => {
    const data = response.data;
    const tbody = document.querySelector("tbody");

     maxAllowedHours = data.max_allowed_hours;     
    max.textContent = maxAllowedHours; 
    min.textContent = 14;
    total.textContent = "0.00";

    data.courses.forEach(course => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="وصف المقرر">${course.name}</td>
        <td data-label="عدد الساعات المعتمده ">${course.total_credits.toFixed(2)}</td>
        <td data-label="دكتور الماده">${course.instructor_name}</td>
        <td data-label="نوع المقرر">${course.type}</td>
        <td data-label="الفرقه"><input  value="${course.academic_year}"></td>
        <td data-label="الحاله"><input type="checkbox" value="${course.course_id}"></td>
       

      `;

      const checkbox = row.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => {
        const courseHours = parseFloat(course.total_credits);
        if (checkbox.checked) {
          totalHours += courseHours;
        } else {
          totalHours -= courseHours;
        }

        total.textContent = totalHours.toFixed(2);
        max.textContent = (data.available_hours - totalHours).toFixed(2);
      });

      tbody.appendChild(row);
    });
  })
  .catch(error => {
    alert("فشل في تحميل المقررات.");
    console.error(error);
  });

  confirmButton.addEventListener('click', () => {
    const selectedCourseIds = [];
    const registeredCourses = [];
    totalHours = 0;

    const rows = document.querySelectorAll('.courses-table tbody tr');
    rows.forEach(row => {
      const checkbox = row.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        const course = {
          name: row.children[0].textContent.trim(),
          hours: row.children[1].textContent.trim(),
          instructor: row.children[2].textContent.trim(),
          type: row.children[3].textContent.trim(),
          course_id: checkbox.value
        };
        totalHours += parseFloat(course.hours);
        selectedCourseIds.push(course.course_id);
        registeredCourses.push(course);
      }
    });

    const MinHours = parseFloat(min.textContent);
       const MaxHours = maxAllowedHours;

    if (totalHours < MinHours) {
      alert(` لا يمكنك تأكيد التسجيل، الحد الأدنى هو ${MinHours} ساعة.`);
      return;
    }

    if (totalHours > MaxHours) {
      alert(` لا يمكنك تأكيد التسجيل، تجاوزت الحد الأقصى المسموح به وهو ${MaxHours} ساعة.`);
      return;
    }

    axios.post("http://127.0.0.1:8000/api/courses/register", {
      student_id: studentId,
      course_ids: selectedCourseIds
    }, {
      headers: {
        Authorization: `Bearer 10|your_token_here`
      }
    })
    .then(response => {
      localStorage.removeItem("registered_courses");
      localStorage.setItem("registered_courses", JSON.stringify(registeredCourses));

      note.style.display = 'block';
      note.style.animation = 'fadeIn 2s';
      alert(response.data.message || "تم التسجيل بنجاح.");
       
   
    })
    .catch(error => {
      console.error("تفاصيل الخطأ:", error.response ? error.response.data : error);
      alert("حدث خطأ أثناء تسجيل المقررات.");
    });
  });

  document.querySelector(".print-button").addEventListener("click", () => {
    window.location.href = "report.html";
  });


});
