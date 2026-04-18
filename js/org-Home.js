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

// Chart.js Configuration
const ctx = document.getElementById('completionChart');

if (ctx) {
    const completionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['مكتملة', 'قيد الانتظار'],
            datasets: [{
                data: [75, 25],
                backgroundColor: [
                    '#d32f2f',
                    '#e5e7eb'
                ],
                borderWidth: 0,
                cutout: '75%'
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

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const period = button.dataset.period;
            
            // Update chart data based on period
            let completedValue, pendingValue;
            
            switch(period) {
                case 'day':
                    completedValue = 85;
                    pendingValue = 15;
                    break;
                case 'week':
                    completedValue = 75;
                    pendingValue = 25;
                    break;
                case 'month':
                    completedValue = 70;
                    pendingValue = 30;
                    break;
                default:
                    completedValue = 75;
                    pendingValue = 25;
            }
            
            // Update chart
            completionChart.data.datasets[0].data = [completedValue, pendingValue];
            completionChart.update();
            
            // Update center text
            document.querySelector('.chart-percentage').textContent = completedValue + '%';
            
            // Show notification
            showNotification(`تم تحديث البيانات إلى ${period === 'day' ? 'اليوم' : period === 'week' ? 'الأسبوع' : 'الشهر'}`, 'info');
        });
    });
}

// QR Code Scanner Functionality
const qrInput = document.getElementById('qr-manual-input');
const checkinBtn = document.getElementById('checkin-btn');
const qrFileInput = document.getElementById('qr-file-input');
const qrDropZone = document.getElementById('qr-drop-zone');
const qrPlaceholder = document.getElementById('qr-placeholder');
const qrPreview = document.getElementById('qr-preview');
const clearQrBtn = document.getElementById('clear-qr-btn');

// Click to upload
if (qrDropZone && qrFileInput) {
    qrDropZone.addEventListener('click', (e) => {
        // Don't trigger if clicking on corners or preview
        if (!e.target.closest('.qr-corner') && !e.target.closest('#qr-preview')) {
            qrFileInput.click();
        }
    });
}

// File input change
if (qrFileInput) {
    qrFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleQRFile(file);
        }
    });
}

// Drag and Drop functionality
if (qrDropZone) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        qrDropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        qrDropZone.addEventListener(eventName, () => {
            qrDropZone.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        qrDropZone.addEventListener(eventName, () => {
            qrDropZone.classList.remove('drag-over');
        }, false);
    });

    // Handle dropped files
    qrDropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            handleQRFile(files[0]);
        }
    }, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Handle QR file upload
function handleQRFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('الرجاء رفع صورة صالحة (PNG, JPG, JPEG)', 'error');
        return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('حجم الصورة كبير جداً. الحد الأقصى 5MB', 'error');
        return;
    }

    // Read and display the image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        qrPreview.src = e.target.result;
        qrPreview.style.display = 'block';
        qrPlaceholder.style.display = 'none';
        clearQrBtn.style.display = 'inline-flex';
        
        // Simulate QR code reading
        setTimeout(() => {
            const simulatedQRCode = 'QR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            qrInput.value = simulatedQRCode;
            showNotification('تم قراءة رمز QR بنجاح!', 'success');
            
            // Add scan animation
            qrPreview.style.animation = 'scanLine 1s ease-out';
            setTimeout(() => {
                qrPreview.style.animation = '';
            }, 1000);
        }, 1000);
    };
    
    reader.onerror = () => {
        showNotification('حدث خطأ أثناء قراءة الصورة', 'error');
    };
    
    reader.readAsDataURL(file);
    
    showNotification('جاري تحميل الصورة...', 'info');
}

// Clear QR image
if (clearQrBtn) {
    clearQrBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        qrPreview.style.display = 'none';
        qrPreview.src = '';
        qrPlaceholder.style.display = 'flex';
        clearQrBtn.style.display = 'none';
        qrFileInput.value = '';
        qrInput.value = '';
        showNotification('تم مسح الصورة', 'info');
    });
}

// Add scan animation
const scanStyle = document.createElement('style');
scanStyle.textContent = `
    @keyframes scanLine {
        0% {
            box-shadow: inset 0 100% 0 0 rgba(211, 47, 47, 0.2);
        }
        50% {
            box-shadow: inset 0 0% 0 0 rgba(211, 47, 47, 0.2);
        }
        100% {
            box-shadow: inset 0 100% 0 0 rgba(211, 47, 47, 0);
        }
    }
`;
document.head.appendChild(scanStyle);

