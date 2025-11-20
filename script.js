// === GROUP PANEL TOGGLE ===
const logoBtn = document.querySelector(".logo-container img");
const groupPanel = document.getElementById("groupPanel");

if (logoBtn && groupPanel) {
  logoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    groupPanel.classList.toggle("active");

    const content = groupPanel.querySelector(".panel-content");
    if (groupPanel.classList.contains("active")) {
      content.classList.add("fade-in");
    } else {
      content.classList.remove("fade-in");
    }
  });

  document.addEventListener("click", (e) => {
    if (
      groupPanel.classList.contains("active") &&
      !groupPanel.contains(e.target) &&
      !logoBtn.contains(e.target)
    ) {
      groupPanel.classList.remove("active");
    }
  });
}

// === MAIN INITIALIZATION ===
document.addEventListener("DOMContentLoaded", () => {
  const pages = [
    "index.html",
    "0_5introduction.html",
    "1introduction.html",
    "2introduction.html",
    "3introduction.html",
    "4_5principles.html",
    "4principles.html",
    "5principles.html",
    "6principles.html",
    "7principles.html",
    "8_5immanuelKants.html",
    "8_1immanuelKants.html",
    "8immanuelKants.html",
    "9immanuelKants.html",
    "10immanuelKants.html",
    "10_1immanuelKants.html",
    "11immanuelKants.html",
    "11_1immanuelKants.html",
    "12_5frameworks.html",
    "12frameworks.html",
    "12_1frameworks.html",
    "12_2frameworks.html",
    "12_3frameworks.html",
    "13frameworks.html",
    "14_5moralobligations.html",
    "14moralobligations.html",
    "14_1moralobligations.html",
    "15moralobligations.html",
    "16moralobligations.html",
    "17_5implications.html",
    "17implications.html",
    "17_1implications.html",
    "17_2implications.html",
    "17_3implications.html",
    "17_4implications.html",
    "18implications.html",
    "18_1implications.html",
    "18_2implications.html",
    "18_3implications.html",
    "18_4implications.html",
    "19implications.html",
    "19_1implications.html",
    "20_5criticisms.html",
    "20criticisms.html",
    "20_1criticisms.html",
    "21criticisms.html",
    "22criticisms.html",
    "22_1criticisms.html",
    "about.html"
  ];

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  let currentIndex = pages.indexOf(currentPage);

  const nextBtn = document.getElementById("nextHeader");
  const backBtn = document.getElementById("prevHeader");

  // === FIXED UNIVERSAL NAVIGATION (WORKS ON NETLIFY + LOCAL) ===
  function goToPage(index) {
    if (index >= 0 && index < pages.length) {
      const nextPage = pages[index];

      // --- Correctly handle Netlify and local URLs ---
      const currentPath = window.location.pathname;
      const folderPath = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);

      // ✅ Construct a relative URL (avoids Netlify reset)
      const finalURL = folderPath + nextPage;
      window.location.href = finalURL;
    }
  }

  if (nextBtn) nextBtn.addEventListener("click", () => goToPage(currentIndex + 1));
  if (backBtn) backBtn.addEventListener("click", () => goToPage(currentIndex - 1));

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goToPage(currentIndex + 1);
    if (e.key === "ArrowLeft") goToPage(currentIndex - 1);
  });

  // Dim arrows at start/end
  if (backBtn && currentIndex === 0) backBtn.style.opacity = "0.4";
  if (nextBtn && currentIndex === pages.length - 1) nextBtn.style.opacity = "0.4";
});

// === SEARCH SYSTEM ===
const searchIcon = document.querySelector(".fa-magnifying-glass");
const searchBox = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const doneBtn = document.getElementById("doneBtn");
const foundWordDisplay = document.getElementById("foundWordDisplay");

