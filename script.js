const robots = [
    {
        id: 1,
        name: "SO-101 Robotic Arm",
        type: "Robotic Arm",
        description: "Professional 6-DOF robotic arm for robot training, research, and education. Precise servo control and smooth articulation — ideal for learning manipulation tasks.",
        price: 89.99,
        listingType: "rent",
        deliveryOptions: ["pickup", "delivery"],
        imageUrl: "assets/so101-arm.png"
    },
    {
        id: 2,
        name: "Unitree Go2",
        type: "Quadruped",
        description: "Advanced quadruped robot with exceptional mobility and stability. Equipped with sensors and AI capabilities for research, development, and commercial use.",
        price: 199.99,
        listingType: "rent",
        deliveryOptions: ["pickup", "delivery"],
        imageUrl: "assets/unitree-go2.png"
    }
];

let currentUser = null;
let userRobots = [...robots];

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const listForm = document.getElementById('listForm');
const robotsGrid = document.getElementById('robotsGrid');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

function openModal(modal) { modal.classList.add('active'); }
function closeModal(modal) { modal.classList.remove('active'); }

loginBtn.addEventListener('click', () => openModal(loginModal));
signupBtn.addEventListener('click', () => openModal(signupModal));

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal-backdrop')));
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) closeModal(e.target);
});

switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    setTimeout(() => openModal(signupModal), 120);
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    setTimeout(() => openModal(loginModal), 120);
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) { alert('Passwords do not match.'); return; }

    currentUser = { name, email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert(`Welcome, ${name}!`);
    closeModal(signupModal);
    updateNavForUser();
    signupForm.reset();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const stored = localStorage.getItem('currentUser');
    if (stored) {
        currentUser = JSON.parse(stored);
        if (currentUser.email === email) {
            alert(`Welcome back, ${currentUser.name}!`);
            closeModal(loginModal);
            updateNavForUser();
            loginForm.reset();
            return;
        }
    }
    alert('No account found. Please sign up first.');
});

window.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('currentUser');
    if (stored) { currentUser = JSON.parse(stored); updateNavForUser(); }
    displayRobots();
});

function updateNavForUser() {
    if (!currentUser) return;
    loginBtn.textContent = currentUser.name;
    loginBtn.classList.remove('btn-outline');
    loginBtn.classList.add('btn-dark');
    signupBtn.textContent = 'Log out';
    signupBtn.classList.remove('btn-dark');
    signupBtn.classList.add('btn-outline');
    signupBtn.onclick = () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        loginBtn.textContent = 'Log in';
        loginBtn.classList.remove('btn-dark');
        loginBtn.classList.add('btn-outline');
        signupBtn.textContent = 'Sign up';
        signupBtn.classList.remove('btn-outline');
        signupBtn.classList.add('btn-dark');
        signupBtn.onclick = () => openModal(signupModal);
    };
}

function displayRobots() {
    robotsGrid.innerHTML = '';

    userRobots.forEach(robot => {
        const delivery = robot.deliveryOptions.includes('delivery') && robot.deliveryOptions.includes('pickup')
            ? 'Pickup & Delivery'
            : robot.deliveryOptions.includes('delivery') ? 'Delivery' : 'Pickup';

        const imgHTML = robot.imageUrl
            ? `<img src="${robot.imageUrl}" alt="${robot.name}">`
            : `<span class="card-img-emoji">${robot.emoji || '🤖'}</span>`;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img">${imgHTML}</div>
            <div class="card-body">
                <h3 class="card-title">${robot.name}</h3>
                <p class="card-desc">${robot.description}</p>
                <div class="card-details">
                    <div class="card-detail">
                        <span class="card-detail-label">Price</span>
                        <span class="card-detail-value">$${robot.price}/${robot.listingType === 'rent' ? 'day' : ''}</span>
                    </div>
                    <div class="card-detail">
                        <span class="card-detail-label">Type</span>
                        <span class="card-detail-value">${robot.type}</span>
                    </div>
                    <div class="card-detail">
                        <span class="card-detail-label">Fulfillment</span>
                        <span class="card-detail-value">${delivery}</span>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-dark btn-full" onclick="handleRentClick(${robot.id})">
                    ${robot.listingType === 'rent' ? 'Rent this robot' : 'Buy this robot'}
                </button>
            </div>
        `;
        robotsGrid.appendChild(card);
    });
}

window.handleRentClick = function(robotId) {
    if (!currentUser) {
        alert('Please log in or sign up first.');
        openModal(loginModal);
        return;
    }
    const robot = userRobots.find(r => r.id === robotId);
    if (robot) {
        alert(`Request submitted for ${robot.name}! We'll be in touch.`);
    }
};

listForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!currentUser) {
        alert('Please log in or sign up to list a robot.');
        openModal(loginModal);
        return;
    }

    const robotName = document.getElementById('robotName').value;
    const robotType = document.getElementById('robotType').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const listingType = document.querySelector('input[name="listingType"]:checked').value;
    const deliveryOptions = Array.from(document.querySelectorAll('input[name="delivery"]:checked')).map(c => c.value);

    const typeLabels = { arm: 'Robotic Arm', quadruped: 'Quadruped', drone: 'Drone', other: 'Other' };

    userRobots.push({
        id: userRobots.length + 1,
        name: robotName,
        type: typeLabels[robotType] || robotType,
        description,
        price,
        listingType,
        deliveryOptions,
        imageUrl: null,
        emoji: '🤖'
    });

    displayRobots();
    alert(`"${robotName}" is now listed!`);
    listForm.reset();
    document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
