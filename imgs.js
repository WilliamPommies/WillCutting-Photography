function filterImages(tag) {
    const imgs = document.querySelectorAll("#container img");
    imgs.forEach(img => {
        const tags = img.dataset.tag
            .split(",")
            .map(t => t.trim().toLowerCase());

        if (tag === "all" || tags.includes(tag.toLowerCase())) {
            img.parentElement.style.display = "flex";
        } else {
            img.parentElement.style.display = "none";
        }
    });
}

function filterCombined() {
  const year = document.getElementById("year-filter").value;
  const genre = document.getElementById("genre-filter").value;
  const wrappers = document.querySelectorAll("#container .img-wrapper");

  wrappers.forEach(wrapper => {
    const img = wrapper.querySelector("img");
    const tags = img.dataset.tag.split(",").map(t => t.trim().toLowerCase());

    const showYear = year === "all" || tags.includes(year.toLowerCase());
    const showGenre = genre === "all" || tags.includes(genre.toLowerCase());

    wrapper.style.display = showYear && showGenre ? "flex" : "none";
  });
}

function resetFilters() {
  document.getElementById("year-filter").value = "all";
  document.getElementById("genre-filter").value = "all";
  filterCombined();
  const tourismElements = document.querySelectorAll('[data-tag="Tourisme"]')
  for(const toursimElement of tourismElements){
    toursimElement.parentElement.style.display = "none"
  }
}

function displayImg(imgs) {
    const container = document.getElementById("container");
    if (!container) {
        console.error("L'élément 'container' n'existe pas dans le DOM.");
        return;
    }

    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.querySelector(".close");

    closeBtn.onclick = function() {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
    };

    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.classList.remove('modal-open');
        }
    };

    imgs.forEach(img => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("img-wrapper");

        const el = document.createElement("img");
        el.loading = "lazy";
        el.src = `https://drive.google.com/thumbnail?id=${img.id}&sz=w1000`;
        el.alt = img.alt;
        el.dataset.tag = img.tag;
        if(img.tag == "Tourisme"){
          wrapper.style.display = "none"
        }

        el.addEventListener("contextmenu", e => e.preventDefault());

        const overlay = document.createElement("div");
        overlay.classList.add("img-overlay");
        overlay.textContent = img.desc || "";

        el.onclick = function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modalImg.addEventListener("contextmenu", e => e.preventDefault());
            document.body.classList.add("modal-open");
        };

        wrapper.appendChild(el);
        wrapper.appendChild(overlay);
        container.appendChild(wrapper);
    });
}

const konamiCode = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a", "Enter"
];

let konamiPosition = 0;

window.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === konamiCode[konamiPosition]) {
    konamiPosition++;
    if (konamiPosition === konamiCode.length) {
      filterImages("Tourisme");
      konamiPosition = 0;
    }
  } else {
    konamiPosition = 0;
  }
});


let imgs = []; 

fetch('bdd.JSON')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur de chargement du fichier JSON');
    }
    return response.json();
  })
  .then(data => {
    imgs = data; 
    displayImg(imgs);
  })
  .catch(error => {
    console.error('Erreur:', error);
  });
