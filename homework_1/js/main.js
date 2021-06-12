const BASE_URL = `http://localhost:3000/api/v1`

const Post = {
    index(){
        return fetch(`${BASE_URL}/posts`)
        .then(res => {
            console.log(res)
            return res.json()
        })
    },

    create(params){
        return fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then((res) => res.json())
    },

    show(id){
        return fetch(`${BASE_URL}/posts/${id}`)
        .then(res => res.json())
    },

    update(id, params){
        return fetch(`${BASE_URL}/posts/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(res => res.json())
    }
}

// Index Posts
function loadPosts(){
    Post.index()
        .then(posts => {
            const postsContainer = document.querySelector('ul.post-list')
            postsContainer.innerHTML = posts.map(p => {
                return `
                <li>
                <a class="post-link" data-id="${p.id}" href="">
                ${p.id} - ${p.title}
                </li>
                `
            }).join('');
        })
}

loadPosts()

// Add a New Post
const newPostForm = document.querySelector('#new-post-form')
newPostForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget
    const formData = new FormData(form)
    const newPostParams = {
        title: formData.get('title'),
        body: formData.get('body'),
    }
    
    Post.create(newPostParams)
    .then(data => {
            renderPostShow(data.id)
    })
})

// Display post
const postsContainer = document.querySelector('ul.post-list')
postsContainer.addEventListener('click', (event) => {
    event.preventDefault()
    const postElement = event.target
    if(postElement.matches('a.post-link')){
        const postId = event.target.dataset.id
        renderPostShow(postId)
    }
})

function renderPostShow(id){
    const showPage = document.querySelector('.page#post-show')
    post.show(id)
    .then(post => {
        const postHTML = `
        <div class="card">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        </div>
        `
        showPage.innerHTML = postHTML
        navigateTo('post-show')
    })
}

// Navigation
function navigateTo(id){
    document.querySelectorAll('.page').forEach(node => {
        node.classList.remove('active')
    })
    document.querySelector(`.page#${id}`).classList.add('active')
}

// Navbar
const addNavbar = document.querySelector('nav.navbar')
addNavbar.addEventListener('click', (event) => {
    event.preventDefault()
    const node = event.target
    const page = node.dataset.target
    if (page){
        navigateTo(page)
    }
})