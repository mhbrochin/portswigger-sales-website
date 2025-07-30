// Catch Me If You Can - Interactive Vulnerability Hunt Game

class VulnerabilityHuntGame {
    constructor() {
        this.magnifier = document.getElementById('magnifier');
        this.isDragging = false;
        this.vulnerabilitiesFound = new Set();
        this.score = 0;
        this.totalVulnerabilities = 0;
        this.gameStarted = false;
        
        this.vulnerabilityTypes = {
            'sqli': { name: 'SQL Injection', icon: 'fas fa-database', points: 15 },
            'xss': { name: 'Cross-Site Scripting', icon: 'fas fa-code', points: 12 },
            'rce': { name: 'Remote Code Execution', icon: 'fas fa-terminal', points: 20 },
            'lfi': { name: 'Local File Inclusion', icon: 'fas fa-file', points: 10 },
            'csrf': { name: 'Cross-Site Request Forgery', icon: 'fas fa-shield-alt', points: 8 },
            'injection': { name: 'Code Injection', icon: 'fas fa-bug', points: 15 },
            'logic': { name: 'Business Logic Flaw', icon: 'fas fa-cogs', points: 18 },
            'auth-bypass': { name: 'Authentication Bypass', icon: 'fas fa-key', points: 16 },
            'xxe': { name: 'XML External Entity', icon: 'fas fa-file-code', points: 14 },
            'blind-sqli': { name: 'Blind SQL Injection', icon: 'fas fa-eye-slash', points: 18 },
            'ssti': { name: 'Server-Side Template Injection', icon: 'fas fa-server', points: 16 },
            'deserial': { name: 'Insecure Deserialization', icon: 'fas fa-archive', points: 17 },
            'info-disclosure': { name: 'Information Disclosure', icon: 'fas fa-info-circle', points: 8 },
            'path-traversal': { name: 'Path Traversal', icon: 'fas fa-folder-open', points: 12 }
        };
        
        this.init();
        this.setupEventListeners();
        this.startGame();
    }
    
    init() {
        // Count total vulnerabilities
        const allVulns = document.querySelectorAll('.hidden-vuln');
        this.totalVulnerabilities = allVulns.length;
        
        // Position magnifier in center initially
        const centerX = window.innerWidth / 2 - 75;
        const centerY = window.innerHeight / 2 - 75;
        
        this.magnifier.style.left = centerX + 'px';
        this.magnifier.style.top = centerY + 'px';
        
        // Update magnifier position on window resize
        window.addEventListener('resize', () => {
            if (!this.isDragging) {
                const newCenterX = window.innerWidth / 2 - 75;
                const newCenterY = window.innerHeight / 2 - 75;
                this.magnifier.style.left = newCenterX + 'px';
                this.magnifier.style.top = newCenterY + 'px';
            }
        });
    }
    
