// JavaScript code

const postsArray = [];

function displayPosts() {
    const postsHtml = postsArray.map((post, index) => createPostHtml(post, index)).join('');
    document.querySelector(".to-do-list").innerHTML = postsHtml;
    activateListeners();
}

function createPostHtml(post, index) {
    return `
        <div class="post">
            <div class="post-info">
                <h2>${post.title}</h2>
                <p>Author: ${post.author}</p>
            </div>
            <div class="input-controller">
                <textarea disabled>${post.content}</textarea>
                <div class="edit-controller">
                    <i class="fas fa-check deleteBtn" data-index="${index}"></i>
                    <i class="fas fa-pen editBtn" data-index="${index}"></i>
                </div>
            </div>
            <div class="update-controller">
                <button class="button saveBtn" data-index="${index}">Save</button>
                <button class="button cancelBtn" data-index="${index}">Cancel</button>
            </div>
        </div>
    `;
}

async function fetchPostsFromAPI() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const postsFromAPI = await response.json();

        postsArray.push(...formatPostsFromAPI(postsFromAPI));

        localStorage.setItem("posts", JSON.stringify(postsArray));
    } catch (error) {
        console.error('Error fetching posts from API:', error);
    }
}

function formatPostsFromAPI(apiPosts) {
    return apiPosts.map(apiPost => ({
        title: apiPost.title,
        author: `User ${apiPost.userId}`, // Adjust based on your requirements
        content: apiPost.body
    }));
}

function activateListeners() {
    document.querySelectorAll(".deleteBtn").forEach(deleteBtn => {
        deleteBtn.addEventListener("click", () => {
            deletePost(deleteBtn.dataset.index);
        });
    });

    document.querySelectorAll(".editBtn").forEach(editBtn => {
        editBtn.addEventListener("click", () => {
            openEditModal(editBtn.dataset.index);
        });
    });

    document.querySelectorAll(".saveBtn").forEach(saveBtn => {
        saveBtn.addEventListener("click", () => {
            saveEditPost(saveBtn.dataset.index);
        });
    });

    document.querySelectorAll(".cancelBtn").forEach(cancelBtn => {
        cancelBtn.addEventListener("click", () => {
            cancelEditModal();
        });
    });
}

document.getElementById("openModalBtn").addEventListener("click", () => {
    const modal = document.getElementById("postModal");
    modal.style.display = "block";
});

document.querySelector(".close").addEventListener("click", () => {
    const modal = document.getElementById("postModal");
    modal.style.display = "none";
});

document.getElementById("postBtn").addEventListener("click", () => {
    const postInput = document.getElementById("postInput");
    const postTitle = document.getElementById("postTitle");
    const postAuthor = document.getElementById("postAuthor");
    createPost(postTitle, postAuthor, postInput);
    const modal = document.getElementById("postModal");
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    const modal = document.getElementById("postModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

function createPost(titleInput, authorInput, contentInput) {
    const title = titleInput.value.trim();
    const author = authorInput.value;
    const content = contentInput.value.trim();

    if (title === '' || author === '' || content === '') {
        alert('Please fill in all fields.');
        return;
    }

    const newPost = {
        title: title,
        author: author,
        content: content,
    };

    postsArray.push(newPost);
    localStorage.setItem("posts", JSON.stringify(postsArray));
    displayPosts();

    titleInput.value = '';
    authorInput.value = '';
    contentInput.value = '';
}

function deletePost(index) {
    postsArray.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(postsArray));
    displayPosts();
}

function updatePost(text, index) {
    postsArray[index].content = text;
    localStorage.setItem("posts", JSON.stringify(postsArray));
    displayPosts();
}

function openEditModal(index) {
    const editModal = document.getElementById("editModal");
    const editTitleInput = document.getElementById("editTitle");
    const editContentInput = document.getElementById("editContent");

    editTitleInput.value = postsArray[index].title;
    editContentInput.value = postsArray[index].content;

    editModal.dataset.editIndex = index;
    editModal.style.display = "block";
}

function saveEditPost(index) {
    const editTitleInput = document.getElementById("editTitle");
    const editContentInput = document.getElementById("editContent");

    postsArray[index].title = editTitleInput.value;
    postsArray[index].content = editContentInput.value;

    localStorage.setItem("posts", JSON.stringify(postsArray));
    displayPosts();
}

function cancelEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
}

function displayDate() {
    const date = new Date();
    const formattedDate = `${date.toDateString().split(" ")[1]} ${date.getDate()}, ${date.getFullYear()}`;
    document.getElementById("date").textContent = formattedDate;
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-theme");

    const currentTheme = body.classList.contains("dark-theme") ? "dark-theme" : "";
    localStorage.setItem("theme", currentTheme);

    const posts = document.querySelectorAll(".post-info h2, .post-info p");
    posts.forEach(post => {
        post.style.color = body.classList.contains("dark-theme") ? "#fff" : "#000";
    });
}

document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);

window.onload = async function () {
    displayDate();
    await fetchPostsFromAPI();
    displayPosts();

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }

    activateListeners();
};