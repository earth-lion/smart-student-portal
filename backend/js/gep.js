function collectCoursesData() {
    const inputs = document.querySelectorAll('#inputsContainer .inputs');
    const courses = [];

    inputs.forEach(input => {
        const name = input.querySelector('.name').value;
        const grade = parseFloat(input.querySelector('.grade').value);
        const hours = parseFloat(input.querySelector('.hours').value);

        if (!isNaN(grade) && !isNaN(hours)) {
            courses.push({ name, grade, hours });
        }
    });

    return courses;
}

function calculateGPA() {
    const courses = collectCoursesData();

    if (courses.length === 0) {
        alert('الرجاء إدخال مادة واحدة على الأقل مع درجات وساعات صحيحة.');
        return;
    }

    axios.post('http://127.0.0.1:8000/api/calculate-gpa', { courses }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
            .then(response => {
            const gpa = response.data.gpa;
            document.getElementById('result').innerHTML = `المعدل التراكمي هو: ${gpa}`;
        })
        .catch(error => {
            console.error(error);
            alert('حدث خطأ أثناء حساب المعدل. تأكد من إدخال البيانات بشكل صحيح.');
        });
}

function addSubject() {
    const container = document.getElementById('inputsContainer');
    const newInput = document.createElement('div');
    newInput.classList.add('inputs');
    newInput.innerHTML = `
        <input type="text" name="اسم الماده" placeholder="ادخل اسم الماده" class="name" />
        <div>
            <input type="number" name="الدرجة" placeholder="الدرجة" class="grade" />
            <input type="number" name="عدد الساعات" placeholder="عدد ساعات المقرر" class="hours" />
        </div>
    `;
    container.appendChild(newInput);
}
