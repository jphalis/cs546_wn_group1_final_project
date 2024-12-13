function renderStars(overallDifficulty) {
  const fullStars = Math.floor(overallDifficulty);
  const halfStar = overallDifficulty % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let starsHtml = "";

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<span class="star full">&#9733;</span>'; 
  }

  // Add half star if applicable
  if (halfStar) {
    starsHtml += '<span class="star half">&#9733;</span>';
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<span class="star empty">&#9734;</span>';
  }

  return starsHtml;
}


document.addEventListener("DOMContentLoaded", () => {
  const starContainers = document.querySelectorAll(".star-rating");
  starContainers.forEach(container => {
    const overallDifficulty = parseFloat(container.dataset.difficulty);
    container.innerHTML = renderStars(overallDifficulty);
  });
});
