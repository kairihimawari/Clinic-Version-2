document.addEventListener("DOMContentLoaded", function(){

  const caseGrid = document.getElementById("caseGrid");
  const searchInput = document.getElementById("searchInput");
  const tabs = document.querySelectorAll(".tab");
  const pagination = document.getElementById("pagination");
  const sortSelect = document.getElementById("sortSelect");

  const totalCount = document.getElementById("totalCount");
  const overdueCount = document.getElementById("overdueCount");
  const reviewCount = document.getElementById("reviewCount");
  const confirmedCount = document.getElementById("confirmedCount");

  const itemsPerPage = 6;
  const maxVisiblePages = 5;

  let currentPage = 1;
  let currentStatus = "all";
  let searchTerm = "";
  let currentSort = "newest";

  // ===============================
  // REALISTIC DATA
  // ===============================

  const firstNames = ["Juan","Maria","Carlo","Angela","Mark","Jessa","Kevin","Nicole","Ryan","Sophia","Joshua","Danica","Miguel","Rhea","Christian","Patricia"];
  const lastNames = ["Santos","Reyes","Cruz","Garcia","Mendoza","Torres","Flores","Aquino","Navarro","Ramos","Castillo","Villanueva"];
  const cities = ["Manila","Quezon City","Makati","Taguig","Pasig","Cavite","Laguna","Bulacan","Rizal","Batangas"];
  const statuses = ["overdue","review","confirmed"];

  let idCounter = 1;
  const cases = generateCases(200);

  function generateCases(total){
    const data = [];
    for(let i=0;i<total;i++){
      data.push(createCase());
    }
    return data;
  }

  function createCase(){
    const first = firstNames[Math.floor(Math.random()*firstNames.length)];
    const last = lastNames[Math.floor(Math.random()*lastNames.length)];
    const city = cities[Math.floor(Math.random()*cities.length)];
    const status = statuses[Math.floor(Math.random()*3)];
    const amount = (Math.floor(Math.random()*9000)+1000).toLocaleString();
    const daysAgo = Math.floor(Math.random()*60);

    return {
      id:idCounter++,
      name:`${first} ${last}`,
      orderID:`ORD-${1000 + idCounter}`,
      phone:`09${Math.floor(100000000 + Math.random()*900000000)}`,
      address:city,
      status:status,
      amount:`₱${amount}`,
      date:`${daysAgo} days ago`
    };
  }

  // ===============================
  // STATS
  // ===============================

  function updateStats(){
    totalCount.textContent = cases.length;
    overdueCount.textContent = cases.filter(c=>c.status==="overdue").length;
    reviewCount.textContent = cases.filter(c=>c.status==="review").length;
    confirmedCount.textContent = cases.filter(c=>c.status==="confirmed").length;
  }

  // ===============================
  // FILTER + SORT
  // ===============================

  function filterCases(){
    let filtered = cases.filter(c => {
      const matchesStatus = currentStatus === "all" || c.status === currentStatus;
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm) ||
        c.orderID.toLowerCase().includes(searchTerm) ||
        c.phone.includes(searchTerm);

      return matchesStatus && matchesSearch;
    });

    if(currentSort === "newest") filtered.sort((a,b)=> b.id - a.id);
    if(currentSort === "oldest") filtered.sort((a,b)=> a.id - b.id);
    if(currentSort === "az") filtered.sort((a,b)=> a.name.localeCompare(b.name));

    return filtered;
  }

  // ===============================
  // RENDER
  // ===============================

  function renderCases(){
    caseGrid.innerHTML = "";

    const filtered = filterCases();
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    paginated.forEach(data => {

      const card = document.createElement("div");
      card.classList.add("case-card");

      card.innerHTML = `
        <div class="case-header">
          <img src="https://i.pravatar.cc/150?u=${data.orderID}">
          <div>
            <div class="case-name">${data.name}</div>
            <span class="status ${data.status}">
              ${data.status.toUpperCase()}
            </span>
          </div>
        </div>
        <div class="info"><strong>Order ID:</strong> ${data.orderID}</div>
        <div class="info"><strong>Phone:</strong> ${data.phone}</div>
        <div class="info"><strong>Address:</strong> ${data.address}</div>
        <div class="info"><strong>Amount:</strong> ${data.amount}</div>
        <div class="info"><strong>Flagged:</strong> ${data.date}</div>
          <img class="proof-img" src="assets/images/scam/scam${Math.floor(Math.random()*20)+1}.jpg">

      `;

      caseGrid.appendChild(card);
    });

    renderPagination(filtered.length);
  }

  // ===============================
  // SMART PAGINATION
  // ===============================

  function renderPagination(totalItems){
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if(totalPages <= 1) return;

    const createBtn = (label, page, disabled=false) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.classList.add("page-btn");
      if(disabled) btn.disabled = true;
      if(page === currentPage) btn.classList.add("active");

      btn.addEventListener("click", () => {
        currentPage = page;
        renderCases();
      });

      return btn;
    };

    // Prev
    pagination.appendChild(
      createBtn("Prev", currentPage - 1, currentPage === 1)
    );

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages/2));
    let endPage = startPage + maxVisiblePages - 1;

    if(endPage > totalPages){
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if(startPage > 1){
      pagination.appendChild(createBtn("1", 1));
      if(startPage > 2){
        const dots = document.createElement("span");
        dots.textContent = "...";
        pagination.appendChild(dots);
      }
    }

    for(let i=startPage;i<=endPage;i++){
      pagination.appendChild(createBtn(i, i));
    }

    if(endPage < totalPages){
      if(endPage < totalPages - 1){
        const dots = document.createElement("span");
        dots.textContent = "...";
        pagination.appendChild(dots);
      }
      pagination.appendChild(createBtn(totalPages, totalPages));
    }

    // Next
    pagination.appendChild(
      createBtn("Next", currentPage + 1, currentPage === totalPages)
    );
  }

  // ===============================
  // TOAST + SOUND ALERT
  // ===============================

  function showToast(message){
    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(()=> toast.classList.add("show"), 10);
    setTimeout(()=>{
      toast.classList.remove("show");
      setTimeout(()=> toast.remove(), 300);
    }, 3000);
  }

  function playAlertSound(){
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    audio.play();
  }

  // ===============================
  // EVENTS
  // ===============================

  searchInput.addEventListener("input", e => {
    searchTerm = e.target.value.toLowerCase();
    currentPage = 1;
    renderCases();
  });

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentStatus = tab.dataset.status;
      currentPage = 1;
      renderCases();
    });
  });

  sortSelect.addEventListener("change", e => {
    currentSort = e.target.value;
    currentPage = 1;
    renderCases();
  });

  // ===============================
  // SIMULATED LIVE UPDATE
  // ===============================

  setInterval(()=>{
    const newCase = createCase();
    cases.unshift(newCase);
    updateStats();
    renderCases();
    showToast("⚠️ New flagged account detected!");
    playAlertSound();
  }, 20000);

  updateStats();
  renderCases();
});