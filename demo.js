// ==========================================
// TACTICAL FLOOR PLAN DEMONSTRATION
// ==========================================

// 1. Grab all the HTML elements we need to control
const canvas = document.getElementById('floorPlanCanvas');
const ctx = canvas.getContext('2d');
const toggle = document.getElementById('demoToggle');
const modeLabel = document.getElementById('demo-mode-label');
const triggerBtn = document.getElementById('btn-trigger-lock');
const terminal = document.getElementById('demo-terminal');

// 2. Define the State (The "Brain" of the simulation)
let isSmartMode = false;
let particles = []; // This will hold our Sonar swarm 
let threatMapped = false; // Tells the system when to draw the red laser line

// 3. Define the physical coordinates on the map (X, Y)
const userPos = { x: 160, y: 200 };      // Kitchen (Right side)
const intruderPos = { x: 733, y: 210 };   // Main Entrance (Left side)

// Helper function to write to the terminal
function logToTerminal(text, color) {
    terminal.style.color = color;
    terminal.innerHTML = `> ${text}`;
}

// ==========================================
// THE DRAWING FUNCTIONS
// ==========================================

function drawFloorPlan() {
    // Fill background // GOOD
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines // GOOD
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Draw architectural walls (Simple lines to look like a blueprint)
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 4;

    // Outer walls (X,Y)
    ctx.strokeRect(100, 50, 600, 300);
    ctx.beginPath(); ctx.moveTo(190,350); ctx.lineTo(190,325);ctx.stroke();
    ctx.beginPath(); ctx.moveTo(188,325); ctx.lineTo(250,325);ctx.stroke();
    ctx.beginPath(); ctx.moveTo(250,327); ctx.lineTo(250,250);ctx.stroke();
    ctx.beginPath(); ctx.moveTo(248,250); ctx.lineTo(700,250);ctx.stroke();
    ctx.beginPath(); ctx.moveTo(450,195); ctx.lineTo(450,50);ctx.stroke();
    ctx.beginPath(); ctx.moveTo(452,195); ctx.lineTo(250,195);ctx.stroke();
    ctx.beginPath(); ctx.moveTo(250,197); ctx.lineTo(250,50);ctx.stroke();
    
    // Front Door
    ctx.fillStyle = '#c64d14'; 
    ctx.fillRect(698, 190, 4, 55); 
    

// ==========================================
    // TEXT LABELS (Safely Isolated)
    // ==========================================
    
    // 1. Draw Normal Text First
    ctx.fillStyle = '#2fc524';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.textAlign = "left"; // Reset alignment just in case
    ctx.fillText("KITCHEN/LIVING ROOM", 485, 125);
    ctx.fillText("GARAGE", 440, 300);
    ctx.fillText("BATHROOM", 320, 125);
    ctx.fillText("BEDROOM", 150, 125);

    // 2. Draw Rotated Text
    ctx.save(); // LOCK THE CANVAS STATE
    
    // Move to the exact spot we want the text
    ctx.translate(772, 225); 
    
    // Rotate 90 degrees counter-clockwise
    ctx.rotate(Math.PI / 2); 
    
    // Draw the text exactly at our new 0,0 center point
    ctx.textAlign = "center";
    ctx.fillText("MAIN ENTRANCE", 0, 0); 
    
    ctx.restore(); // UNLOCK AND SNAP THE CANVAS BACK TO NORMAL!
} // <-- This should be the end of your drawFloorPlan function

