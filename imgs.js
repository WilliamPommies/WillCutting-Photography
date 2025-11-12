function displayImg(imgs) {
    const container = document.getElementById("container");
    if (!container) {
        console.error("L'élément 'container' n'existe pas dans le DOM.");
        return;
    }

    imgs.forEach(img => {
        const el = document.createElement("img");
        el.src = `https://drive.google.com/thumbnail?id=${img.id}&sz=w1000`;
        el.alt = img.alt;
        el.dataset.tag = img.tag; 
        container.appendChild(el);
    });
}

function filterImages(tag) {
    const imgs = document.querySelectorAll("#container img");
    imgs.forEach(img => {
        const tags = img.dataset.tag
            .split(",")
            .map(t => t.trim().toLowerCase());

        if (tag === "all" || tags.includes(tag.toLowerCase())) {
            img.style.display = "block";
        } else {
            img.style.display = "none";
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

    wrapper.style.display = showYear && showGenre ? "block" : "none";
  });
}

function resetFilters() {
  document.getElementById("year-filter").value = "all";
  document.getElementById("genre-filter").value = "all";
  filterCombined(); // Réaffiche toutes les images
}

function displayImg(imgs) {
    const container = document.getElementById("container");
    if (!container) {
        console.error("L'élément 'container' n'existe pas dans le DOM.");
        return;
    }

    // Sélecteurs de la modale
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.querySelector(".close");

    // Ferme la modale
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

    // Création des images
    imgs.forEach(img => {
        // Wrapper
        const wrapper = document.createElement("div");
        wrapper.classList.add("img-wrapper");

        // Image
        const el = document.createElement("img");
        el.loading = "lazy";
        el.src = `https://drive.google.com/thumbnail?id=${img.id}&sz=w1000`;
        el.alt = img.alt;
        el.dataset.tag = img.tag;

        el.addEventListener("contextmenu", e => e.preventDefault());

        // Overlay (description)
        const overlay = document.createElement("div");
        overlay.classList.add("img-overlay");
        overlay.textContent = img.desc || "";

        // Clique sur image → ouvre la modale
        el.onclick = function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modalImg.addEventListener("contextmenu", e => e.preventDefault());
            document.body.classList.add("modal-open");
        };

        // Assemble
        wrapper.appendChild(el);
        wrapper.appendChild(overlay);
        container.appendChild(wrapper);
    });
}


let imgs = []; 

fetch('bdd.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur de chargement du fichier JSON');
    }
    return response.json();
  })
  .then(data => {
    imgs = data; // Assigne les données JSON à la variable imgs
    displayImg(imgs); // Appelle ta fonction pour afficher les images
  })
  .catch(error => {
    console.error('Erreur:', error);
  });
