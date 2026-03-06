

// HAMBURGER
document.getElementById("hamburgerBtn")
  ?.addEventListener("click", () => {
    document.getElementById("navMenu")?.classList.toggle("active");
  });

// DARK MODE WITH PERSISTENCE
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

document.getElementById("darkToggle")
  ?.addEventListener("click", toggleDarkMode);

window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
});

// SCROLL REVEAL
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal")
  .forEach(el => revealObserver.observe(el));

// MINI COUNTER (renamed observer)
const miniCounter = document.querySelector(".mini-counter");

if(miniCounter){
  const miniObserver = new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      const target = +miniCounter.dataset.target;
      let count = 0;
      const increment = target / 80;

      function update(){
        count += increment;
        if(count < target){
          miniCounter.textContent = Math.floor(count).toLocaleString();
          requestAnimationFrame(update);
        } else {
          miniCounter.textContent = "12K";
        }
      }

      update();
      miniObserver.disconnect();
    }
  },{threshold:.5});

  miniObserver.observe(miniCounter);
}

// ===============================
// FLAGGED DASHBOARD PREVIEW SYNC
// ===============================

(function(){

  const totalEl = document.getElementById("previewTotal");
  const overdueEl = document.getElementById("previewOverdue");
  const reviewEl = document.getElementById("previewReview");
  const confirmedEl = document.getElementById("previewConfirmed");
  const updatedEl = document.getElementById("lastUpdated");

  if(!totalEl) return; // only run on index

  let stats = {
    total: 125,
    overdue: 48,
    review: 32,
    confirmed: 45
  };

  function updateUI(){
    totalEl.textContent = stats.total;
    overdueEl.textContent = stats.overdue;
    reviewEl.textContent = stats.review;
    confirmedEl.textContent = stats.confirmed;

    document.querySelectorAll(".flag-stat").forEach(card=>{
      card.classList.remove("pulse");
      void card.offsetWidth;
      card.classList.add("pulse");
    });

    updatedEl.textContent = new Date().toLocaleTimeString();
  }

  function simulateLiveChange(){
    const randomType = ["overdue","review","confirmed"][Math.floor(Math.random()*3)];

    stats.total++;

    if(randomType === "overdue") stats.overdue++;
    if(randomType === "review") stats.review++;
    if(randomType === "confirmed") stats.confirmed++;

    updateUI();
  }

  updateUI();
  setInterval(simulateLiveChange, 20000);

})();

