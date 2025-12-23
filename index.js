import { BouncingDVDLogo } from "./Module/BouncingDVDLogo.js";

const container = document.getElementById('container');
const logo1 = new BouncingDVDLogo(container, 100, 50, 2);
const logo2 = new BouncingDVDLogo(container, 100, 50, 2);

const posLogo1 = document.getElementById('pos-logo1');
const posLogo2 = document.getElementById('pos-logo2');
const probDisplay = document.getElementById('collision-prob');

// Ensure they don't spawn overlapping
let attempts = 0;
while (isOverlapping(logo1, logo2) && attempts < 10) {
    logo2.reset();
    attempts++;
}

const animate = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    logo1.update(width, height);
    logo2.update(width, height);
    
    handleCollision(logo1, logo2, width, height);

    logo1.draw();
    logo2.draw();

    updateStats();

    window.requestAnimationFrame(animate)
}

function updateStats() {
    // Update Positions
    posLogo1.textContent = `x: ${Math.round(logo1.x)}, y: ${Math.round(logo1.y)}`;
    posLogo2.textContent = `x: ${Math.round(logo2.x)}, y: ${Math.round(logo2.y)}`;

    // Calculate Collision Probability
    // Simple heuristic: based on distance
    const c1 = { x: logo1.x + logo1.width / 2, y: logo1.y + logo1.height / 2 };
    const c2 = { x: logo2.x + logo2.width / 2, y: logo2.y + logo2.height / 2 };
    
    const dist = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2));
    const maxDist = 400; // Distance at which probability is 0%
    const minDist = logo1.width; // Approx distance at collision

    let prob = 0;
    if (dist < minDist) {
        prob = 100;
    } else if (dist < maxDist) {
        prob = ((maxDist - dist) / (maxDist - minDist)) * 100;
    }

    probDisplay.textContent = `${Math.round(prob)}%`;
    
    // Color code the probability
    if (prob > 75) probDisplay.style.color = '#ff4444';
    else if (prob > 40) probDisplay.style.color = '#ffbb33';
    else probDisplay.style.color = '#00C851';
}

function isOverlapping(p1, p2) {
    return (p1.x < p2.x + p2.width &&
            p1.x + p1.width > p2.x &&
            p1.y < p2.y + p2.height &&
            p1.y + p1.height > p2.y);
}

function handleCollision(p1, p2, containerWidth, containerHeight) {
    if (isOverlapping(p1, p2)) {
        const overlapX = Math.min(p1.x + p1.width, p2.x + p2.width) - Math.max(p1.x, p2.x);
        const overlapY = Math.min(p1.y + p1.height, p2.y + p2.height) - Math.max(p1.y, p2.y);

        // Positional correction: push them apart
        if (overlapX < overlapY) {
            const separation = overlapX / 2;
            if (p1.x < p2.x) {
                p1.x -= separation;
                p2.x += separation;
            } else {
                p1.x += separation;
                p2.x -= separation;
            }
            
            // Velocity swap
            let temp = p1.dx;
            p1.dx = p2.dx;
            p2.dx = temp;
        } else {
            const separation = overlapY / 2;
            if (p1.y < p2.y) {
                p1.y -= separation;
                p2.y += separation;
            } else {
                p1.y += separation;
                p2.y -= separation;
            }

            // Velocity swap
            let temp = p1.dy;
            p1.dy = p2.dy;
            p2.dy = temp;
        }

        // Clamp to bounds after separation to prevent sticking to walls
        if (p1.x < 0) p1.x = 0;
        if (p1.x > containerWidth - p1.width) p1.x = containerWidth - p1.width;
        if (p1.y < 0) p1.y = 0;
        if (p1.y > containerHeight - p1.height) p1.y = containerHeight - p1.height;

        if (p2.x < 0) p2.x = 0;
        if (p2.x > containerWidth - p2.width) p2.x = containerWidth - p2.width;
        if (p2.y < 0) p2.y = 0;
        if (p2.y > containerHeight - p2.height) p2.y = containerHeight - p2.height;

        p1.changeColor();
        p2.changeColor();
    }
}

animate();