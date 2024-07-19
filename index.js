document.addEventListener('DOMContentLoaded', () => {
    fetchToys();
    setupForm();
});

function fetchToys() {
    fetch('http://localhost:3000/toys')
        .then(response => response.json())
        .then(toys => {
            const toyCollection = document.getElementById('toy-collection');
            toys.forEach(toy => {
                const toyCard = createToyCard(toy);
                toyCollection.appendChild(toyCard);
            });
        });
}

function createToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    card.querySelector('.like-btn').addEventListener('click', () => {
        likeToy(toy);
    });
    return card;
}

function setupForm() {
    const form = document.getElementById('add-toy-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const image = event.target.image.value;
        const toy = { name, image, likes: 0 };
        addToy(toy);
        form.reset();
    });
}

function addToy(toy) {
    fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(toy)
    })
    .then(response => response.json())
    .then(newToy => {
        const toyCollection = document.getElementById('toy-collection');
        const toyCard = createToyCard(newToy);
        toyCollection.appendChild(toyCard);
    });
}

function likeToy(toy) {
    const newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
        const toyCard = document.getElementById(toy.id).parentElement;
        toyCard.querySelector('p').textContent = `${updatedToy.likes} Likes`;
    });
}
