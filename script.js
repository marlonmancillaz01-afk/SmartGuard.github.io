// ==========================================
// 1. LIVE THREAT TICKER LOGIC
// ==========================================
let intrusions = 14203;
let assaults = 8941;
let shootings = 656;

const intrusionEl = document.getElementById('count-intrusions');
const assaultEl = document.getElementById('count-assaults');
const shootingEl = document.getElementById('count-critical');

const formatNum = (num) => num.toLocaleString('en-US');

const flashElement = (element) => {
    if(!element) return;
    element.classList.add('flash-update');
    setTimeout(() => element.classList.remove('flash-update'), 200);
};

// Ticker Timers (Only run if elements exist)
if (intrusionEl && assaultEl && shootingEl) {
    setInterval(() => {
        if (Math.random() > 0.3) {
            intrusions += Math.floor(Math.random() * 3) + 1;
            intrusionEl.innerText = formatNum(intrusions);
            flashElement(intrusionEl);
        }
    }, 2000);

    setInterval(() => {
        if (Math.random() > 0.5) {
            assaults += Math.floor(Math.random() * 2) + 1;
            assaultEl.innerText = formatNum(assaults);
            flashElement(assaultEl);
        }
    }, 3500);
}

// ==========================================
// 2. CHART & MODAL LOGIC
// ==========================================
const chartData = {
    intrusions: {
        title: "> US RESIDENTIAL BURGLARIES (TREND)",
        labels: ['2019', '2020', '2021', '2022', '2023'],
        data: [1117696, 1015000, 899700, 847522, 839563],
        color: '#fbbf24'
    },
    assaults: {
        title: "> US AGGRAVATED ASSAULTS (TREND)",
        labels: ['2019', '2020', '2021', '2022', '2023'],
        data: [821182, 903394, 1034516, 905416, 880063],
        color: '#f97316'
    },
    shootings: {
        title: "> US MASS SHOOTINGS (GVA DATA)",
        labels: ['2019', '2020', '2021', '2022', '2023'],
        data: [417, 611, 693, 647, 656],
        color: '#ef4444'
    }
};

const modal = document.getElementById('data-modal');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const ctxElement = document.getElementById('threatChart');
let currentChart = null;

function openChart(datasetKey) {
    if (!ctxElement || !modal) return; // Safety check
    const ctx = ctxElement.getContext('2d');
    const dataSet = chartData[datasetKey];
    
    modalTitle.innerText = dataSet.title;
    modalTitle.style.color = dataSet.color;

    if (currentChart) currentChart.destroy();

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataSet.labels,
            datasets: [{
                label: 'Reported Incidents',
                data: dataSet.data,
                borderColor: dataSet.color,
                backgroundColor: dataSet.color + '33',
                borderWidth: 3,
                pointBackgroundColor: '#000',
                pointBorderColor: dataSet.color,
                pointBorderWidth: 2,
                pointRadius: 5,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            color: '#a1a1aa',
            scales: {
                y: { grid: { color: '#27272a' }, beginAtZero: false },
                x: { grid: { color: '#27272a' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    modal.style.display = 'block';
}

if (closeModal && modal) {
    closeModal.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };
}

document.querySelectorAll('.ticker-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        if(index === 0) openChart('intrusions');
        if(index === 1) openChart('assaults');
        if(index === 2) openChart('shootings');
    });
});

// ==========================================
// 3. TERMINAL REVEAL SEQUENCE
// ==========================================
const terminalBtn = document.getElementById('terminal-btn');
const terminalOutput = document.getElementById('terminal-output');

if (terminalBtn && terminalOutput) {
    terminalBtn.addEventListener('click', function() {
        
        terminalBtn.style.pointerEvents = 'none';
        terminalBtn.style.borderColor = '#4ade80';
        terminalBtn.innerHTML = '> Executing threat_detection_model.py...';

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
            
            setTimeout(() => {
                const terminalContainer = document.getElementById('terminal-container');
                if(terminalContainer) terminalContainer.classList.add('fade-out');
                
                setTimeout(() => {
                    if(terminalContainer) terminalContainer.style.display = 'none'; 
                    
                    const features = document.getElementById('features-section');
                    if(features) features.style.display = 'block'; 
                    
                    setTimeout(() => {
                        if(features) features.classList.add('reveal-active');
                    }, 50);
                    
                }, 1000); 
                
            }, 1500); 

        }, 4500);
    });
}