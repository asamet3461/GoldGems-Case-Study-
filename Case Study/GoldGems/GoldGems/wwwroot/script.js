const colorNames = {
    gold: "Yellow Gold",
    white: "White Gold",
    rose: "Rose Gold"
};

const colorCodes = {
    gold: "#E6CA97",
    white: "#D9D9D9",
    rose: "#E1A4A9"
};

// Returns star icons based on rating
function getStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += i <= Math.floor(rating) ? "★" : "☆";
    }
    return stars;
}

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");

    fetch("/api/products")
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch data.");
            return response.json();
        })
        .then(products => {
            if (!products.length) {
                productList.innerHTML = "<p>No products found.</p>";
                return;
            }

            products.forEach(product => {
                // Fill missing colors with fallback image
                const defaultImage = Object.values(product.images)[0];
                ['gold', 'white', 'rose'].forEach(color => {
                    if (!product.images[color]) {
                        product.images[color] = defaultImage;
                    }
                });

                const colorKeys = ['gold', 'white', 'rose'];
                const firstColor = colorKeys[0];
                const firstImg = product.images[firstColor];

                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
                    <img class="product-image" src="${firstImg}" alt="${product.name}">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">$${product.price.toFixed(2)} USD</div>
                    <div class="color-picker">
                        ${colorKeys.map((c, i) => `
                            <span class="color-dot${i === 0 ? " selected" : ""}"
                                  style="background:${colorCodes[c]}"
                                  data-color="${c}"
                                  data-img="${product.images[c]}"></span>`
                ).join("")}
                    </div>
                    <div class="color-label">${colorNames[firstColor]}</div>
                    <div class="rating-row">
                        <span class="stars">${getStars(product.popularityOutOfFive)}</span>
                        <span class="rating-text">${product.popularityOutOfFive.toFixed(1)}/5</span>
                    </div>
                `;

                const dots = card.querySelectorAll(".color-dot");
                const label = card.querySelector(".color-label");
                const img = card.querySelector(".product-image");

                colorKeys.forEach((c, i) => {
                    dots[i].addEventListener("click", () => {
                        dots.forEach(d => d.classList.remove("selected"));
                        dots[i].classList.add("selected");
                        label.textContent = colorNames[c];
                        img.src = product.images[c];
                    });
                });

                productList.appendChild(card);
            });

            setupCarouselArrows();
        })
        .catch(error => {
            productList.innerHTML = `<p style="color:red">Failed to load data: ${error.message}</p>`;
        });
});

// Horizontal scroll arrow logic for carousel
function setupCarouselArrows() {
    const container = document.querySelector(".carousel-container");
    const list = document.getElementById("product-list");
    const left = container.querySelector(".arrow-left");
    const right = container.querySelector(".arrow-right");
    const scrollAmount = 360;

    function updateArrows() {
        left.disabled = list.scrollLeft <= 10;
        right.disabled = list.scrollLeft + list.offsetWidth >= list.scrollWidth - 10;
    }

    left.addEventListener("click", () => {
        list.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        setTimeout(updateArrows, 350);
    });

    right.addEventListener("click", () => {
        list.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setTimeout(updateArrows, 350);
    });

    list.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    setTimeout(updateArrows, 250);
}