if (searchIcon && searchBox && searchInput && doneBtn && foundWordDisplay) {
  searchIcon.addEventListener("click", () => {
    searchBox.classList.add("active");
    searchInput.focus();
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    const topicList = document.querySelector(".topics-list");
    if (!topicList) return;

    topicList.innerHTML = topicList.innerHTML.replace(
      /<mark class="highlight">(.*?)<\/mark>/g,
      "$1"
    );

    if (query.length === 0) return;

    const regex = new RegExp(`(${query})`, "gi");
    topicList.innerHTML = topicList.innerHTML.replace(
      regex,
      `<mark class="highlight">$1</mark>`
    );
  });

  doneBtn.addEventListener("click", () => {
    const searchValue = searchInput.value.trim();
    searchBox.classList.remove("active");

    if (searchValue) {
      foundWordDisplay.innerHTML = `
        <span>Found: "${searchValue}"</span>
        <button id="closeFoundBtn">Done</button>
      `;
      foundWordDisplay.style.display = "flex";

      const closeBtn = document.getElementById("closeFoundBtn");
      closeBtn.addEventListener("click", () => {
        foundWordDisplay.style.display = "none";
        const topicList = document.querySelector(".topics-list");
        if (topicList) {
          topicList.innerHTML = topicList.innerHTML.replace(
            /<mark class="highlight">(.*?)<\/mark>/g,
            "$1"
          );
        }
      });
    }

    document.addEventListener("click", (e) => {
      if (
        searchBox.classList.contains("active") &&
        !searchBox.contains(e.target) &&
        !searchIcon.contains(e.target)
      ) {
        searchBox.classList.remove("active");
      }
    });

    searchInput.value = "";
  });
}

// === NOTES POPUP ===
const noteIcon = document.querySelector(".fa-note-sticky");
const notesPopup = document.getElementById("notesPopup");
const notesText = document.getElementById("notesText");
const notesDone = document.getElementById("notesDone");

if (noteIcon && notesPopup && notesText && notesDone) {
  const savedNotes = localStorage.getItem("userNotes");
  if (savedNotes) notesText.value = savedNotes;

  noteIcon.addEventListener("click", () => notesPopup.classList.remove("hidden"));
  notesDone.addEventListener("click", () => {
    localStorage.setItem("userNotes", notesText.value);
    notesPopup.classList.add("hidden");
  });
}

// === IMAGE CLICK GALLERY ===
const images = document.querySelectorAll(".galleryexample img");
let currentImgIndex = -1;
let isZoomed = false;

function resetGallery() {
  document.body.classList.remove("dimmed");
  images.forEach(img => img.classList.remove("active"));
  currentImgIndex = -1;
  isZoomed = false;
}

images.forEach((img, index) => {
  img.addEventListener("click", () => {
    if (!isZoomed) {
      currentImgIndex = index;
      showImage(currentImgIndex);
    }
  });
});

function showImage(index) {
  document.body.classList.add("dimmed");
  images[index].classList.add("active");
  isZoomed = true;
}

document.addEventListener("click", (e) => {
  if (!isZoomed) return;
  if (e.target.tagName.toLowerCase() === "img" && e.target.classList.contains("active")) return;

  images[currentImgIndex].classList.remove("active");
  currentImgIndex++;

  if (currentImgIndex < images.length) {
    images[currentImgIndex].classList.add("active");
  } else {
    resetGallery();
  }
});

// === SCATTER AND DUPLICATE IMAGES RANDOMLY ===
const gallery = document.querySelector(".kant-gallery");
if (gallery) {
  const kantImages = [...gallery.querySelectorAll("img")];
  kantImages.forEach(img => gallery.appendChild(img.cloneNode(true)));
  const allKantImages = gallery.querySelectorAll("img");

  function randomizePositions() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    allKantImages.forEach(img => {
      const iw = img.offsetWidth;
      const ih = img.offsetHeight;
      const randomX = Math.random() * (vw - iw * 1.4);
      const randomY = Math.random() * (vh - ih * 1.4);
      const randomRotate = Math.random() * 40 - 20;
      const randomScale = 0.8 + Math.random() * 0.6;

      img.style.left = `${randomX}px`;
      img.style.top = `${randomY}px`;
      img.style.transform = `rotate(${randomRotate}deg) scale(${randomScale})`;
    });
  }

  function blindRandomImages() {
    allKantImages.forEach(img => img.classList.remove("blind"));
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * allKantImages.length);
      allKantImages[r].classList.add("blind");
    }
  }

  randomizePositions();
  window.addEventListener("resize", randomizePositions);
  setInterval(blindRandomImages, 5000);
}

