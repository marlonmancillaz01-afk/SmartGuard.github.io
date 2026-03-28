// Grab the elements from the HTML
const terminalBtn = document.getElementById('terminal-btn');
const terminalOutput = document.getElementById('terminal-output');

// Add a click listener to the terminal button
terminalBtn.addEventListener('click', function() {
    
    // 1. Disable the button so the user can't click it multiple times
    terminalBtn.style.pointerEvents = 'none';
    terminalBtn.style.borderColor = '#4ade80'; // Lock in the green border
    
    // 2. Clear out any blinking cursor from the initial button
    terminalBtn.innerHTML = '> Executing threat_detection_model.py...';

    // 3. Sequence the fake loading outputs using timeouts (time in milliseconds)
    setTimeout(() => {
        terminalOutput.innerHTML += '<div style="color: #a1a1aa; margin-bottom: 8px;">> Mounting local hardware... [OK]</div>';
    }, 600);

    setTimeout(() => {
        terminalOutput.innerHTML += '<div style="color: #a1a1aa; margin-bottom: 8px;">> Loading acoustic neural net... [14,023 signatures loaded]</div>';
    }, 1800);

    setTimeout(() => {
        terminalOutput.innerHTML += '<div style="color: #fbbf24; margin-bottom: 8px;">> Calibrating frequency kill-switch... [STANDBY]</div>';
    }, 3200);

    setTimeout(() => {
        terminalOutput.innerHTML += '<div style="color: #4ade80; margin-bottom: 8px; font-weight: bold;">> SYSTEM ACTIVE. Listening for anomalies.</div>';
        
        // At this point, the simulation is done. 
        // We will add the logic later to show the next section of the website!
    }, 4500);

});

// --- LIVE THREAT TICKER LOGIC ---

// 1. Set our starting baseline numbers
let intrusions = 14203;
let assaults = 8941;
let critical = 1204;

// 2. Grab the HTML elements where the numbers live
const intrusionEl = document.getElementById('count-intrusions');
const assaultEl = document.getElementById('count-assaults');
const criticalEl = document.getElementById('count-critical');

// 3. Helper function to add commas to numbers (e.g., 14203 -> 14,203)
const formatNum = (num) => num.toLocaleString('en-US');

// 4. Helper function to make the number flash white when updated
const flashElement = (element) => {
    element.classList.add('flash-update');
    setTimeout(() => {
        element.classList.remove('flash-update');
    }, 200); // Removes the flash after 200 milliseconds
};

// 5. Run a timer every 2 seconds for Intrusions
setInterval(() => {
    // 70% chance it goes up each tick
    if (Math.random() > 0.3) {
        intrusions += Math.floor(Math.random() * 3) + 1; // Adds 1 to 3
        intrusionEl.innerText = formatNum(intrusions);
        flashElement(intrusionEl);
    }
}, 2000);

// 6. Run a timer every 3.5 seconds for Assaults
setInterval(() => {
    // 50% chance it goes up
    if (Math.random() > 0.5) {
        assaults += Math.floor(Math.random() * 2) + 1; // Adds 1 or 2
        assaultEl.innerText = formatNum(assaults);
        flashElement(assaultEl);
    }
}, 3500);

// 7. Run a timer every 6 seconds for Critical events
setInterval(() => {
    // Only a 30% chance it goes up (makes it feel rare/serious)
    if (Math.random() > 0.7) {
        critical += 1; // Only ever adds 1
        criticalEl.innerText = formatNum(critical);
        flashElement(criticalEl);
    }
}, 6000);