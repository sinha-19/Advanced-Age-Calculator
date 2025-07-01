document.addEventListener('DOMContentLoaded', function() {
    const birthDateInput = document.getElementById('birth-date');
    const birthTimeInput = document.getElementById('birth-time');
    const calculateBtn = document.getElementById('calculate-btn');
    const recalculateBtn = document.getElementById('recalculate-btn');
    const resultsSection = document.getElementById('results-section');
    const includeTimeCheckbox = document.getElementById('include-time');
    const showDetailedCheckbox = document.getElementById('show-detailed');
    const showMilestonesCheckbox = document.getElementById('show-milestones');
    const autoUpdateCheckbox = document.getElementById('auto-update');
    const primaryAgeElement = document.getElementById('primary-age');
    const detailedBreakdown = document.getElementById('detailed-breakdown');
    const alternativeFormats = document.getElementById('alternative-formats');
    const milestonesSection = document.getElementById('milestones-section');
    const nextBirthdaySection = document.getElementById('next-birthday-section');
    const yearsValue = document.getElementById('years-value');
    const monthsValue = document.getElementById('months-value');
    const daysValue = document.getElementById('days-value');
    const hoursValue = document.getElementById('hours-value');
    const minutesValue = document.getElementById('minutes-value');
    const secondsValue = document.getElementById('seconds-value');
    const totalDays = document.getElementById('total-days');
    const totalHours = document.getElementById('total-hours');
    const totalMinutes = document.getElementById('total-minutes');
    const totalSeconds = document.getElementById('total-seconds');
    const totalWeeks = document.getElementById('total-weeks');
    const totalMonths = document.getElementById('total-months');
    const daysUntilBirthday = document.getElementById('days-until-birthday');
    const nextBirthdayDate = document.getElementById('next-birthday-date');
    const birthdayWeekday = document.getElementById('birthday-weekday');
    const milestonesContainer = document.getElementById('milestones-container');
    let birthDateTime = null;
    let updateInterval = null;
    let ageData = {};
    const ageMilestones = [
        { age: 1, description: "First Birthday" },
        { age: 5, description: "School Age" },
        { age: 10, description: "Double Digits" },
        { age: 13, description: "Teenager" },
        { age: 16, description: "Sweet Sixteen" },
        { age: 18, description: "Legal Adult" },
        { age: 21, description: "Legal Drinking Age (US)" },
        { age: 25, description: "Quarter Century" },
        { age: 30, description: "Thirty and Thriving" },
        { age: 40, description: "Life Begins at Forty" },
        { age: 50, description: "Half Century" },
        { age: 60, description: "Diamond Jubilee" },
        { age: 65, description: "Retirement Age" },
        { age: 70, description: "Platinum Jubilee" },
        { age: 75, description: "Diamond Wedding Anniversary Age" },
        { age: 80, description: "Octogenarian" },
        { age: 90, description: "Nonagenarian" },
        { age: 100, description: "Centenarian" }
    ];
    calculateBtn.addEventListener('click', handleCalculate);
    recalculateBtn.addEventListener('click', handleRecalculate);
    includeTimeCheckbox.addEventListener('change', updateDisplayOptions);
    showDetailedCheckbox.addEventListener('change', updateDisplayOptions);
    showMilestonesCheckbox.addEventListener('change', updateDisplayOptions);
    autoUpdateCheckbox.addEventListener('change', handleAutoUpdateToggle);
    birthDateInput.addEventListener('change', validateBirthDate);
    birthTimeInput.addEventListener('change', validateBirthTime);
    const today = new Date().toISOString().split('T')[0];
    birthDateInput.max = today;
    function handleCalculate() {
        if (!validateInputs()) {
            return;
        }
        setBirthDateTime();
        calculateAge();
        displayResults();
        showResultsSection();
        if (autoUpdateCheckbox.checked) {
            startAutoUpdate();
        }
    }
    function validateInputs() {
        const birthDate = birthDateInput.value;
        if (!birthDate) {
            showError('Please enter your birth date.');
            return false;
        }
        const selectedDate = new Date(birthDate);
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            showError('Birth date cannot be in the future.');
            return false;
        }
        const maxAge = new Date();
        maxAge.setFullYear(maxAge.getFullYear() - 150);
        if (selectedDate < maxAge) {
            showError('Please enter a valid birth date within the last 150 years.');
            return false;
        }
        return true;
    }
    function validateBirthDate() {
        const birthDate = birthDateInput.value;
        if (birthDate) {
            const selectedDate = new Date(birthDate);
            const currentDate = new Date();
            if (selectedDate > currentDate) {
                birthDateInput.setCustomValidity('Birth date cannot be in the future.');
            } else {
                birthDateInput.setCustomValidity('');
            }
        }
    }
    function validateBirthTime() {
        const birthTime = birthTimeInput.value;
        if (birthTime && !birthDateInput.value) {
            showError('Please enter birth date first.');
            birthTimeInput.value = '';
        }
    }
    function setBirthDateTime() {
        const birthDate = birthDateInput.value;
        const birthTime = birthTimeInput.value || '00:00';
        if (includeTimeCheckbox.checked && birthTimeInput.value) {
            birthDateTime = new Date(`${birthDate}T${birthTime}`);
        } else {
            birthDateTime = new Date(`${birthDate}T00:00:00`);
        }
    }
    function calculateAge() {
        const now = new Date();
        const timeDifference = now.getTime() - birthDateTime.getTime();
        ageData = calculateDetailedAge(birthDateTime, now);
        ageData.totalMilliseconds = timeDifference;
        ageData.totalSeconds = Math.floor(timeDifference / 1000);
        ageData.totalMinutes = Math.floor(ageData.totalSeconds / 60);
        ageData.totalHours = Math.floor(ageData.totalMinutes / 60);
        ageData.totalDays = Math.floor(ageData.totalHours / 24);
        ageData.totalWeeks = Math.floor(ageData.totalDays / 7);
        ageData.totalMonths = calculateTotalMonths(birthDateTime, now);
        calculateNextBirthday();
        formatAgeData();
    }
    function calculateDetailedAge(birthDate, currentDate) {
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();
        let hours = currentDate.getHours() - birthDate.getHours();
        let minutes = currentDate.getMinutes() - birthDate.getMinutes();
        let seconds = currentDate.getSeconds() - birthDate.getSeconds();
        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            days--;
        }
        if (days < 0) {
            const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += previousMonth.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }
        return {
            years: years,
            months: months,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    }
    function calculateTotalMonths(birthDate, currentDate) {
        const years = currentDate.getFullYear() - birthDate.getFullYear();
        const months = currentDate.getMonth() - birthDate.getMonth();
        const days = currentDate.getDate() - birthDate.getDate();
        let totalMonths = years * 12 + months;
        if (days < 0) {
            totalMonths--;
        }
        return totalMonths;
    }
    function calculateNextBirthday() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let nextBirthday = new Date(birthDateTime);
        nextBirthday.setFullYear(currentYear);
        if (nextBirthday < now) {
            nextBirthday.setFullYear(currentYear + 1);
        }
        const timeDiff = nextBirthday.getTime() - now.getTime();
        const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekdayName = weekdays[nextBirthday.getDay()];
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = nextBirthday.toLocaleDateString('en-US', options);
        ageData.nextBirthday = {
            daysUntil: daysUntil,
            date: formattedDate,
            weekday: weekdayName
        };
    }
    function formatAgeData() {
        ageData.formattedTotalDays = formatNumber(ageData.totalDays);
        ageData.formattedTotalHours = formatNumber(ageData.totalHours);
        ageData.formattedTotalMinutes = formatNumber(ageData.totalMinutes);
        ageData.formattedTotalSeconds = formatNumber(ageData.totalSeconds);
        ageData.formattedTotalWeeks = formatNumber(ageData.totalWeeks);
        ageData.formattedTotalMonths = formatNumber(ageData.totalMonths);
    }
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function displayResults() {
        displayPrimaryAge(); 
        if (showDetailedCheckbox.checked) {
            displayDetailedBreakdown();
            displayAlternativeFormats();
        }
        if (showMilestonesCheckbox.checked) {
            displayMilestones();
        }
        displayNextBirthday();
        updateDisplayOptions();
    }
    function displayPrimaryAge() {
        primaryAgeElement.textContent = ageData.years;
        primaryAgeElement.classList.remove('pulse');
        setTimeout(() => {
            primaryAgeElement.classList.add('pulse');
        }, 100);
    }
    function displayDetailedBreakdown() {
        yearsValue.textContent = ageData.years;
        monthsValue.textContent = ageData.months;
        daysValue.textContent = ageData.days;
        if (includeTimeCheckbox.checked) {
            hoursValue.textContent = ageData.hours;
            minutesValue.textContent = ageData.minutes;
            secondsValue.textContent = ageData.seconds;
        } else {
            hoursValue.textContent = '0';
            minutesValue.textContent = '0';
            secondsValue.textContent = '0';
        }
    }
    function displayAlternativeFormats() {
        totalDays.textContent = ageData.formattedTotalDays;
        totalHours.textContent = ageData.formattedTotalHours;
        totalMinutes.textContent = ageData.formattedTotalMinutes;
        totalSeconds.textContent = ageData.formattedTotalSeconds;
        totalWeeks.textContent = ageData.formattedTotalWeeks;
        totalMonths.textContent = ageData.formattedTotalMonths;
    }
    function displayMilestones() {
        milestonesContainer.innerHTML = '';
        const currentAge = ageData.years;
        const relevantMilestones = ageMilestones.filter(milestone => 
            milestone.age <= currentAge + 10 && milestone.age >= currentAge - 5
        );
        relevantMilestones.forEach(milestone => {
            const milestoneElement = createMilestoneElement(milestone, currentAge);
            milestonesContainer.appendChild(milestoneElement);
        });
        if (relevantMilestones.length === 0) {
            const noMilestonesElement = document.createElement('div');
            noMilestonesElement.className = 'milestone-item';
            noMilestonesElement.innerHTML = `
                <span class="milestone-description">No major milestones in this age range</span>
            `;
            milestonesContainer.appendChild(noMilestonesElement);
        }
    }
    function createMilestoneElement(milestone, currentAge) {
        const milestoneDiv = document.createElement('div');
        milestoneDiv.className = 'milestone-item';
        if (milestone.age <= currentAge) {
            milestoneDiv.classList.add('achieved');
        } else {
            milestoneDiv.classList.add('upcoming');
        }
        const statusText = milestone.age <= currentAge ? 'Achieved' : 'Upcoming';
        const statusClass = milestone.age <= currentAge ? 'achieved' : 'upcoming';
        milestoneDiv.innerHTML = `
            <div>
                <span class="milestone-age">Age ${milestone.age}</span>
                <span class="milestone-description">${milestone.description}</span>
            </div>
            <span class="milestone-status ${statusClass}">${statusText}</span>
        `;
        return milestoneDiv;
    }
    function displayNextBirthday() {
        daysUntilBirthday.textContent = ageData.nextBirthday.daysUntil;
        nextBirthdayDate.textContent = ageData.nextBirthday.date;
        birthdayWeekday.textContent = ageData.nextBirthday.weekday;
    }
    function updateDisplayOptions() {
        detailedBreakdown.style.display = showDetailedCheckbox.checked ? 'block' : 'none';
        alternativeFormats.style.display = showDetailedCheckbox.checked ? 'block' : 'none';
        milestonesSection.style.display = showMilestonesCheckbox.checked ? 'block' : 'none';
        const timeField = birthTimeInput.parentElement;
        timeField.style.display = includeTimeCheckbox.checked ? 'block' : 'none';
    }
    function handleAutoUpdateToggle() {
        if (autoUpdateCheckbox.checked && birthDateTime) {
            startAutoUpdate();
        } else {
            stopAutoUpdate();
        }
    }
    function startAutoUpdate() {
        stopAutoUpdate(); 
        updateInterval = setInterval(() => {
            if (birthDateTime) {
                calculateAge();
                displayResults();
            }
        }, 1000);
    }
    function stopAutoUpdate() {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
    }
    function showResultsSection() {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function handleRecalculate() {
        stopAutoUpdate();
        resultsSection.style.display = 'none';
        birthDateInput.value = '';
        birthTimeInput.value = '';
        birthDateTime = null;
        ageData = {};
        document.querySelector('.input-section').scrollIntoView({ behavior: 'smooth' });
    }
    function showError(message) {
        alert(message); 
    }
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    function getDaysInMonth(year, month) {
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month === 1 && isLeapYear(year)) {
            return 29;
        }
        return daysInMonth[month];
    }
    updateDisplayOptions();
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !resultsSection.style.display !== 'none') {
            if (birthDateInput.value) {
                handleCalculate();
            }
        }
        if (e.key === 'Escape' && resultsSection.style.display !== 'none') {
            handleRecalculate();
        }
    });
    function addLoadingState() {
        calculateBtn.classList.add('loading');
        calculateBtn.disabled = true;
        calculateBtn.textContent = 'Calculating...';
    }
    function removeLoadingState() {
        calculateBtn.classList.remove('loading');
        calculateBtn.disabled = false;
        calculateBtn.textContent = 'Calculate Age';
    }
    const originalHandleCalculate = handleCalculate;
    handleCalculate = function() {
        addLoadingState();  
        setTimeout(() => {
            originalHandleCalculate();
            removeLoadingState();
        }, 500);
    };
    let isTabVisible = true;
    document.addEventListener('visibilitychange', function() {
        isTabVisible = !document.hidden;
        
        if (isTabVisible && autoUpdateCheckbox.checked && birthDateTime) {
            startAutoUpdate();
        } else if (!isTabVisible) {
            stopAutoUpdate();
        }
    });
    window.addEventListener('beforeunload', function() {
        stopAutoUpdate();
    });
    function smoothScrollToElement(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    function showEnhancedError(message, element = null) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin: 10px 0;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        if (element) {
            element.parentNode.insertBefore(errorDiv, element.nextSibling);
        } else {
            document.querySelector('.input-section').appendChild(errorDiv);
        }
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }    
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }
    function showTooltip(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(tooltip);
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    }
    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    initializeTooltips();
});