function randomizePositions() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  allKantImages.forEach(img => {
    const imgWidth = img.offsetWidth;
    const imgHeight = img.offsetHeight;
    const maxScale = 1.4; // match your randomScale max

    // subtract scaled width/height from viewport
    const randomX = Math.random() * (viewportWidth - imgWidth * maxScale);
    const randomY = Math.random() * (viewportHeight - imgHeight * maxScale);
    const randomRotate = Math.random() * 40 - 20;
    const randomScale = 0.8 + Math.random() * 0.6;

    img.style.left = `${randomX}px`;
    img.style.top = `${randomY}px`;
    img.style.transform = `rotate(${randomRotate}deg) scale(${randomScale})`;
  });
}
// === All pages ===
const pages = [
  "index.html",
  "0_5introduction.html",
  "1introduction.html",
  "2introduction.html",
  "3introduction.html",
  "4_5principles.html",
  "4principles.html",
  "5principles.html",
  "6principles.html",
  "7principles.html",
  "8_5immanuelKants.html",
  "8_1immanuelKants.html",
  "8immanuelKants.html",
  "9immanuelKants.html",
  "10immanuelKants.html",
  "10_1immanuelKants.html",
  "11immanuelKants.html",
  "11_1immanuelKants.html",
  "11_2immanuelKants.html",
  "12_5frameworks.html",
  "12frameworks.html",
  "12_1frameworks.html",
  "12_2frameworks.html",
  "12_3frameworks.html",
  "13frameworks.html",
  "14_5moralobligations.html",
  "14moralobligations.html",
  "14_1moralobligations.html",
  "15moralobligations.html",
  "16moralobligations.html",
  "17_5implications.html",
  "17implications.html",
  "17_1implications.html",
  "17_2implications.html",
  "17_3implications.html",
  "17_4implications.html",
  "18implications.html",
  "18_1implications.html",
  "18_2implications.html",
  "18_3implications.html",
  "18_4implications.html",
  "19implications.html",
  "19_implications.html",
  "20_5criticisms.html",
  "20criticisms.html",
  "20_1criticisms.html",
  "21criticisms.html",
  "22criticisms.html",
  "22_1criticisms.html",
  "about.html"
];

// === Get current page ===
const pagination = document.getElementById("pagination");
const scrollWrapper = document.querySelector(".scroll-wrapper-vertical");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const currentIndex = pages.indexOf(currentPage);

// === Create numbered links ===
pages.forEach((page, i) => {
  const li = document.createElement("li");
  li.innerHTML = `<a href="${page}" class="${i === currentIndex ? 'active' : ''}">${i + 1}</a>`;
  pagination.appendChild(li);
});

// === Scroll buttons ===
prevBtn.addEventListener("click", () => {
  scrollWrapper.scrollBy({ top: -100, behavior: "smooth" });
});
nextBtn.addEventListener("click", () => {
  scrollWrapper.scrollBy({ top: 100, behavior: "smooth" });
});

// === Auto-scroll to active ===
const active = pagination.querySelector(".active");
if (active) {
  active.scrollIntoView({ behavior: "smooth", block: "center" });
}

// === Auto-fade Sidebar ===
const sidebar = document.querySelector(".pagination-sidebar");
let idleTimer;

function setIdle() {
  sidebar.classList.add("idle");
}

function resetIdle() {
  sidebar.classList.remove("idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(setIdle, 5000);
}

document.addEventListener("mousemove", (e) => {
  if (e.clientX < 150) resetIdle();
});
document.addEventListener("touchstart", (e) => {
  if (e.touches[0].clientX < 150) resetIdle();
});

idleTimer = setTimeout(setIdle, 5000);