if (checkinBtn) {
    checkinBtn.addEventListener('click', () => {
        const qrValue = qrInput.value.trim();
        
        if (!qrValue) {
            showNotification('الرجاء إدخال رمز QR أولاً', 'error');
            qrInput.focus();
            return;
        }
        
        // Add loading state
        const originalHTML = checkinBtn.innerHTML;
        checkinBtn.innerHTML = '<span class="loading">⏳</span><span>جاري التحقق...</span>';
        checkinBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Random success/failure for demo
            const isSuccess = Math.random() > 0.2;
            
            if (isSuccess) {
                checkinBtn.innerHTML = '<span>✅</span><span>تم التسجيل بنجاح</span>';
                showNotification(`تم تسجيل حضور المتبرع - رمز: ${qrValue}`, 'success');
                
                // Clear input
                qrInput.value = '';
                
                // Update stats
                updateStats();
            } else {
                checkinBtn.innerHTML = '<span>❌</span><span>فشل التسجيل</span>';
                showNotification('رمز QR غير صالح، الرجاء المحاولة مرة أخرى', 'error');
            }
            
            // Reset button after 2 seconds
            setTimeout(() => {
                checkinBtn.innerHTML = originalHTML;
                checkinBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Allow Enter key in QR input
if (qrInput) {
    qrInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkinBtn.click();
        }
    });
}

// Simulate QR scanner animation
const qrFrame = document.querySelector('.qr-frame');
if (qrFrame) {
    setInterval(() => {
        qrFrame.style.animation = 'none';
        setTimeout(() => {
            qrFrame.style.animation = 'pulse 2s ease-in-out';
        }, 10);
    }, 5000);
}

// Add pulse animation for QR frame
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4);
        }
        50% {
            transform: scale(1.02);
            box-shadow: 0 0 0 10px rgba(211, 47, 47, 0);
        }
    }
`;
document.head.appendChild(pulseStyle);

// Update Statistics
function updateStats() {
    const completedStat = document.querySelector('.card-success .stat-value');
    const totalStat = document.querySelector('.card-primary .stat-value');
    
    if (completedStat) {
        const currentValue = parseInt(completedStat.textContent);
        completedStat.style.animation = 'pulse 0.5s ease-out';
        completedStat.textContent = currentValue + 1;
        
        setTimeout(() => {
            completedStat.style.animation = '';
        }, 500);
    }
    
    if (totalStat) {
        const currentValue = parseInt(totalStat.textContent);
        totalStat.style.animation = 'pulse 0.5s ease-out';
        totalStat.textContent = currentValue + 1;
        
        setTimeout(() => {
            totalStat.style.animation = '';
        }, 500);
    }
}

// Contact Support Button
const contactSupportBtn = document.querySelector('.btn-contact-support');
if (contactSupportBtn) {
    contactSupportBtn.addEventListener('click', () => {
        showNotification('سيتم توجيهك إلى صفحة الدعم الفني', 'info');
        
        // Simulate navigation
        setTimeout(() => {
            console.log('Navigate to support page');
        }, 1000);
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

// Animate stats on load
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach((stat, index) => {
        const finalValue = parseInt(stat.textContent);
        stat.textContent = '0';
        
        setTimeout(() => {
            let currentValue = 0;
            const increment = finalValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentValue);
                }
            }, 20);
        }, index * 100);
    });
}

// Animate percentage on load
function animatePercentage() {
    const percentage = document.querySelector('.chart-percentage');
    if (!percentage) return;
    
    const finalValue = 75;
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
    animateStats();
    setTimeout(animatePercentage, 500);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus QR input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        qrInput.focus();
    }
    
    // Ctrl/Cmd + Enter to check in
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        checkinBtn.click();
    }
});

// Add hover effects to stat cards
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.stat-icon-wrapper');
        if (icon) {
            icon.style.transition = 'all 0.3s ease';
        }
    });
});

// Simulate real-time updates (optional)
function simulateRealtimeUpdates() {
    setInterval(() => {
        if (Math.random() > 0.95) {
            const urgentValue = document.querySelector('.card-warning .stat-value');
            if (urgentValue) {
                const currentValue = parseInt(urgentValue.textContent);
                urgentValue.textContent = currentValue + 1;
                urgentValue.style.animation = 'pulse 0.5s ease-out';
                
                setTimeout(() => {
                    urgentValue.style.animation = '';
                }, 500);
                
                showNotification('طلب عاجل جديد تم استلامه!', 'info');
            }
        }
    }, 10000); // Check every 10 seconds
}

// Uncomment to enable real-time updates
// simulateRealtimeUpdates();

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
console.log('Organization Dashboard initialized');
console.log('Chart.js version:', Chart.version);

// Add loading indicator for chart
const chartContainer = document.querySelector('.chart-container');
if (chartContainer && !ctx) {
    chartContainer.innerHTML = `
        <div style="text-align: center; color: #6b7280;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <p style="font-weight: 600;">جاري تحميل البيانات...</p>
        </div>
    `;
}

console.log('All event listeners attached successfully');