async function loadMemberCards() {
  try {
    const response = await fetch("../data/members.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch members data: ${response.status}`);
    }

    const data = await response.json();

    if (
      !data.members ||
      !Array.isArray(data.members) ||
      data.members.length === 0
    ) {
      console.error("No members found in the JSON data");
      return;
    }
    const memberCardContainer = document.getElementById(
      "member-card-container"
    );

    memberCardContainer.innerHTML = "";

    const shuffledMembers = [...data.members].sort(() => 0.5 - Math.random());
    const selectedMembers = shuffledMembers.slice(0, 3);

    selectedMembers.forEach((member) => {
      const memberCard = document.createElement("div");

      let membershipClass = "bronze-member";
      if (member.membershipLevel === 2) {
        membershipClass = "silver-member";
      } else if (member.membershipLevel === 3) {
        membershipClass = "gold-member";
      }

      memberCard.className = `member-card ${membershipClass}`;

      let membershipLevelText = "Bronze Member";
      if (member.membershipLevel === 2) {
        membershipLevelText = "Silver Member";
      } else if (member.membershipLevel === 3) {
        membershipLevelText = "Gold Member";
      }

      memberCard.innerHTML = `
          <div id="card-header">
            <p>${member.name}</p>
            <p>${membershipLevelText}</p>
          </div>
          <div id="card-body">
            <img src="${member.image}" alt="${member.name} logo" id="card-icon">
            <div id="card-contact-info">
              <p>${member.address}</p>
              <p>${member.phone}</p>
              <p><a href="${member.website}" target="_blank">${member.website}</a></p>
            </div>
          </div>
        `;
      memberCardContainer.appendChild(memberCard);
    });
  } catch (error) {
    console.error("Error loading member data:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadMemberCards();
  document.getElementById("current-year").textContent =
    new Date().getFullYear();
  document.getElementById(
    "last-modified"
  ).textContent = `Last Modified: ${document.lastModified}`;
});
