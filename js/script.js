"use strict";

const monsterInput = document.getElementById("monsterInput");
const searchButton = document.getElementById("searchButton");
const monsterResult = document.getElementById("monsterResult");

searchButton.addEventListener("click", () => {
  const monsterName = monsterInput.value.toLowerCase();
  if (monsterName) {
    searchMonster(monsterName);
  } else {
    monsterResult.innerHTML = "Please enter a monster name.";
  }
});

function searchMonster(monsterName) {
  monsterResult.innerHTML = "Searching...";

  axios
    .get(`https://www.dnd5eapi.co/api/monsters`)
    .then((response) => {
      const monsters = response.data.results;
      const matchedMonster = monsters.find(
        (monster) => monster.name.toLowerCase() === monsterName
      );

      if (matchedMonster) {
        axios
          .get(`https://www.dnd5eapi.co${matchedMonster.url}`)
          .then((monsterResponse) => {
            const monsterData = monsterResponse.data;
            monsterResult.innerHTML = `
              <h2>${monsterData.name}</h2>
              <p><strong>Index:</strong> ${monsterData.index}</p>
              <!-- You can display more monster details here -->
            `;
          })
          .catch((error) => {
            monsterResult.innerHTML = "Error fetching monster details.";
          });
      } else {
        monsterResult.innerHTML = "Monster not found.";
      }
    })
    .catch((error) => {
      monsterResult.innerHTML = "Error fetching monsters.";
    });
}
async function fetchMonsters() {
  try {
    const response = await fetch("https://www.dnd5eapi.co/api/monsters");
    const data = await response.json();
    const monsterSelect = document.getElementById("monsterSelect");

    data.results.forEach((monster) => {
      const option = document.createElement("option");
      option.value = monster.index;
      option.textContent = monster.name;
      monsterSelect.appendChild(option);
    });

    monsterSelect.addEventListener("change", () => {
      const selectedMonster = monsterSelect.value;
      if (selectedMonster) {
        fetchMonsterDetails(selectedMonster);
      } else {
        document.getElementById("monsterInfo").innerHTML = "";
      }
    });
  } catch (error) {
    console.error("Error fetching monsters:", error);
  }
}

async function fetchMonsterDetails(monsterIndex) {
  try {
    const response = await fetch(
      `https://www.dnd5eapi.co/api/monsters/${monsterIndex}`
    );
    const monster = await response.json();
    displayMonsterDetails(monster);
  } catch (error) {
    console.error("Error fetching monster details:", error);
  }
}

function displayMonsterDetails(monster) {
  const monsterInfo = document.getElementById("monsterInfo");
  monsterInfo.innerHTML = `
      <div class="card">
          <div class="wrapper">
              <img src="${
                monster.image
                  ? "https://www.dnd5eapi.co" + monster.image
                  : "https://via.placeholder.com/200x300"
              }" class="cover-image" />
          </div>
          <div class="details">
              <h2 class="title">${monster.name}</h2>
              <p><strong>Size:</strong> ${monster.size}</p>
              <p><strong>Type:</strong> ${monster.type}</p>
              <p><strong>Alignment:</strong> ${monster.alignment}</p>
              <p><strong>Armor Class:</strong> ${monster.armor_class
                .map((ac) => `${ac.value} (${ac.type})`)
                .join(", ")}</p>
              <p><strong>Hit Points:</strong> ${monster.hit_points} (${
    monster.hit_dice
  })</p>
              <p><strong>Speed:</strong> ${Object.entries(monster.speed)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")}</p>
              <p><strong>Abilities:</strong> STR: ${monster.strength}, DEX: ${
    monster.dexterity
  }, CON: ${monster.constitution}, INT: ${monster.intelligence}, WIS: ${
    monster.wisdom
  }, CHA: ${monster.charisma}</p>
              <p><strong>Proficiencies:</strong> ${monster.proficiencies
                .map((prof) => `${prof.proficiency.name}: +${prof.value}`)
                .join(", ")}</p>
              <p><strong>Damage Immunities:</strong> ${
                monster.damage_immunities.join(", ") || "None"
              }</p>
              <p><strong>Senses:</strong> ${Object.entries(monster.senses)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")}</p>
              <p><strong>Languages:</strong> ${monster.languages}</p>
              <p><strong>Challenge Rating:</strong> ${
                monster.challenge_rating
              }</p>
              <p><strong>XP:</strong> ${monster.xp}</p>
              <p><strong>Special Abilities:</strong> ${monster.special_abilities
                .map(
                  (ability) =>
                    `<strong>${ability.name}:</strong> ${ability.desc}`
                )
                .join("<br>")}</p>
              <p><strong>Actions:</strong> ${monster.actions
                .map(
                  (action) => `<strong>${action.name}:</strong> ${action.desc}`
                )
                .join("<br>")}</p>
              <p><strong>Legendary Actions:</strong> ${
                monster.legendary_actions
                  ? monster.legendary_actions
                      .map(
                        (action) =>
                          `<strong>${action.name}:</strong> ${action.desc}`
                      )
                      .join("<br>")
                  : "None"
              }</p>
          </div>
      </div>
  `;
}

document.addEventListener("DOMContentLoaded", fetchMonsters);