function drawEntities() {
    // 1. Draw Intruder Dot
    ctx.beginPath();
    ctx.arc(intruderPos.x, intruderPos.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = threatMapped ? '#ef4444' : '#b31c1cb6'; 
    ctx.fill();

    // NEW: Draw "INTRUDER" text below the dot
    ctx.fillStyle = '#a1a1aa'; // Grey text
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = "center"; // Centers text on the coordinate
    // Draw text at Intruder's X, and Intruder's Y + 20 pixels down
    ctx.fillText("INTRUDER", intruderPos.x, intruderPos.y + 22);

    // 2. Draw User Dot
    ctx.beginPath();
    ctx.arc(userPos.x, userPos.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = isSmartMode ? '#4ade80' : '#ffffff'; 
    ctx.fill();

    // NEW: Draw "YOU" text below the dot
    ctx.fillStyle = isSmartMode ? '#4ade80' : '#a1a1aa'; // Matches dot color
    ctx.fillText("YOU", userPos.x, userPos.y + 22);
}
////
function drawRealisticWaves() {
    // Determine the color of our sonar dots
    ctx.fillStyle = isSmartMode ? '#ef4444' : '#a1a1aa';

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        if (p.life <= 0) continue; // Skip dead particles

        // 1. Move the particle
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1; // It gets older every frame

        // 2. COLLISION DETECTION (Custom Apartment Physics)
        
        // --- OUTER WALLS ---
        // Left Outer Wall (x = 100)
        if (p.x <= 100 && p.vx < 0) { p.vx *= -1; p.x = 100; }
        // Top Outer Wall (y = 50)
        if (p.y <= 50 && p.vy < 0) { p.vy *= -1; p.y = 50; }
        // Bottom Outer Wall (y = 350)
        if (p.y >= 350 && p.vy > 0) { p.vy *= -1; p.y = 350; }
        
        // Right Outer Wall (x = 700) WITH A DOOR GAP
        if (p.x >= 700 && p.vx > 0) {
            // The Intruder is at Y=210. We leave a gap between Y=190 and Y=230 so sound can enter.
            if (p.y < 190 || p.y > 230) {
                p.vx *= -1; // Bounce if it hits the wall
                p.x = 700;
            }
        }

        // --- INNER APARTMENT WALLS ---
        // We use a +/- 3 pixel buffer so the high-speed particles don't glitch through the lines.

        // Wall 1 (Vertical): X=190, Y: 325 to 350
        if (p.x > 187 && p.x < 193 && p.y > 325 && p.y < 350) { p.vx *= -1; }
        
        // Wall 2 (Horizontal): Y=325, X: 188 to 250
        if (p.y > 322 && p.y < 328 && p.x > 188 && p.x < 250) { p.vy *= -1; }
        
        // Wall 3 (Vertical): X=250, Y: 250 to 327
        if (p.x > 247 && p.x < 253 && p.y > 250 && p.y < 327) { p.vx *= -1; }
        
        // Wall 4 (Horizontal): Y=250, X: 248 to 700
        if (p.y > 247 && p.y < 253 && p.x > 248 && p.x < 700) { p.vy *= -1; }
        
        // Wall 5 (Vertical): X=450, Y: 50 to 195
        if (p.x > 447 && p.x < 453 && p.y > 50 && p.y < 195) { p.vx *= -1; }
        
        // Wall 6 (Horizontal): Y=195, X: 250 to 452
        if (p.y > 192 && p.y < 198 && p.x > 250 && p.x < 452) { p.vy *= -1; }
        
        // Wall 7 (Vertical): X=250, Y: 50 to 197
        if (p.x > 247 && p.x < 253 && p.y > 50 && p.y < 197) { p.vx *= -1; }

        // 3. Draw the particle (Fades out as life gets closer to 0)
        ctx.globalAlpha = p.life / 250; 
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); // Draws a tiny 2px dot
        ctx.fill();
        ctx.globalAlpha = 1.0; // Reset transparency for other graphics

        // 4. Tactical Logic: Did a particle hit the User?
        if (isSmartMode && !threatMapped) {
            // Pythagorean theorem to find distance between particle and user
            let distToUser = Math.hypot(p.x - userPos.x, p.y - userPos.y);
            if (distToUser < 10) {
                threatMapped = true;
                logToTerminal("MICRO-ACOUSTIC SIGNATURE DETECTED. DIRECTION MAPPED.", "#4ade80");
            }
        }
    }
}

function drawTacticalLine() {
    // Draws the laser-straight line pointing from user to threat
    ctx.beginPath();
    ctx.moveTo(userPos.x, userPos.y);
    ctx.lineTo(intruderPos.x, intruderPos.y);
    ctx.strokeStyle = '#ef4444'; // Tactical Red
    ctx.lineWidth = 2;
    ctx.setLineDash(); // Makes the line dashed
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash for other drawings
}

// ==========================================
// THE ANIMATION LOOP
// ==========================================
function animate() {
    // 1. Wipe the canvas clean
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Redraw everything in layers (bottom to top)
    drawFloorPlan();
    drawRealisticWaves();
    if (threatMapped) drawTacticalLine();
    drawEntities();

    // 3. Ask the browser to run this function again for the next frame
    requestAnimationFrame(animate);
}

// Start the loop!
animate();


// ==========================================
// BUTTON CONTROLS & INTERACTIVITY
// ==========================================

// Toggle Switch Logic
toggle.addEventListener('change', function() {
    isSmartMode = this.checked;
    threatMapped = false; // Reset mapping line
    waves = []; // Clear existing waves
    
    if (isSmartMode) {
        modeLabel.innerText = "System: ACTIVE";
        modeLabel.style.color = "#4ade80";
        logToTerminal("SMARTGUARD ACTIVE. Awaiting acoustic anomalies.", "#4ade80");
    } else {
        modeLabel.innerText = "System: OFF";
        modeLabel.style.color = "#fff";
        logToTerminal("SYSTEM STANDBY. Standard hearing baseline.", "#a1a1aa");
    }
});

// Trigger Button Logic (Upgraded to Particle Swarm)
triggerBtn.addEventListener('click', function() {
    threatMapped = false; 
    particles = []; // Clear old particles
    
    // Spawn 180 particles shooting in a full 360-degree circle
    for(let i = 0; i < 360; i += 2) { 
        let angle = i * (Math.PI / 180); // Convert degrees to radians for math
        particles.push({
            x: intruderPos.x,
            y: intruderPos.y,
            vx: Math.cos(angle) * 3, // Velocity X (Speed left/right)
            vy: Math.sin(angle) * 3, // Velocity Y (Speed up/down)
            life: isSmartMode ? 250 : 80 // If OFF, they die fast. If ON, they map the whole house.
        });
    }

    if (!isSmartMode) {
        logToTerminal("AMBIENT NOISE: 12dB. [THREAT UNDETECTED]. USER OBLIVIOUS.", "#ef4444");
    } else {
        logToTerminal("ANALYZING ACOUSTIC REFLECTIONS... [SONAR PING]", "#fbbf24");
    }
});