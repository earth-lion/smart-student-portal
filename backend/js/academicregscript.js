document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("universityEmail");
    const passwordInput = document.getElementById("password");

    function clearErrors() {
        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
    }

    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const universityEmail = emailInput.value.trim();
        const password = passwordInput.value.trim();

        clearErrors();

        if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(name)) {
            alert("الاسم يجب أن يحتوي على حروف فقط.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(universityEmail)) {
            alert("صيغة البريد الإلكتروني غير صحيحة.");
            return;
        }

        if (password.length < 8) {
            alert("كلمة المرور يجب ألا تقل عن 8 أحرف.");
            return;
        }

        axios.post('http://127.0.0.1:8000/api/register', {
            name: name,
            email: universityEmail,
            password: password
        })
        .then(response => {
            const data = response.data;
            alert(data.message || "تم التسجيل بنجاح!");

            localStorage.setItem("token", data.token);
            localStorage.setItem("studentId", data.user.student_id);
            
            window.location.href = 'loginForm.html';
        })
        .catch(error => {
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 422) {
                    const errors = data.errors || {};
                    document.getElementById('nameError').textContent = errors.name?.[0] || '';
                    document.getElementById('emailError').textContent = errors.email?.[0] || '';
                    document.getElementById('passwordError').textContent = errors.password?.[0] || '';
                } else if (status === 400 || status === 401) {
                    alert(data.message);
                } else if (status === 200) {
                    alert(data.message);
                    window.location.href = 'loginForm.html';
                } else {
                    alert("حدث خطأ، يرجى المحاولة لاحقًا.");
                }
            } else {
                alert("فشل الاتصال بالسيرفر.");
            }
        });
    });

 
    [nameInput, emailInput, passwordInput].forEach((input, index, arr) => {
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
});
