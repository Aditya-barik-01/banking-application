let btn = document.querySelector("#btn");
btn.addEventListener("click",()=>{
  alert("Thank you very much for interacting , Your msg is sent.");
});

const togglebtn = document.querySelector(".togglebtn");


elements.addEventListener("change",()=>{
  let elements = document.querySelectorAll(".container-fluid,#contact_us");
  if(togglebtn.checked)
  {
    elements.forEach((el)=>{el.classList.add("dark")});
    elements.forEach((el)=>{el.classList.remove("light")});
  }else{
    elements.forEach((el)=>{el.classList.add("light")});
    elements.forEach((el)=>{el.classList.remove("dark")});
  }
});

