

  window.addEventListener("load", function () {
    const user = JSON.parse(localStorage.getItem("user"));

    // التحقق إذا كانت البيانات موجودة
    const name = user?.name || "غير متوفر";
    const email = user?.email || "غير متوفر";
    const password = user?.password || "غير متوفرة";

    // عرض البيانات في الصفحة
    document.getElementById("studentName").textContent = name;
    document.getElementById("email").textContent = email;

    const passwordElement = document.getElementById("password");

    // إذا كان عنصر الباسورد عبارة عن input
    if (passwordElement.tagName.toLowerCase() === "input") {
      passwordElement.value = password;
    } else {
      // إذا كان عنصر الباسورد عبارة عن span أو div
      passwordElement.textContent = password;
    }
  });
