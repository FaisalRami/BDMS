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

// Completion Rate Doughnut Chart
const completionCtx = document.getElementById('completionChart');
let completionChart = null;

if (completionCtx) {
    completionChart = new Chart(completionCtx, {
        type: 'doughnut',
        data: {
            labels: ['مكتملة', 'قيد التنفيذ', 'معلقة'],
            datasets: [{
                data: [50, 30, 20],
                backgroundColor: [
                    '#d32f2f',
                    '#3b82f6',
                    '#f59e0b'
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Donations Over Time Line Chart
const donationsCtx = document.getElementById('donationsChart');
let donationsChart = null;

if (donationsCtx) {
    donationsChart = new Chart(donationsCtx, {
        type: 'line',
        data: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
            datasets: [{
                label: 'التبرعات',
                data: [65, 75, 85, 95, 120, 110, 130, 140, 125, 135, 150, 145],
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

// Chart Tabs Functionality
const chartTabs = document.querySelectorAll('.chart-tab');

chartTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const chartType = tab.dataset.chart;
        const period = tab.dataset.period;
        
        // Remove active class from sibling tabs
        const siblingTabs = tab.parentElement.querySelectorAll('.chart-tab');
        siblingTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Update chart data based on period
        if (chartType === 'completion' && completionChart) {
            let data;
            let percentage;
            
            switch(period) {
                case 'day':
                    data = [60, 25, 15];
                    percentage = '60%';
                    break;
                case 'week':
                    data = [50, 30, 20];
                    percentage = '50%';
                    break;
                case 'month':
                    data = [45, 35, 20];
                    percentage = '45%';
                    break;
                default:
                    data = [50, 30, 20];
                    percentage = '50%';
            }
            
            completionChart.data.datasets[0].data = data;
            completionChart.update();
            
            document.querySelector('.chart-percentage').textContent = percentage;
            showNotification('تم تحديث البيانات', 'success');
        }
        
        if (chartType === 'blood') {
            showNotification(`تم تحديث بيانات ${period === 'month' ? 'الشهر' : 'السنة'}`, 'info');
        }
    });
});

// Time Filters Functionality
const timeButtons = document.querySelectorAll('.time-btn');

timeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        timeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const period = button.dataset.period;
        let message = '';
        
        switch(period) {
            case '7':
                message = 'تم تحديث البيانات لآخر 7 أيام';
                break;
            case '30':
                message = 'تم تحديث البيانات لآخر 30 يوم';
                break;
            case 'all':
                message = 'تم تحديث البيانات لكل الوقت';
                break;
        }
        
        showNotification(message, 'info');
        
        // Animate metrics
        animateMetrics();
    });
});

// Download Report Functionality
const downloadReportBtn = document.getElementById('download-report');

if (downloadReportBtn) {
    downloadReportBtn.addEventListener('click', () => {
        const originalHTML = downloadReportBtn.innerHTML;
        downloadReportBtn.innerHTML = '<span>⏳</span><span>جاري التحميل...</span>';
        downloadReportBtn.disabled = true;
        
        setTimeout(() => {
            downloadReportBtn.innerHTML = '<span>✅</span><span>تم التحميل</span>';
            showNotification('تم تحميل التقرير بنجاح', 'success');
            
            setTimeout(() => {
                downloadReportBtn.innerHTML = originalHTML;
                downloadReportBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Animate Metrics on Load
function animateMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    metricValues.forEach((metric, index) => {
        const text = metric.textContent.trim();
        const isPercentage = text.includes('%');
        const number = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        if (isNaN(number)) return;
        
        metric.textContent = isPercentage ? '0%' : '0';
        
        setTimeout(() => {
            let currentValue = 0;
            const increment = number / 50;
            
            const timer = setInterval(() => {
                currentValue += increment;
                
                if (currentValue >= number) {
                    metric.textContent = isPercentage ? 
                        number.toFixed(1) + '%' : 
                        Math.floor(number).toLocaleString('ar-EG');
                    clearInterval(timer);
                } else {
                    metric.textContent = isPercentage ? 
                        currentValue.toFixed(1) + '%' : 
                        Math.floor(currentValue).toLocaleString('ar-EG');
                }
            }, 20);
        }, index * 100);
    });
}

// Animate Blood Stats Bars
function animateBloodBars() {
    const bars = document.querySelectorAll('.blood-stat-fill');
    
    bars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, index * 100);
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

    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
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

// Notification Button
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        showNotification('لديك إشعاران جديدان', 'info');
    });
}

// Profile Section
const profileSection = document.querySelector('.profile-section');
if (profileSection) {
    profileSection.addEventListener('click', () => {
        showNotification('سيتم إعادة توجيهك إلى الملف الشخصي', 'info');
    });
}

// Animate percentage on load
function animateChartPercentage() {
    const percentage = document.querySelector('.chart-percentage');
    if (!percentage) return;
    
    const finalValue = 50;
    let currentValue = 0;
    
    percentage.textContent = '0%';
    
    const timer = setInterval(() => {
        currentValue += 1;
        percentage.textContent = currentValue + '%';
        
        if (currentValue >= finalValue) {
            clearInterval(timer);
        }
    }, 20);
}

// Call animations on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        animateMetrics();
    }, 300);
    
    setTimeout(() => {
        animateChartPercentage();
    }, 800);
    
    setTimeout(() => {
        animateBloodBars();
    }, 1200);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D to download report
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        downloadReportBtn.click();
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

// Add hover effects
document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.metric-icon-wrapper');
        if (icon) {
            icon.style.transition = 'all 0.3s ease';
        }
    });
});

// Initialize page
console.log('Reports Page initialized');
console.log('Chart.js version:', Chart.version);
console.log('All charts loaded successfully');

// Simulate real-time data updates (optional)
function simulateDataUpdates() {
    setInterval(() => {
        if (Math.random() > 0.95) {
            const randomMetric = document.querySelectorAll('.metric-value')[Math.floor(Math.random() * 4)];
            const currentValue = parseInt(randomMetric.textContent.replace(/[^0-9]/g, ''));
            
            randomMetric.textContent = (currentValue + 1).toLocaleString('ar-EG');
            randomMetric.style.animation = 'pulse 0.5s ease-out';
            
            setTimeout(() => {
                randomMetric.style.animation = '';
            }, 500);
        }
    }, 5000);
}

// Uncomment to enable real-time updates
// simulateDataUpdates();

console.log('All event listeners attached successfully');