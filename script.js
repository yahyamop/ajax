const itemsArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];

function displayItems() {
    let itemsHtml = "";
    for (let i = 0; i < itemsArray.length; i++) {
        itemsHtml += `
            <div class="items">
                <div class="input-controller">
                    <textarea disabled>${itemsArray[i]}</textarea>
                    <div class="edit-controller">
                        <i class="fas fa-check deleteBtn"></i>
                        <i class="fas fa-pen editBtn"></i>
                    </div>
                </div>
                <div class="update-controller">
                    <button class="button saveBtn">Save</button>
                    <button class="button cancelBtn">Cancel</button>
                </div>
            </div>
        `;
    }
    document.querySelector(".to-do-list").innerHTML = itemsHtml;
    activateDeleteListeners();
    activateEditListeners();
    activateSaveListeners();
    activateCancelListeners();
}

function activateDeleteListeners() {
    let deleteBtns = document.querySelectorAll(".deleteBtn");
    deleteBtns.forEach((deleteBtn, i) => {
        deleteBtn.addEventListener("click", () => {
            deleteItem(i);
        });
    });
}

function activateEditListeners() {
    const editBtns = document.querySelectorAll(".editBtn");
    const updateControllers = document.querySelectorAll(".update-controller");
    const inputs = document.querySelectorAll(".input-controller textarea");

    editBtns.forEach((editBtn, i) => {
        editBtn.addEventListener("click", () => {
            updateControllers[i].style.display = "block";
            inputs[i].disabled = false;
        });
    });
}

function activateSaveListeners() {
    const saveBtns = document.querySelectorAll(".saveBtn");
    const inputs = document.querySelectorAll(".input-controller textarea");

    saveBtns.forEach((saveBtn, i) => {
        saveBtn.addEventListener("click", () => {
            updateItem(inputs[i].value, i);
        });
    });
}

function activateCancelListeners() {
    const cancelBtns = document.querySelectorAll(".cancelBtn");
    const updateControllers = document.querySelectorAll(".update-controller");
    const inputs = document.querySelectorAll(".input-controller textarea");

    cancelBtns.forEach((cancelBtn, i) => {
        cancelBtn.addEventListener("click", () => {
            // Set the textarea value back to the original value
            inputs[i].value = itemsArray[i];
            updateControllers[i].style.display = "none";
            inputs[i].disabled = true;
        });
    });
}

function updateItem(text, i) {
    itemsArray[i] = text;
    localStorage.setItem("items", JSON.stringify(itemsArray));
    displayItems();
}

function deleteItem(i) {
    itemsArray.splice(i, 1);
    localStorage.setItem("items", JSON.stringify(itemsArray));
    displayItems();
} 

function createItem(itemInput) {
    itemsArray.push(itemInput.value);
    localStorage.setItem("items", JSON.stringify(itemsArray));
    displayItems();
}

function displayDate() {
    let date = new Date();
    date = date.toDateString().split(" ");
    document.getElementById("date").textContent = `${date[1]} ${date[2]}, ${date[3]}`;
}

document.getElementById("enter").addEventListener("click", () => {
    const item = document.getElementById("itemInput");
    createItem(item);
});

window.onload = function() {
    displayDate();
    displayItems();

    // Check local storage for the theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
};

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-theme");

    // Save the current theme preference in local storage
    const currentTheme = body.classList.contains("dark-theme") ? "dark-theme" : "";
    localStorage.setItem("theme", currentTheme);
}

document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);
