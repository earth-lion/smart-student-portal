document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("studentId");

    if (!token || !studentId) {
        alert("يرجى تسجيل الدخول أولاً");
        window.location.href = "loginForm.html";
        return;
    }

    console.log("Token:", token);
    console.log("Student ID:", studentId);

    axios.get(`http://127.0.0.1:8000/api/students/${studentId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        const data = response.data;
console.log("Image URL:", data.image_url);

        document.getElementById("student-name").textContent = data.name;

        document.getElementById("national-id").textContent = data.national_id;
        document.getElementById("phone-number").textContent = data.phone_number;
        document.getElementById("address").textContent = data.address;
        document.getElementById("department").textContent = data.department;
        document.getElementById("email").textContent = data.email;
        document.getElementById("academic_year").textContent = data.academic_year;
        document.getElementById("admission_year").textContent = data.admission_year;
        document.getElementById("seat_number").textContent = data.seat_number;
        document.getElementById("amount_due").textContent =
        data.financial_data ? data.financial_data.total_due + " جنيه" : "لا توجد بيانات مالية";
        document.getElementById("financial_status").textContent =data.financial_status;
        document.getElementById("current_gpa").textContent = data.current_gpa;
        document.getElementById("total_credits").textContent = data.total_credits;
        localStorage.setItem("studentData", JSON.stringify(data));
   
     
            if (data.name) {
                const welcome = document.createElement('div');
                welcome.textContent = `مرحبًا ${data.name} 👋`;
                welcome.className = 'welcome-message';
                document.querySelector('.data-table-container').prepend(welcome);
            }

            const rows = document.querySelectorAll('.data-table tr');
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, { threshold: 0.2 });

            rows.forEach(row => observer.observe(row));
    
    })
    .catch(error => {
        console.error("حدث خطأ أثناء جلب البيانات:", error.response ?? error);
        alert("حدث خطأ أثناء تحميل بيانات الطالب.");
});

});