    setupEventListeners() {
        // Mouse events
        this.magnifier.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        
        // Touch events for mobile
        this.magnifier.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));
        
        // Prevent context menu on right click
        this.magnifier.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Start scanning on magnifier interaction
        this.magnifier.addEventListener('mousedown', () => {
            if (!this.gameStarted) {
                this.startGame();
            }
        });
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.magnifier.style.cursor = 'grabbing';
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        const rect = this.magnifier.getBoundingClientRect();
        this.offsetX = clientX - rect.left - rect.width / 2;
        this.offsetY = clientY - rect.top - rect.height / 2;
        
        e.preventDefault();
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        
        let x = clientX - this.offsetX - 75; // 75 is half magnifier width
        let y = clientY - this.offsetY - 75; // 75 is half magnifier height
        
        // Constrain to viewport
        x = Math.max(0, Math.min(x, window.innerWidth - 150));
        y = Math.max(0, Math.min(y, window.innerHeight - 150));
        
        this.magnifier.style.left = x + 'px';
        this.magnifier.style.top = y + 'px';
        
        this.checkForVulnerabilities();
        e.preventDefault();
    }
    
    stopDrag() {
        this.isDragging = false;
        this.magnifier.style.cursor = 'grab';
    }
    
    checkForVulnerabilities() {
        const magnifierRect = this.magnifier.getBoundingClientRect();
        const magnifierCenter = {
            x: magnifierRect.left + magnifierRect.width / 2,
            y: magnifierRect.top + magnifierRect.height / 2
        };
        
        const hiddenVulns = document.querySelectorAll('.hidden-vuln:not(.revealed)');
        
        hiddenVulns.forEach(vuln => {
            const vulnRect = vuln.getBoundingClientRect();
            const vulnCenter = {
                x: vulnRect.left + vulnRect.width / 2,
                y: vulnRect.top + vulnRect.height / 2
            };
            
            // Calculate distance from magnifier center to vulnerability center
            const distance = Math.sqrt(
                Math.pow(magnifierCenter.x - vulnCenter.x, 2) + 
                Math.pow(magnifierCenter.y - vulnCenter.y, 2)
            );
            
            // Reveal if within magnifier radius (75px)
            if (distance < 75) {
                this.revealVulnerability(vuln);
            }
        });
        
        // Update magnifier glow based on proximity
        this.updateMagnifierGlow(hiddenVulns, magnifierCenter);
    }
    
    revealVulnerability(vuln) {
        if (vuln.classList.contains('revealed')) return;
        
        vuln.classList.add('revealed');
        const vulnType = vuln.getAttribute('data-type');
        const vulnInfo = this.vulnerabilityTypes[vulnType];
        
        if (vulnInfo && !this.vulnerabilitiesFound.has(vuln)) {
            this.vulnerabilitiesFound.add(vuln);
            this.score += vulnInfo.points;
            this.updateStats();
            this.showVulnerabilityFound(vulnInfo, vuln.textContent);
            this.addToFoundList(vulnInfo, vuln.textContent);
            
            // Check if game is complete
            if (this.vulnerabilitiesFound.size >= this.totalVulnerabilities) {
                setTimeout(() => this.showCongratulations(), 1000);
            }
        }
    }
    
    updateMagnifierGlow(nearbyVulns, magnifierCenter) {
        let closestDistance = Infinity;
        
        nearbyVulns.forEach(vuln => {
            const vulnRect = vuln.getBoundingClientRect();
            const vulnCenter = {
                x: vulnRect.left + vulnRect.width / 2,
                y: vulnRect.top + vulnRect.height / 2
            };
            
            const distance = Math.sqrt(
                Math.pow(magnifierCenter.x - vulnCenter.x, 2) + 
                Math.pow(magnifierCenter.y - vulnCenter.y, 2)
            );
            
            if (distance < closestDistance) {
                closestDistance = distance;
            }
        });
        
        // Adjust glow intensity based on proximity
        const maxDistance = 200;
        const glowIntensity = Math.max(0, (maxDistance - closestDistance) / maxDistance);
        const glowSize = 30 + (glowIntensity * 20);
        const glowOpacity = 0.4 + (glowIntensity * 0.4);
        
        this.magnifier.style.boxShadow = `0 0 ${glowSize}px rgba(255, 102, 51, ${glowOpacity})`;
    }
    
    showVulnerabilityFound(vulnInfo, vulnText) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 102, 51, 0.95);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 1rem;
                z-index: 10001;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                box-shadow: 0 0 30px rgba(255, 102, 51, 0.7);
                text-align: center;
                max-width: 300px;
            ">
                <i class="${vulnInfo.icon}" style="margin-right: 8px;"></i>
                <strong>${vulnInfo.name} Found!</strong><br>
                <span style="font-size: 0.8rem; opacity: 0.9;">+${vulnInfo.points} points</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.firstElementChild.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.firstElementChild.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    addToFoundList(vulnInfo, vulnText) {
        const foundContainer = document.getElementById('foundVulnerabilities');
        const vulnElement = document.createElement('div');
        vulnElement.className = 'vulnerability-item';
        vulnElement.innerHTML = `
            <div class="vulnerability-icon">
                <i class="${vulnInfo.icon}"></i>
            </div>
            <div class="vulnerability-details">
                <h4>${vulnInfo.name}</h4>
                <p>${vulnText}</p>
            </div>
        `;
        foundContainer.appendChild(vulnElement);
    }
    
    updateStats() {
        document.getElementById('vulnCount').textContent = this.vulnerabilitiesFound.size;
        document.getElementById('scoreCount').textContent = this.score;
    }
    
    startGame() {
        this.gameStarted = true;
        // Show game instructions
        const instructions = document.createElement('div');
        instructions.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 102, 51, 0.95);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                font-weight: bold;
                z-index: 10001;
                text-align: center;
                max-width: 400px;
                opacity: 0;
                transition: opacity 0.3s ease;
            ">
                🔍 Drag the PortSwigger scanner to find hidden vulnerabilities!<br>
                <span style="font-size: 0.8rem; opacity: 0.9;">Look for suspicious code that traditional scanners miss</span>
            </div>
        `;
        
        document.body.appendChild(instructions);
        
        setTimeout(() => {
            instructions.firstElementChild.style.opacity = '1';
        }, 500);
        
        setTimeout(() => {
            instructions.firstElementChild.style.opacity = '0';
            setTimeout(() => instructions.remove(), 300);
        }, 5000);
    }
    
    showCongratulations() {
        const modal = document.getElementById('congratsModal');
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalVulnCount').textContent = this.vulnerabilitiesFound.size;
        modal.style.display = 'flex';
    }
    
    restart() {
        // Reset game state
        this.vulnerabilitiesFound.clear();
        this.score = 0;
        this.gameStarted = false;
        
        // Reset UI
        this.updateStats();
        document.getElementById('foundVulnerabilities').innerHTML = '';
        document.getElementById('congratsModal').style.display = 'none';
        
        // Reset all vulnerabilities
        const allVulns = document.querySelectorAll('.hidden-vuln');
        allVulns.forEach(vuln => {
            vuln.classList.remove('revealed');
        });
        
        // Reposition magnifier
        const centerX = window.innerWidth / 2 - 75;
        const centerY = window.innerHeight / 2 - 75;
        this.magnifier.style.left = centerX + 'px';
        this.magnifier.style.top = centerY + 'px';
        
        // Reset magnifier glow
        this.magnifier.style.boxShadow = '0 0 30px rgba(255, 102, 51, 0.4)';
    }
}

// Global functions for buttons
function restartGame() {
    if (window.vulnerabilityGame) {
        window.vulnerabilityGame.restart();
    }
}

function closeCongrats() {
    document.getElementById('congratsModal').style.display = 'none';
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the vulnerability hunt game
    window.vulnerabilityGame = new VulnerabilityHuntGame();
    
    // Initialize basic navigation (mobile menu)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('congrats-modal-overlay')) {
            closeCongrats();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCongrats();
        }
    });
});

// Add some ambient scanning effects
function createScanningEffects() {
    const scanningLines = document.createElement('div');
    scanningLines.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    
    // Create scanning lines that move across the screen
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.style.cssText = `
            position: absolute;
            width: 2px;
            height: 100%;
            background: linear-gradient(to bottom, transparent, rgba(255, 102, 51, 0.3), transparent);
            animation: scanLine ${4 + i}s linear infinite;
            left: ${i * 33}%;
        `;
        scanningLines.appendChild(line);
    }
    
    document.body.appendChild(scanningLines);
    
    // Add CSS for scanning animation
    const scanStyle = document.createElement('style');
    scanStyle.textContent = `
        @keyframes scanLine {
            0% { transform: translateX(-100vw); }
            100% { transform: translateX(100vw); }
        }
    `;
    document.head.appendChild(scanStyle);
}

// Initialize scanning effects after a delay
setTimeout(createScanningEffects, 2000);