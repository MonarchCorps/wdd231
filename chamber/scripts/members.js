const LEVEL_LABELS = { 1: "Member", 2: "Silver", 3: "Gold" };
const LEVEL_CLASSES = { 1: "badge-member", 2: "badge-silver", 3: "badge-gold" };

async function getMembers() {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error(`Failed to load members: ${response.status}`);
    return response.json();
}

function buildGridCard(member) {
    const levelLabel = LEVEL_LABELS[member.membershipLevel] ?? "Member";
    const levelClass = LEVEL_CLASSES[member.membershipLevel] ?? "badge-member";

    const article = document.createElement("article");
    article.className = "member-card";
    article.setAttribute("role", "listitem");

    article.innerHTML = `
        <div class="card-image-wrap">
            <img src="images/${member.image}" alt="${member.name} business photo"
                 width="400" height="225" loading="lazy">
        </div>
        <div class="card-body">
            <div class="card-header">
                <h2 class="card-name">${member.name}</h2>
                <span class="membership-badge ${levelClass}">${levelLabel}</span>
            </div>
            <p class="card-tagline">${member.tagline}</p>
            <div class="card-details">
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Web:</strong>
                    <a href="${member.website}" target="_blank" rel="noopener noreferrer">
                        ${member.website.replace(/^https?:\/\//, "")}
                    </a>
                </p>
            </div>
        </div>`;

    const img = article.querySelector(".card-image-wrap img");
    if (img) img.onerror = () => { img.closest(".card-image-wrap").style.display = "none"; };

    return article;
}

function buildListItem(member) {
    const levelLabel = LEVEL_LABELS[member.membershipLevel] ?? "Member";
    const levelClass = LEVEL_CLASSES[member.membershipLevel] ?? "badge-member";

    const div = document.createElement("div");
    div.className = "member-list-item";
    div.setAttribute("role", "listitem");

    div.innerHTML = `
        <span class="list-name">${member.name}</span>
        <span class="list-phone">${member.phone}</span>
        <a class="list-url" href="${member.website}" target="_blank" rel="noopener noreferrer">
            ${member.website.replace(/^https?:\/\//, "")}
        </a>
        <span class="membership-badge list-badge ${levelClass}">${levelLabel}</span>`;

    return div;
}

function renderMembers(members, view) {
    const container = document.getElementById("members-container");
    container.innerHTML = "";

    if (view === "grid") {
        container.className = "members-grid";
        container.setAttribute("aria-label", "Chamber members – grid view");
        members.forEach(m => container.appendChild(buildGridCard(m)));
    } else {
        container.className = "members-list";
        container.setAttribute("aria-label", "Chamber members – list view");
        members.forEach(m => container.appendChild(buildListItem(m)));
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const gridBtn = document.getElementById("gridBtn");
    const listBtn = document.getElementById("listBtn");

    let members = [];
    let currentView = "grid";

    try {
        members = await getMembers();
        renderMembers(members, currentView);
    } catch (err) {
        document.getElementById("members-container").innerHTML =
            `<p style="padding:16px;color:red;">Could not load member data. ${err.message}</p>`;
        return;
    }

    gridBtn.addEventListener("click", () => {
        if (currentView === "grid") return;
        currentView = "grid";
        gridBtn.classList.add("active");
        gridBtn.setAttribute("aria-pressed", "true");
        listBtn.classList.remove("active");
        listBtn.setAttribute("aria-pressed", "false");
        renderMembers(members, "grid");
    });

    listBtn.addEventListener("click", () => {
        if (currentView === "list") return;
        currentView = "list";
        listBtn.classList.add("active");
        listBtn.setAttribute("aria-pressed", "true");
        gridBtn.classList.remove("active");
        gridBtn.setAttribute("aria-pressed", "false");
        renderMembers(members, "list");
    });
});
