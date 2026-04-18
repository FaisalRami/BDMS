// Mobile Menu Functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// Peak Times Chart with Chart.js
const peakTimesCtx = document.getElementById('peakTimesChart');
let peakTimesChart = null;

if (peakTimesCtx) {
    peakTimesChart = new Chart(peakTimesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'التفاعلات',
                data: [65, 90, 70, 95, 80, 75, 105, 120, 85, 110, 95, 125],
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#d32f2f',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#d32f2f',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'Cairo',
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: 'Cairo',
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f3f4f6',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: 'Cairo',
                            size: 12
                        },
                        color: '#6b7280'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: 'Cairo',
                            size: 12
                        },
                        color: '#6b7280'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Animate Statistics Values
function animateValue(element, start, end, duration, isDecimal = false) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = progress * (end - start) + start;
        
        if (isDecimal) {
            element.textContent = currentValue.toFixed(2) + '%';
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString('ar-EG');
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate all statistics on page load
function animateStatistics() {
    const statValues = document.querySelectorAll('.stat-card-value');
    
    statValues.forEach((stat, index) => {
        const text = stat.textContent.trim();
        const isPercentage = text.includes('%');
        const cleanNumber = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(cleanNumber)) {
            stat.textContent = '0';
            setTimeout(() => {
                animateValue(stat, 0, cleanNumber, 1500, isPercentage);
            }, index * 150);
        }
    });
}

// View All Activities Button
const viewAllBtn = document.querySelector('.btn-view-all');
if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
        showNotification('سيتم إعادة توجيهك إلى صفحة الأنشطة الكاملة', 'info');
    });
}

// Notification Function
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;

    const icon = type === 'success' ? '✅' : 'ℹ️';
    notification.innerHTML = `
        <span style="font-size: 1.5rem;">${icon}</span>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.4s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

// Add slide up animation
const slideUpStyle = document.createElement('style');
slideUpStyle.textContent = `
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(slideUpStyle);

// Notification Button Click
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        showNotification('لديك إشعاران جديدان', 'info');
    });
}

// Profile Section Click
const profileSection = document.querySelector('.profile-section');
if (profileSection) {
    profileSection.addEventListener('click', () => {
        showNotification('سيتم إعادة توجيهك إلى الملف الشخصي', 'info');
    });
}

// Add hover effect to activity items
const activityItems = document.querySelectorAll('.activity-item');
activityItems.forEach(item => {
    item.addEventListener('click', () => {
        const activityText = item.querySelector('.activity-text').textContent;
        showNotification('تم فتح تفاصيل: ' + activityText.substring(0, 30) + '...', 'info');
    });
});

// Simulate real-time activity updates
function addNewActivity() {
    const activities = [
        { icon: 'blue', text: 'تم إنشاء طلب تبرع جديد', time: 'الآن' },
        { icon: 'green', text: 'تمت الموافقة على متبرع جديد', time: 'الآن' },
        { icon: 'purple', text: 'تم إطلاق حملة جديدة', time: 'الآن' }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const activitiesList = document.querySelector('.activities-list');
    
    if (activitiesList) {
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-item';
        newActivity.style.animation = 'slideInRight 0.5s ease-out';
        newActivity.innerHTML = `
            <div class="activity-icon activity-icon-${randomActivity.icon}">
                ${randomActivity.icon === 'blue' ? '➕' : randomActivity.icon === 'green' ? '✓' : '📢'}
            </div>
            <div class="activity-content">
                <p class="activity-text">${randomActivity.text}</p>
                <span class="activity-time">${randomActivity.time}</span>
            </div>
        `;
        
        activitiesList.insertBefore(newActivity, activitiesList.firstChild);
        
        // Remove last item if more than 6
        if (activitiesList.children.length > 6) {
            activitiesList.removeChild(activitiesList.lastChild);
        }
        
        showNotification('نشاط جديد: ' + randomActivity.text, 'info');
    }
}

// Add animation for new activities
const slideInRightStyle = document.createElement('style');
slideInRightStyle.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(slideInRightStyle);

// Simulate real-time updates every 10 seconds (optional)
// Uncomment to enable
// setInterval(addNewActivity, 10000);

// Animate blood type percentages
function animateBloodTypes() {
    const percentages = document.querySelectorAll('.blood-type-percentage');
    percentages.forEach((percentage, index) => {
        percentage.style.opacity = '0';
        setTimeout(() => {
            percentage.style.transition = 'opacity 0.5s ease-out';
            percentage.style.opacity = '1';
        }, index * 100);
    });
}

// Call animations on page load
window.addEventListener('load', () => {
    setTimeout(animateStatistics, 300);
    setTimeout(animateBloodTypes, 1000);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R to refresh data
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        showNotification('جاري تحديث البيانات...', 'info');
        setTimeout(() => {
            animateStatistics();
            showNotification('تم تحديث البيانات بنجاح', 'success');
        }, 1000);
    }
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize page
console.log('Statistics Page initialized successfully');
console.log('Chart.js version:', Chart.version);

// Update stats periodically (every 30 seconds)
function updateStatsPeriodically() {
    const statValues = document.querySelectorAll('.stat-card-value');
    
    statValues.forEach(stat => {
        const text = stat.textContent.trim();
        const isPercentage = text.includes('%');
        const currentValue = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(currentValue) && Math.random() > 0.7) {
            const change = Math.random() > 0.5 ? 1 : -1;
            const newValue = isPercentage ? 
                Math.max(0, Math.min(100, currentValue + (change * 0.1))) :
                Math.max(0, currentValue + change);
            
            stat.style.animation = 'pulse 0.5s ease-out';
            if (isPercentage) {
                stat.textContent = newValue.toFixed(2) + '%';
            } else {
                stat.textContent = Math.floor(newValue).toLocaleString('ar-EG');
            }
            
            setTimeout(() => {
                stat.style.animation = '';
            }, 500);
        }
    });
}

// Uncomment to enable periodic updates
// setInterval(updateStatsPeriodically, 30000);

console.log('All event listeners attached successfully');