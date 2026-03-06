document.addEventListener("DOMContentLoaded", function () {

  const btn = document.getElementById("calculateBtn");
  if (!btn) return;

  btn.addEventListener("click", function () {

    const lmpInput = document.getElementById("lmpDate");
    if (!lmpInput || !lmpInput.value) {
      alert("Please select a date.");
      return;
    }

    const lmp = new Date(lmpInput.value);
    const today = new Date();

    if (isNaN(lmp.getTime())) {
      alert("Invalid date.");
      return;
    }

    const diffTime = today.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280);

    const conceptionDate = new Date(lmp);
    conceptionDate.setDate(conceptionDate.getDate() + 14);

    let trimester = "First Trimester";
    let education = "";

    if (weeks > 12 && weeks <= 27) {
      trimester = "Second Trimester";
    }
    if (weeks > 27) {
      trimester = "Third Trimester";
    }

    if (trimester === "First Trimester") {
      education = "Hormonal changes begin. Common symptoms include nausea, fatigue, and breast tenderness.";
    } else if (trimester === "Second Trimester") {
      education = "Energy levels often improve. Baby development accelerates and movement may begin.";
    } else {
      education = "Rapid fetal growth continues. Monitoring and regular consultation are important.";
    }

    const weekEl = document.getElementById("weekNumber");
    const dayEl = document.getElementById("dayNumber");
    const dueEl = document.getElementById("dueDateResult");
    const concEl = document.getElementById("conceptionResult");
    const triEl = document.getElementById("trimesterResult");
    const progress = document.getElementById("progressFill");
    const eduBox = document.getElementById("educationBox");
    const box = document.getElementById("resultBox");

    if (!weekEl || !dayEl || !dueEl || !concEl || !triEl || !progress || !box || !eduBox) return;

    animateCounter(weekEl, weeks);
    animateCounter(dayEl, days);

    dueEl.textContent = "Estimated Due Date: " + dueDate.toDateString();
    concEl.textContent = "Estimated Conception Date: " + conceptionDate.toDateString();
    triEl.textContent = trimester;

    triEl.className = "trimester-badge " + trimester.toLowerCase().replace(" ", "-");

    const percent = Math.min((weeks / 40) * 100, 100);
    progress.style.width = percent + "%";

    eduBox.textContent = education;

    box.style.display = "block";
  });

  function animateCounter(element, target) {
    let start = 0;
    const duration = 800;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target;
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 16);
  }

});