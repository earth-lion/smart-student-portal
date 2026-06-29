// جلب الحقول
const nameInput = document.getElementById("name");
const seatInput = document.getElementById("seatNumber");

// تحميل البيانات من localStorage
window.addEventListener("load", () => {
  nameInput.value = localStorage.getItem("name") || "";
  seatInput.value = localStorage.getItem("seatNumber") || "";
});

// حفظ البيانات تلقائيًا
[nameInput, seatInput].forEach((input) => {
  input.addEventListener("input", () => {
    localStorage.setItem("name", nameInput.value);
    localStorage.setItem("seatNumber", seatInput.value);
  });
});

// التحقق من صحة البيانات
function validateregistrationForm() {
  let valid = true;
  clearErrors();

  if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(nameInput.value.trim())) {
    showError(nameInput, "الاسم يجب أن يحتوي على حروف فقط");
    valid = false;
  }

  if (!/^\d+$/.test(seatInput.value.trim())) {
    showError(seatInput, "رقم الجلوس يجب أن يحتوي على أرقام فقط");
    valid = false;
  }
  return valid;
}

// التنقل باستخدام Enter
[nameInput, seatInput].forEach((input, index, arr) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < arr.length - 1) {
        arr[index + 1].focus();
      } else {
        document.getElementById("registrationForm").requestSubmit();
      }
    }
  });
});

// عند إرسال الفورم
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const seatNumber = document.getElementById("seatNumber").value;
    if (validateregistrationForm()) {
      axios
        .post("http://127.0.0.1:8000/api/get-university-email", {
          name: name,
          seatNumber: seatNumber,
        })
        .then((response) => {
          alert("تم تسجيل البيانات بنجاح ");
          const token = response.data.token;
          localStorage.setItem("token", token);
          localStorage.setItem("universityEmail", response.data.email);
          localStorage.setItem("universityPassword", response.data.password);
          localStorage.setItem("studentName", response.data.name);

          window.location.href = "gmail.html";
        })
        .catch(() => {
          alert("حدث خطأ يرجى المحاولة لاحقا");
        });
    }
  });

// عرض رسالة خطأ
function showError(input, message) {
  const error = document.createElement("div");
  error.className = "text-danger mt-1";
  error.style.fontSize = "14px";
  error.textContent = message;
  input.parentElement.appendChild(error);
}

// حذف الرسائل القديمة
function clearErrors() {
  document
    .querySelectorAll("#registrationForm .text-danger")
    .forEach((el) => el.remove());
}
