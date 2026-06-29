
//  التحقق من النموذج عند الإرسال
document.getElementById("contact-form")?.addEventListener("submit", function (e) {
        e.preventDefault(); // منع الإرسال التلقائي للنموذج

        const email = document.getElementById("email");
        const id = document.getElementById("id");
        const message = document.getElementById("message");

        let valid = true;

        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.style.border = "2px solid red";
            email.style.backgroundColor = "#ffe6e6";
            valid = false;
        } else {
            email.style.border = "";
            email.style.backgroundColor = "";
        }

        // التحقق من الرقم القومي (14 رقم فقط)
        if (!/^\d{14}$/.test(id.value)) {
            id.style.border = "2px solid red";
            id.style.backgroundColor = "#ffe6e6";
            valid = false;
        } else {
            id.style.border = "";
            id.style.backgroundColor = "";
        }

        // التحقق من أن الرسالة ليست فارغة
        if (message.value.trim() === "") {
            message.style.border = "2px solid red";
            message.style.backgroundColor = "#ffe6e6";
            valid = false;
        } else {
            message.style.border = "";
            message.style.backgroundColor = "";
        }

        // إرسال البيانات عبر Axios
        if (valid) {
            const data = {
                email: email.value,
                national_id: id.value,
                content: message.value
            };

            axios.post("http://127.0.0.1:8000/api/comments", data, {
                headers: {
                    "Accept": "application/json"
                }
            })
                .then(response => {
                    if (response.data.message === "تم حفظ التعليق بنجاح") {
                        alert("✅ " + response.data.message);
                        email.value = "";
                        id.value = "";
                        message.value = "";
                    } else {
                        alert("❌ " + (response.data.message || "حدث خطأ"));
                    }
                })
                .catch(error => {
                    alert(" ❌  حدث خطأ أثناء الإرسال تحقق من الايميل والرقم القومي مرة اخري " );
                    console.error(error);
                });

            // أنميشن الزر بعد الإرسال
            const submitBtn = this.querySelector("button[type='submit']");
            if (submitBtn) {
                submitBtn.style.transition = "transform 0.2s";
                submitBtn.style.transform = "translateX(5px)";
                setTimeout(() => {
                    submitBtn.style.transform = "translateX(-5px)";
                    setTimeout(() => {
                        submitBtn.style.transform = "translateX(0)";
                    }, 100);
                }, 100);
            }
        }
    });


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

window.addEventListener("scroll", () => {
    const elements = document.querySelectorAll(".section-title, .event-card");
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            el.style.filter = "blur(0)";
        }
    });
});

document.querySelectorAll(".section-title, .event-card").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.filter = "blur(5px)";
    el.style.transition = "all 0.6s ease-in-out";
});
let scrollBtn = document.createElement("button");
scrollBtn.id = "scrollToTop";
scrollBtn.innerText = "↑";
document.body.appendChild(scrollBtn);

scrollBtn.style.position = "fixed";
scrollBtn.style.bottom = "30px";
scrollBtn.style.right = "30px";
scrollBtn.style.display = "none";
scrollBtn.style.backgroundColor = "#007BFF";
scrollBtn.style.color = "white";
scrollBtn.style.border = "none";
scrollBtn.style.borderRadius = "50%";
scrollBtn.style.width = "50px"; // ← تثبيت الطول والعرض
scrollBtn.style.height = "50px";
scrollBtn.style.fontSize = "22px";
scrollBtn.style.textAlign = "center";
scrollBtn.style.lineHeight = "50px"; // ← لتوسيط السهم عموديًا
scrollBtn.style.cursor = "pointer";
scrollBtn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
scrollBtn.style.zIndex = "1000";
scrollBtn.style.transition = "background-color 0.3s ease";

scrollBtn.addEventListener("mouseover", () => {
    scrollBtn.style.backgroundColor = "#0056b3";
});
scrollBtn.addEventListener("mouseout", () => {
    scrollBtn.style.backgroundColor = "#007BFF";
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
