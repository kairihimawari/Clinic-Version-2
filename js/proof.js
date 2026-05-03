// ================= PAGE LOAD =================
window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});

// ================= SCROLL REVEAL =================
const reveals = document.querySelectorAll(".story-section");

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.2 });

reveals.forEach(section => revealObserver.observe(section));

// ================= FILTER =================
const filterBtns = document.querySelectorAll(".filter-btn");
const filterItems = document.querySelectorAll(".filter-item");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    filterItems.forEach(item => {
      item.style.display =
        filter === "all" || item.classList.contains(filter)
          ? ""
          : "none";
    });
  });
});

// ================= LOAD MORE + MASONRY =================
const images = document.querySelectorAll(".proof-img");
const loadMoreImagesBtn = document.getElementById("loadMoreImages");
let imagesToShow = 6;

function updateImages() {
  images.forEach((img, index) => {
    img.style.display = index < imagesToShow ? "block" : "none";
  });

  if (imagesToShow >= images.length && loadMoreImagesBtn) {
    loadMoreImagesBtn.style.display = "none";
  }
}

if (images.length) {
  updateImages();

  loadMoreImagesBtn?.addEventListener("click", () => {
    imagesToShow += 6;
    updateImages();
  });
}

// ================= VIDEO LOAD MORE =================
const videos = document.querySelectorAll(".video-card");
const loadMoreVideosBtn = document.getElementById("loadMoreVideos");
let videosToShow = 2;

function updateVideos() {
  videos.forEach((vid, index) => {
    vid.style.display = index < videosToShow ? "block" : "none";
  });

  if (videosToShow >= videos.length && loadMoreVideosBtn) {
    loadMoreVideosBtn.style.display = "none";
  }
}

if (videos.length) {
  updateVideos();

  loadMoreVideosBtn?.addEventListener("click", () => {
    videosToShow += 2;
    updateVideos();
  });
}

// ================= IMAGE LIGHTBOX =================
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
let currentIndex = 0;

images.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index;
    modalImage.src = img.src;
    imageModal.classList.add("active");
  });
});

function closeImage() {
  imageModal.classList.remove("active");
}

document.getElementById("closeImageModal")?.addEventListener("click", closeImage);

imageModal?.addEventListener("click", e => {
  if (e.target === imageModal) closeImage();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeImage();
});

// ================= VIDEO MODAL =================
const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");

videos.forEach(card => {
  card.addEventListener("click", () => {
    modalVideo.src = card.dataset.video;
    videoModal.classList.add("active");
  });
});

function closeVideo() {
  modalVideo.pause();
  modalVideo.src = "";
  videoModal.classList.remove("active");
}

document.getElementById("closeVideoModal")?.addEventListener("click", closeVideo);

videoModal?.addEventListener("click", e => {
  if (e.target === videoModal) closeVideo();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeVideo();
});

// ================= AUTO TESTIMONIAL SLIDER =================
const track = document.querySelector(".testimonial-track");

if (track) {
  let index = 0;

  function slide() {
    index = (index + 1) % track.children.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  setInterval(slide, 5000);

  document.getElementById("nextReview")?.addEventListener("click", slide);

  document.getElementById("prevReview")?.addEventListener("click", () => {
    index = (index - 1 + track.children.length) % track.children.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  });
}

// ================= COUNTER =================
const counter = document.querySelector(".counter");

if (counter) {
  const target = +counter.dataset.target;
  let count = 0;
  const increment = target / 120;

  function updateCounter() {
    count += increment;
    if (count < target) {
      counter.innerText = Math.floor(count).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      counter.innerText = target.toLocaleString();
    }
  }

  updateCounter();
}

// ================= PROGRESS RINGS =================
const rings = document.querySelectorAll(".ring-progress");

rings.forEach(ring => {
  const percent = ring.dataset.percent;
  const radius = ring.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference;

  const offset = circumference - (percent / 100) * circumference;

  setTimeout(() => {
    ring.style.transition = "stroke-dashoffset 1.5s ease";
    ring.style.strokeDashoffset = offset;
  }, 500);
});

// ================= PREMIUM TOAST SYSTEM =================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  let container = document.getElementById("toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    document.body.appendChild(container);
  }

  container.appendChild(toast);

  setTimeout(() => toast.remove(), 5000);
}

// Realistic random names + cities
const names = ["Maria", "Angela", "Samantha", "Grace", "Luna", "Isabella"];
const cities = ["Manila", "Cebu", "Davao", "Quezon City", "Pasig", "Taguig"];

function randomActivity() {
  const name = names[Math.floor(Math.random() * names.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];

  const messages = [
    `${name} from ${city} just booked a consultation`,
    `${name} from ${city} purchased a premium package`,
    `New secure order completed from ${city}`,
    `Private booking confirmed in ${city}`
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

setInterval(() => {
  showToast(randomActivity());
}, 18000);

// ================= INITIAL STAGGER ANIMATION =================
window.addEventListener("load", () => {

  document.body.classList.add("page-loaded");

  const items = document.querySelectorAll(".proof-img, .video-card");

  items.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(30px)";

    setTimeout(() => {
      item.style.transition = "all 0.6s ease";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, index * 100);
  });

});