function openModal(id){
  const modal = document.getElementById(id);
  if(modal){
    modal.style.display = "flex";
  }
}

function toggleChat(){
  const box = document.getElementById("liveChatBox");
  if(!box) return;
  box.style.display = box.style.display==="block" ? "none" : "block";
}

/* Online Indicator */
document.addEventListener("DOMContentLoaded",function(){
  const hour = new Date().getHours();
  const online = hour>=8 && hour<20;

  document.querySelectorAll(".online-dot").forEach(dot=>{
    dot.style.background = online ? "#28a745" : "#dc3545";
  });
});

document.addEventListener("DOMContentLoaded", function(){

  const form = document.getElementById("joinForm");
  const success = document.getElementById("joinSuccess");

  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      form.reset();
      if(success) success.style.display = "block";
    });
  }

});

document.addEventListener("DOMContentLoaded", function(){

  const clinicForm = document.getElementById("clinicContactForm");
  const clinicSuccess = document.getElementById("clinicSuccess");

  if(clinicForm){
    clinicForm.addEventListener("submit", function(e){
      e.preventDefault();
      clinicForm.reset();
      if(clinicSuccess) clinicSuccess.style.display = "block";
    });
  }

});