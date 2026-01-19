// Default values
let birthDate = new Date(1995, 11, 11); // December 11, 1995 (month is 0-indexed)
let lifeExpectancy = 80;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    updateAllStats();
    generateWeeksMatrix();
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    
    // Set up form submission
    document.getElementById('settingsForm').addEventListener('submit', handleFormSubmit);
    
    // Set up share button
    document.getElementById('shareBtn').addEventListener('click', generateShareImage);
});

// Load settings from localStorage or use defaults
function loadSettings() {
    const savedBirthDate = localStorage.getItem('birthDate');
    const savedLifeExpectancy = localStorage.getItem('lifeExpectancy');
    
    if (savedBirthDate) {
        birthDate = new Date(savedBirthDate);
    }
    
    if (savedLifeExpectancy) {
        lifeExpectancy = parseInt(savedLifeExpectancy);
    }
    
    // Update form fields
    document.getElementById('birthDay').value = birthDate.getDate();
    document.getElementById('birthMonth').value = birthDate.getMonth();
    document.getElementById('birthYear').value = birthDate.getFullYear();
    document.getElementById('lifeExpectancy').value = lifeExpectancy;
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('birthDate', birthDate.toISOString());
    localStorage.setItem('lifeExpectancy', lifeExpectancy.toString());
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const day = parseInt(document.getElementById('birthDay').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const year = parseInt(document.getElementById('birthYear').value);
    const newLifeExpectancy = parseInt(document.getElementById('lifeExpectancy').value);
    
    birthDate = new Date(year, month, day);
    lifeExpectancy = newLifeExpectancy;
    
    saveSettings();
    updateAllStats();
    generateWeeksMatrix();
    
    alert('Settings updated successfully!');
}

// Calculate age in years, months, and days
function calculateAge() {
    const now = new Date();
    const birth = new Date(birthDate);
    
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    
    if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    return { years, months, days };
}

// Calculate total days lived
function calculateDaysLived() {
    const now = new Date();
    const birth = new Date(birthDate);
    const diff = now - birth;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Calculate weeks lived
function calculateWeeksLived() {
    const daysLived = calculateDaysLived();
    return Math.floor(daysLived / 7);
}

// Calculate total weeks in expected lifetime
function calculateTotalWeeks() {
    return lifeExpectancy * 52;
}

// Calculate end date
function calculateEndDate() {
    const endDate = new Date(birthDate);
    endDate.setFullYear(endDate.getFullYear() + lifeExpectancy);
    return endDate;
}

// Calculate days left
function calculateDaysLeft() {
    const now = new Date();
    const endDate = calculateEndDate();
    const diff = endDate - now;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// Update all statistics
function updateAllStats() {
    // Current Age
    const age = calculateAge();
    document.getElementById('years').textContent = age.years;
    document.getElementById('months').textContent = age.months;
    document.getElementById('days').textContent = age.days;
    
    // Weeks
    const weeksLived = calculateWeeksLived();
    const totalWeeks = calculateTotalWeeks();
    const weeksLeft = Math.max(0, totalWeeks - weeksLived);
    
    document.getElementById('currentWeeks').textContent = weeksLived.toLocaleString();
    document.getElementById('totalWeeks').textContent = totalWeeks.toLocaleString();
    document.getElementById('weeksLeft').textContent = weeksLeft.toLocaleString();
    
    // Progress bar
    const progress = Math.min(100, (weeksLived / totalWeeks) * 100);
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = progress.toFixed(1) + '% of life lived';
    
    // Days left
    const daysLeft = calculateDaysLeft();
    document.getElementById('daysLeft').textContent = daysLeft.toLocaleString();
    
    // Update countdown
    updateCountdown();
}

// Update countdown timer
function updateCountdown() {
    const now = new Date();
    const endDate = calculateEndDate();
    const diff = endDate - now;
    
    if (diff <= 0) {
        document.getElementById('hoursLeft').textContent = '0';
        document.getElementById('minutesLeft').textContent = '0';
        document.getElementById('secondsLeft').textContent = '0';
        return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('hoursLeft').textContent = hours.toLocaleString();
    document.getElementById('minutesLeft').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('secondsLeft').textContent = seconds.toString().padStart(2, '0');
}

// Generate weeks matrix
function generateWeeksMatrix() {
    const matrixContainer = document.getElementById('weeksMatrix');
    matrixContainer.innerHTML = '';
    
    const weeksLived = calculateWeeksLived();
    const totalWeeks = calculateTotalWeeks();
    const weeksPerYear = 52;
    const totalYears = Math.ceil(totalWeeks / weeksPerYear);
    
    // Create a container for the matrix with labels
    const matrixWrapper = document.createElement('div');
    matrixWrapper.className = 'matrix-wrapper';
    
    // Create the grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'weeks-grid';
    
    for (let year = 0; year < totalYears; year++) {
        // Add decade label at the start of each row
        const ageLabel = document.createElement('div');
        ageLabel.className = 'age-label';
        
        // Only show labels for decades (10, 20, 30, etc.)
        if ((year + 1) % 10 === 0) {
            ageLabel.textContent = (year + 1).toString();
        }
        
        gridContainer.appendChild(ageLabel);
        
        // Add weeks for this year
        for (let week = 0; week < weeksPerYear; week++) {
            const weekIndex = year * weeksPerYear + week;
            if (weekIndex < totalWeeks) {
                const weekBox = document.createElement('div');
                weekBox.className = 'week-box ' + (weekIndex < weeksLived ? 'lived' : 'remaining');
                weekBox.title = `Week ${weekIndex + 1} (Age ${year + 1})`;
                gridContainer.appendChild(weekBox);
            }
        }
    }
    
    matrixWrapper.appendChild(gridContainer);
    matrixContainer.appendChild(matrixWrapper);
}

// Generate share image for Instagram story
function generateShareImage() {
    const canvas = document.getElementById('shareCanvas');
    const ctx = canvas.getContext('2d');
    
    // Instagram story dimensions (1080x1920)
    canvas.width = 1080;
    canvas.height = 1920;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('End of Line', canvas.width / 2, 200);
    
    // Subtitle
    ctx.font = '40px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('Make every week count', canvas.width / 2, 280);
    
    // Current Age
    const age = calculateAge();
    ctx.font = 'bold 60px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Current Age', canvas.width / 2, 450);
    
    ctx.font = 'bold 80px Arial, sans-serif';
    ctx.fillText(`${age.years} years, ${age.months} months, ${age.days} days`, canvas.width / 2, 560);
    
    // Weeks Progress
    const weeksLived = calculateWeeksLived();
    const totalWeeks = calculateTotalWeeks();
    const weeksLeft = Math.max(0, totalWeeks - weeksLived);
    
    ctx.font = 'bold 60px Arial, sans-serif';
    ctx.fillText('Life Progress', canvas.width / 2, 750);
    
    ctx.font = '50px Arial, sans-serif';
    ctx.fillText(`${weeksLived.toLocaleString()} / ${totalWeeks.toLocaleString()} weeks`, canvas.width / 2, 840);
    
    const progress = Math.min(100, (weeksLived / totalWeeks) * 100);
    ctx.fillText(`${progress.toFixed(1)}% complete`, canvas.width / 2, 920);
    
    // Days Left
    const daysLeft = calculateDaysLeft();
    ctx.font = 'bold 60px Arial, sans-serif';
    ctx.fillText('Days Remaining', canvas.width / 2, 1100);
    
    ctx.font = 'bold 100px Arial, sans-serif';
    ctx.fillText(daysLeft.toLocaleString(), canvas.width / 2, 1220);
    
    // Countdown
    const now = new Date();
    const endDate = calculateEndDate();
    const diff = endDate - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    ctx.font = 'bold 60px Arial, sans-serif';
    ctx.fillText('Time Left', canvas.width / 2, 1400);
    
    ctx.font = '50px Arial, sans-serif';
    ctx.fillText(`${hours.toLocaleString()} hours`, canvas.width / 2, 1490);
    ctx.fillText(`${minutes} minutes, ${seconds} seconds`, canvas.width / 2, 1570);
    
    // Footer
    ctx.font = '35px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('solvepao research', canvas.width / 2, 1800);
    
    // Convert canvas to image and download
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'end-of-line-story.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('Your Instagram story image has been downloaded!');
    });
}
