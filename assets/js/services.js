document.addEventListener("DOMContentLoaded", function () {

  // ================= CART SYSTEM =================
  let cart = [];

  const cartDrawer = document.getElementById("cartDrawer");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalDisplay = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const closeModalBtn = document.getElementById("closeModal");

  const checkoutForm = document.getElementById("checkoutForm");
  const deliveryMethod = document.getElementById("deliveryMethod");
  const lbcType = document.getElementById("lbcType");
  const finalTotalDisplay = document.getElementById("finalTotal");

  const gcashProof = document.getElementById("gcashProof");
  const fileNamePreview = document.getElementById("fileNamePreview");

  window.addToCart = function (name, price, image) {
    cart.push({ name, price, image });
    renderCart();
  };

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <img src="${item.image}" width="50">
        <div>
          <strong>${item.name}</strong><br>
          ₱${item.price.toLocaleString()}
        </div>
        <button onclick="removeFromCart(${index})">✕</button>
      `;

      cartItemsContainer.appendChild(div);
    });

    cartTotalDisplay.textContent = total.toLocaleString();
    cartCount.textContent = cart.length;
  }

  window.removeFromCart = function (index) {
    cart.splice(index, 1);
    renderCart();
  };

  // ================= CHECKOUT =================
  if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      renderCheckoutSummary();
      updateFinalTotal();

      checkoutModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeModalBtn && checkoutModal) {
    closeModalBtn.addEventListener("click", closeCheckout);
  }

  if (checkoutModal) {
    checkoutModal.addEventListener("click", (e) => {
      if (e.target === checkoutModal) closeCheckout();
    });
  }

  function closeCheckout() {
    checkoutModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // ================= DELIVERY =================
  function updateFinalTotal() {
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    const method = deliveryMethod.value;

    if (method === "lbc_cod") total += 500;
    if (method === "lalamove") total += 500;
    if (method === "international") total += 20000;

    finalTotalDisplay.textContent = total.toLocaleString();
  }

  if (deliveryMethod) {
    deliveryMethod.addEventListener("change", () => {

      if (deliveryMethod.value === "lbc_cod" || deliveryMethod.value === "lbc_paid") {
        lbcType.style.display = "block";
        lbcType.required = true;
      } else {
        lbcType.style.display = "none";
        lbcType.required = false;
        lbcType.value = "";
      }

      updateFinalTotal();
    });
  }

  // ================= CHECKOUT SUMMARY =================
  function renderCheckoutSummary() {
    const summary = document.getElementById("checkoutSummary");
    summary.innerHTML = "";

    cart.forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${item.name}</strong> - ₱${item.price.toLocaleString()}`;
      summary.appendChild(div);
    });
  }

  // ================= GCash Upload =================
  if (gcashProof) {
    gcashProof.addEventListener("change", () => {

      if (gcashProof.files.length === 0) return;

      const file = gcashProof.files[0];

      if (!file.type.startsWith("image/")) {
        alert("Only image files allowed.");
        gcashProof.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File must not exceed 5MB.");
        gcashProof.value = "";
        return;
      }

      fileNamePreview.textContent = "Selected: " + file.name;
    });
  }

  // ================= ORDER SUBMIT =================
  function generateOrderID() {
    return "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (
        (deliveryMethod.value === "lbc_cod" || deliveryMethod.value === "lbc_paid")
        && !lbcType.value
      ) {
        alert("Please select LBC delivery type.");
        return;
      }

      if (!gcashProof || gcashProof.files.length === 0) {
        alert("Upload GCash proof.");
        return;
      }

      const reader = new FileReader();

      reader.onload = function () {

        const orderID = generateOrderID();
        const total = finalTotalDisplay.textContent;

        const premiumModal = checkoutModal.querySelector(".premium-modal");

        premiumModal.innerHTML = `
          <div class="success-box">
            <h2>Order Confirmed</h2>
            <p><strong>Order ID:</strong> ${orderID}</p>
            <p><strong>Total:</strong> ₱${total}</p>
            <button onclick="location.reload()">Close</button>
          </div>
        `;

        cart = [];
        renderCart();
      };

      reader.readAsDataURL(gcashProof.files[0]);
    });
  }

  // =============================================
  // CLINICAL PROCEDURE SYSTEM
  // =============================================

  const procedureModal = document.getElementById("procedureModal");
  const procedureForm = document.getElementById("procedureForm");
  const procedureNameInput = document.getElementById("procedureName");
  const procedureDateInput = document.getElementById("procedureDate");
  const procedureTimeInput = document.getElementById("procedureTime");

  let bookings = {};
  const MAX_PER_SLOT = 3;

  if (procedureDateInput) {
    const today = new Date().toISOString().split("T")[0];
    procedureDateInput.setAttribute("min", today);

    procedureDateInput.addEventListener("input", () => {
      const selected = new Date(procedureDateInput.value);
      if (selected.getDay() === 0) {
        alert("Clinic closed on Sundays.");
        procedureDateInput.value = "";
      }
    });
  }

  window.openProcedureModal = function (name) {
    if (!procedureModal) return;
    procedureNameInput.value = name;
    procedureModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeProcedureModal = function () {
    if (!procedureModal) return;
    procedureModal.classList.remove("active");
    document.body.style.overflow = "auto";
    procedureForm.reset();
  };

  if (procedureForm) {
    procedureForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const date = procedureDateInput.value;
      const time = procedureTimeInput.value;

      if (!date || !time) {
        alert("Please select date and time.");
        return;
      }

      if (!bookings[date]) bookings[date] = {};
      if (!bookings[date][time]) bookings[date][time] = 0;

      if (bookings[date][time] >= MAX_PER_SLOT) {
        alert("Time slot fully booked.");
        return;
      }

      bookings[date][time]++;

      const appointmentID = "APT-" + Date.now();

      const modalContent = procedureModal.querySelector(".premium-modal");

      modalContent.innerHTML = `
        <div class="success-box">
          <h2>Appointment Confirmed</h2>
          <p><strong>ID:</strong> ${appointmentID}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <button onclick="location.reload()">Close</button>
        </div>
      `;
    });
  }

});