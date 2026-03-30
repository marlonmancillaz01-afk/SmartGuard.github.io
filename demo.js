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
let waves = []; // This will hold our expanding sound wave circles
let threatMapped = false; // Tells the system when to draw the red laser line

// 3. Define the physical coordinates on the map (X, Y)
const userPos = { x: 160, y: 100 };      // Kitchen (Right side)
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
    

    // Draw text labels
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText("MAIN ENTRANCE", 120, 80);
    ctx.fillText("KITCHEN", 620, 80);
}

function drawEntities() {
    // 1. Draw Intruder Dot
    ctx.beginPath();
    ctx.arc(intruderPos.x, intruderPos.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = threatMapped ? '#ef4444' : '#3f3f46'; 
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
    ctx.fillStyle = isSmartMode ? '#4ade80' : '#a1a1aa'; 
    ctx.fill();

    // NEW: Draw "YOU" text below the dot
    ctx.fillStyle = isSmartMode ? '#4ade80' : '#a1a1aa'; // Matches dot color
    ctx.fillText("YOU", userPos.x, userPos.y + 22);
}

function drawWaves() {
    // Loop through any active sound waves and draw them
    for (let i = 0; i < waves.length; i++) {
        let wave = waves[i];
        
        ctx.beginPath();
        ctx.arc(intruderPos.x, intruderPos.y, wave.radius, 0, Math.PI * 2);
        
        // Calculate transparency so the wave fades out as it gets bigger
        let alpha = Math.max(0, 1 - (wave.radius / wave.maxRadius));
        
        // Color changes based on SmartGuard mode
        ctx.strokeStyle = isSmartMode ? `rgba(239, 68, 68, ${alpha})` : `rgba(161, 161, 170, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Grow the wave for the next frame
        wave.radius += wave.speed;

        // --- THE TACTICAL LOGIC ---
        // If Smart mode is ON, and the wave radius reaches the User, map the threat!
        if (isSmartMode && wave.radius >= 550 && !threatMapped) {
            threatMapped = true;
            logToTerminal("MICRO-ACOUSTIC SIGNATURE DETECTED. ISOLATING... [LOCK-PICKING]. DIRECTION MAPPED: MAIN ENTRANCE.", "#4ade80");
        }
    }

    // Remove waves that have faded out completely
    waves = waves.filter(wave => wave.radius < wave.maxRadius);
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
    drawWaves();
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

// Trigger Button Logic
triggerBtn.addEventListener('click', function() {
    threatMapped = false; // Reset line
    
    // Add a new wave to our array
    waves.push({
        radius: 0,
        speed: 4,
        // If OFF, wave dies at 300px (doesn't reach user). If ON, it reaches across the house (800px)
        maxRadius: isSmartMode ? 800 : 300 
    });

    if (!isSmartMode) {
        logToTerminal("AMBIENT NOISE: 12dB. [THREAT UNDETECTED]. USER OBLIVIOUS.", "#ef4444");
    } else {
        logToTerminal("ANALYZING ACOUSTIC REFLECTIONS...", "#fbbf24");
    }
});