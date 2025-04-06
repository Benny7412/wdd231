const gridBtn = document.getElementById("grid-btn");
const listBtn = document.getElementById("list-btn");
const directoryContainer = document.getElementById("directory-container");

gridBtn.addEventListener("click", () => {
  directoryContainer.classList.add("grid");
  directoryContainer.classList.remove("list");
  gridBtn.classList.add("active");
  listBtn.classList.remove("active");
});

listBtn.addEventListener("click", () => {
  directoryContainer.classList.add("list");
  directoryContainer.classList.remove("grid");
  listBtn.classList.add("active");
  gridBtn.classList.remove("active");
});

async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error("Failed to fetch members data");
    }
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    console.error("Error loading members data:", error);
    directoryContainer.innerHTML =
      '<p class="error-message">Failed to load member data. Please try again later.</p>';
  }
}

function displayMembers(members) {
  directoryContainer.innerHTML = "";

  members.forEach((member) => {
    const memberCard = document.createElement("div");
    memberCard.classList.add("member-card");

    memberCard.classList.add(`membership-level-${member.membershipLevel}`);
    let membershipBadge = "";
    if (member.membershipLevel === 3) {
      membershipBadge = '<span class="badge gold">Gold Member</span>';
    } else if (member.membershipLevel === 2) {
      membershipBadge = '<span class="badge silver">Silver Member</span>';
    } else {
      membershipBadge = '<span class="badge">Member</span>';
    }
    memberCard.innerHTML = `
            <img src="${member.image}" alt="${member.name}" class="member-image">
            <div class="member-info">
                <h3>${member.name} ${membershipBadge}</h3>
                <p>${member.description}</p>
                <hr>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
            </div>
        `;
    directoryContainer.appendChild(memberCard);
  });
}

document.getElementById("current-year").textContent = new Date().getFullYear();
document.getElementById(
  "last-modified"
).textContent = `Last Modified: ${document.lastModified}`;

getMembers();

const gridBtn = document.getElementById("grid-btn");
const listBtn = document.getElementById("list-btn");
const directoryContainer = document.getElementById("directory-container");

gridBtn.addEventListener("click", () => {
  directoryContainer.classList.add("grid");
  directoryContainer.classList.remove("list");
  gridBtn.classList.add("active");
  listBtn.classList.remove("active");
});

listBtn.addEventListener("click", () => {
  directoryContainer.classList.add("list");
  directoryContainer.classList.remove("grid");
  listBtn.classList.add("active");
  gridBtn.classList.remove("active");
});

async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error("Failed to fetch members data");
    }
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    console.error("Error loading members data:", error);
    directoryContainer.innerHTML =
      '<p class="error-message">Failed to load member data. Please try again later.</p>';
  }
}

function displayMembers(members) {
  directoryContainer.innerHTML = "";

  members.forEach((member) => {
    const memberCard = document.createElement("div");
    memberCard.classList.add("member-card");

    memberCard.classList.add(`membership-level-${member.membershipLevel}`);
    let membershipBadge = "";
    if (member.membershipLevel === 3) {
      membershipBadge = '<span class="badge gold">Gold Member</span>';
    } else if (member.membershipLevel === 2) {
      membershipBadge = '<span class="badge silver">Silver Member</span>';
    } else {
      membershipBadge = '<span class="badge">Member</span>';
    }
    memberCard.innerHTML = `
            <img src="${member.image}" alt="${member.name}" class="member-image">
            <div class="member-info">
                <h3>${member.name} ${membershipBadge}</h3>
                <p>${member.description}</p>
                <hr>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
            </div>
        `;
    directoryContainer.appendChild(memberCard);
  });
}

document.getElementById("current-year").textContent = new Date().getFullYear();
document.getElementById(
  "last-modified"
).textContent = `Last Modified: ${document.lastModified}`;

getMembers();
