const searchForm = document.querySelector("form");
const searchResultDiv = document.querySelector(".search-result");
const container = document.querySelector(".container");
let searchQuery = "";
const APP_ID = '33b1a0ef';
const APP_key = '5e12645236de1c7eb43b725fd06a49ee';

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = e.target.querySelector("input").value;
  fetchAPI();
});

async function fetchAPI() {
  const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_key}&from=0&to=100`;
  const response = await fetch(baseURL);
  const data = await response.json();
  generateHTML(data.hits);
}

function generateHTML(results) {
  container.classList.remove("initial");
  let generatedHTML = "";
  results.forEach(result => {
    generatedHTML += `
      <div class="item">
        <img src="${result.recipe.image}" alt="img">
        <div class="flex-container">
          <h1 class="title">${result.recipe.label}</h1>
          <a class="view-btn" target="_blank" href="${result.recipe.url}">View Recipe</a>
        </div>
        <p class="item-data">Calories: ${result.recipe.calories.toFixed(2)}</p>
        <p class="item-data">Diet label: ${
          result.recipe.dietLabels.length > 0 ? result.recipe.dietLabels : "No Data Found"
        }</p>
        <p class="item-data">Health labels: ${result.recipe.healthLabels.join(", ")}</p>
        <div class="interaction">
          <input type="text" class="comment-box" placeholder="Write a comment...">
          <button class="like-btn"> 👍 <span class="like-count">0</span></button>
          <div class="comments"></div>
        </div>
      </div>
    `;
  });
  searchResultDiv.innerHTML = generatedHTML;
  addInteractionListeners();
}

function addInteractionListeners() {
  const likeButtons = document.querySelectorAll(".like-btn");
  const commentBoxes = document.querySelectorAll(".comment-box");

  likeButtons.forEach(button => {
    button.addEventListener("click", () => {
      const likeCountSpan = button.querySelector(".like-count");
      let likeCount = parseInt(likeCountSpan.textContent);
      likeCount++;
      likeCountSpan.textContent = likeCount;
    });
  });

  commentBoxes.forEach(box => {
    box.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const commentText = box.value.trim();
        if (commentText !== "") {
          const commentsDiv = box.nextElementSibling.nextElementSibling;
          const comment = document.createElement("div");
          comment.classList.add("comment");
          comment.innerHTML = `
            <p>${commentText}</p>
            <button class="delete-comment">Delete</button>
          `;
          commentsDiv.appendChild(comment);
          box.value = "";
          addDeleteCommentListener(comment.querySelector(".delete-comment"));
        }
      }
    });
  });
}

function addDeleteCommentListener(button) {
  button.addEventListener("click", () => {
    button.parentElement.remove();
  });
}

// Event delegation for existing comments (in case of page reload or existing comments)
document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-comment");
  deleteButtons.forEach(button => {
    addDeleteCommentListener(button);
  });
});

// BMI Calculator functionality
document.getElementById("calculateBtn").addEventListener("click", () => {
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const age = parseFloat(document.getElementById("age").value);
  const gender = document.querySelector('input[name="gender"]:checked').value;

  if (weight && height && age && gender) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const bmiResult = document.getElementById("bmiResult");

    let bmiCategory = "";
    if (bmi < 18.5) {
      bmiCategory = "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      bmiCategory = "Normal weight";
    } else if (bmi >= 25 && bmi < 29.9) {
      bmiCategory = "Overweight";
    } else {
      bmiCategory = "Obese";
    }

    bmiResult.innerHTML = `
      <p>BMI: ${bmi.toFixed(2)}</p>
      <p>Category: ${bmiCategory}</p>
    `;
  } else {
    alert("Please fill in all fields.");
  }
});
