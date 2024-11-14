const apiKey = 'f9e131ab5d5d493b96cfb612a021b402';
const searchInput = document.getElementById('search');
const suggestionsDiv = document.getElementById('suggestions');
const recipeGrid = document.getElementById('recipe-grid');
const recipeModal = document.getElementById('recipe-modal');
const closeModal = document.getElementById('close-modal');
const addToFavoritesBtn = document.getElementById('add-to-favorites');
const recipeTitle = document.getElementById('recipe-title');
const recipeImage = document.getElementById('recipe-image');
const ingredientsList = document.getElementById('ingredients-list');
const instructionsList = document.getElementById('instructions-list');
const nutritionInfo = document.getElementById('nutrition-info');

let selectedRecipe = null;

async function fetchRecipes(query) {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}&number=10`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      displayRecipes(data.results);
    } else {
      recipeGrid.innerHTML = '<p>No recipes found. Please try a different search.</p>';
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    recipeGrid.innerHTML = '<p>There was an error fetching recipes. Please try again later.</p>';
  }
}

function displayRecipes(recipes) {
  recipeGrid.innerHTML = '';

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    const readyInMinutes = recipe.readyInMinutes !== undefined ? recipe.readyInMinutes : null;

    recipeCard.innerHTML = `
      <img src="https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg" alt="${recipe.title}">
      <div>
        <h3>${recipe.title}</h3>
        <p>${readyInMinutes ? `Ready in ${readyInMinutes} minutes` : 'Preparation time not available'}</p>
      </div>
    `;

    recipeCard.addEventListener('click', () => showRecipeDetails(recipe.id));
    recipeGrid.appendChild(recipeCard);
  });
}

async function showRecipeDetails(recipeId) {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
    const recipe = await response.json();
    selectedRecipe = recipe;

    recipeTitle.textContent = recipe.title;
    recipeImage.src = recipe.image;
    recipeImage.alt = recipe.title;

    ingredientsList.innerHTML = recipe.extendedIngredients.map(ingredient => `
      <li>${ingredient.amount} ${ingredient.unit} ${ingredient.name}</li>
    `).join('');

    instructionsList.innerHTML = recipe.instructions.split('\n').map(step => `<li>${step}</li>`).join('');

    nutritionInfo.innerHTML = `
      Calories: ${recipe.nutrition.nutrients.find(nutrient => nutrient.title === "Calories")?.amount || 'N/A'} kcal
      <br>Protein: ${recipe.nutrition.nutrients.find(nutrient => nutrient.title === "Protein")?.amount || 'N/A'} g
      <br>Fat: ${recipe.nutrition.nutrients.find(nutrient => nutrient.title === "Fat")?.amount || 'N/A'} g
    `;
    
    recipeModal.style.display = 'flex';
  } catch (error) {
    console.error('Error fetching recipe details:', error);
  }
}

closeModal.addEventListener('click', () => {
  recipeModal.style.display = 'none';
});

addToFavoritesBtn.addEventListener('click', () => {
  if (selectedRecipe) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(selectedRecipe);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Recipe added to favorites!');
  }
});

searchInput.addEventListener('input', async () => {
  const query = searchInput.value;
  if (query.length > 2) {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/autocomplete?query=${query}&apiKey=${apiKey}`);
      const data = await response.json();
      suggestionsDiv.innerHTML = data.map(suggestion => `
        <div onclick="searchInput.value = '${suggestion.title}'">${suggestion.title}</div>
      `).join('');
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
  } else {
    suggestionsDiv.innerHTML = '';
  }
});

fetchRecipes('pasta');
