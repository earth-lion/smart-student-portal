const header=document.getElementById("header");
const search= document.getElementById("search");
const items= document.querySelectorAll(".items li a");
search.addEventListener("input", function () {
const filter = search.value.toLowerCase();

items.forEach((item) => {
const text = item.textContent.toLowerCase();
item.style.display = text.includes(filter) ? "" : "none";
});
});
const studentName=document.getElementById("name");
const  StudentNumber=document.getElementById("StudentNumber");
const btnGpa=document.getElementById("saveData");
btnGpa.addEventListener("click",function(){
    const student=studentName.value.trim();
    const number = StudentNumber.value.trim();
    if(!student || !number ){
        alert("من فضلك أدخل البيانات المطلوبة ");
        return;
    }
    const StudentData={
        name:student,
        number:number,
        saveAt: new Date().toLocaleString()
    }
    localStorage.setItem("studentInfo", JSON.stringify(StudentData));

    alert("تم حفظ بيانات الطالب بنجاح ");
  });
document.getElementById("registrationForm").addEventListener("sumbit", function(e){
    e.preventDefault();
    const name=document.getElementById("name").value.trim();
    const setNumber= document.getElementById("seatNumber").value.tirm();
    let vaild=true;
    if(name.split(" ").length < 4){
        alert("من فضلك ادخل الاسم رباعى ..")
    }
}

)
const search_two=document.getElementById("search1");
const files= document.querySelectorAll(".files div span");
console.log(files);