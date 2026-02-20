// Sample robots data
const robots = [
    {
        id: 1,
        name: "SO-101 Robotic Arm",
        type: "arm",
        description: "Professional 6-DOF robotic arm perfect for robot training, research, and educational purposes. Features precise control and smooth movements ideal for learning robotics programming.",
        price: 89.99,
        listingType: "rent",
        deliveryOptions: ["pickup", "delivery"],
        emoji: "🦾"
    },
    {
        id: 2,
        name: "Unitree Go2 Quadruped",
        type: "quadruped",
        description: "Advanced quadruped robot with exceptional mobility and stability. Perfect for research, development, or commercial applications. Features advanced sensors and AI capabilities.",
        price: 199.99,
        listingType: "rent",
        deliveryOptions: ["pickup", "delivery"],
        emoji: "🐕"
    }
];

// State management
let currentUser = null;
let userRobots = [...robots];

// DOM Elements
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

// Modal functionality
function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

loginBtn.addEventListener('click', () => openModal(loginModal));
signupBtn.addEventListener('click', () => openModal(signupModal));

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        closeModal(modal);
    });
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Switch between login and signup
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    setTimeout(() => openModal(signupModal), 100);
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    setTimeout(() => openModal(loginModal), 100);
});

// Signup form handler
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // In a real app, this would send to a backend
    currentUser = { name, email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    alert(`Welcome to Robot Marketplace, ${name}!`);
    closeModal(signupModal);
    updateNavForUser();
    signupForm.reset();
});

// Login form handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // In a real app, this would verify with a backend
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        if (currentUser.email === email) {
            alert(`Welcome back, ${currentUser.name}!`);
            closeModal(loginModal);
            updateNavForUser();
            loginForm.reset();
            return;
        }
    }
    
    alert('Invalid credentials. Please sign up first.');
});

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateNavForUser();
    }
    
    // Load robots
    displayRobots();
});

// Update navigation for logged in user
function updateNavForUser() {
    if (currentUser) {
        loginBtn.textContent = currentUser.name;
        signupBtn.textContent = 'Logout';
        signupBtn.onclick = () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            loginBtn.textContent = 'Login';
            signupBtn.textContent = 'Sign Up';
            signupBtn.onclick = () => openModal(signupModal);
            alert('Logged out successfully!');
        };
    }
}

// Display robots
function displayRobots() {
    robotsGrid.innerHTML = '';
    
    userRobots.forEach(robot => {
        const robotCard = document.createElement('div');
        robotCard.className = 'robot-card';
        
        const deliveryText = robot.deliveryOptions.includes('delivery') && robot.deliveryOptions.includes('pickup')
            ? 'Pickup & Delivery'
            : robot.deliveryOptions.includes('delivery')
            ? 'Delivery Only'
            : 'Pickup Only';
        
        robotCard.innerHTML = `
            <div class="robot-image">
                ${robot.emoji}
            </div>
            <div class="robot-info">
                <div class="robot-header">
                    <h3 class="robot-name">${robot.name}</h3>
                    <span class="robot-badge badge-${robot.listingType}">${robot.listingType === 'rent' ? 'Rent' : 'Sell'}</span>
                </div>
                <p class="robot-description">${robot.description}</p>
                <div class="robot-features">
                    <span class="feature-tag">${robot.type}</span>
                    <span class="feature-tag">${deliveryText}</span>
                </div>
                <div class="robot-footer">
                    <div class="robot-price">
                        $${robot.price}<span>/${robot.listingType === 'rent' ? 'day' : 'total'}</span>
                    </div>
                    <button class="btn-rent" onclick="handleRentClick(${robot.id})">
                        ${robot.listingType === 'rent' ? 'Rent Now' : 'Buy Now'}
                    </button>
                </div>
            </div>
        `;
        
        robotsGrid.appendChild(robotCard);
    });
}

// Handle rent/buy button click
window.handleRentClick = function(robotId) {
    if (!currentUser) {
        alert('Please login or sign up to rent/buy robots!');
        openModal(loginModal);
        return;
    }
    
    const robot = userRobots.find(r => r.id === robotId);
    if (robot) {
        const action = robot.listingType === 'rent' ? 'rent' : 'purchase';
        alert(`Thank you for your interest in ${robot.name}! Your ${action} request has been submitted.`);
    }
};

// List robot form handler
listForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login or sign up to list a robot!');
        openModal(loginModal);
        return;
    }
    
    const robotName = document.getElementById('robotName').value;
    const robotType = document.getElementById('robotType').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const listingType = document.querySelector('input[name="listingType"]:checked').value;
    const deliveryOptions = Array.from(document.querySelectorAll('input[name="delivery"]:checked'))
        .map(cb => cb.value);
    
    // Get emoji based on type
    const emojiMap = {
        'arm': '🦾',
        'quadruped': '🐕',
        'drone': '🚁',
        'other': '🤖'
    };
    
    const newRobot = {
        id: userRobots.length + 1,
        name: robotName,
        type: robotType,
        description: description,
        price: price,
        listingType: listingType,
        deliveryOptions: deliveryOptions,
        emoji: emojiMap[robotType] || '🤖'
    };
    
    userRobots.push(newRobot);
    displayRobots();
    
    alert(`Your robot "${robotName}" has been listed successfully!`);
    listForm.reset();
    
    // Scroll to robots section
    document.getElementById('robots').scrollIntoView({ behavior: 'smooth' });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

