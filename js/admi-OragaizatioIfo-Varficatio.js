// Mobile Menu Functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// Back Button
const backBtn = document.getElementById('back-btn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        showNotification('جاري العودة إلى قائمة الانتظار...', 'info');
        setTimeout(() => {
            // Navigate back or redirect
            window.history.back();
        }, 1000);
    });
}

// License Document Modal
const licenseModal = document.getElementById('license-modal');
const viewLicenseBtn = document.getElementById('view-license-btn');
const closeLicenseModal = document.getElementById('close-license-modal');
const closeLicenseBtn = document.getElementById('close-license-btn');
const downloadLicenseBtn = document.getElementById('download-license-btn');

if (viewLicenseBtn) {
    viewLicenseBtn.addEventListener('click', () => {
        licenseModal.classList.add('active');
    });
}

if (closeLicenseModal) {
    closeLicenseModal.addEventListener('click', () => {
        licenseModal.classList.remove('active');
    });
}

if (closeLicenseBtn) {
    closeLicenseBtn.addEventListener('click', () => {
        licenseModal.classList.remove('active');
    });
}

if (downloadLicenseBtn) {
    downloadLicenseBtn.addEventListener('click', () => {
        downloadLicenseBtn.innerHTML = '<span>⏳</span><span>جاري التحميل...</span>';
        downloadLicenseBtn.disabled = true;

        setTimeout(() => {
            showNotification('تم تحميل وثيقة الترخيص بنجاح', 'success');
            downloadLicenseBtn.innerHTML = '<span>⬇</span><span>تحميل المستند</span>';
            downloadLicenseBtn.disabled = false;
        }, 2000);
    });
}

// Close license modal when clicking outside
if (licenseModal) {
    licenseModal.addEventListener('click', (e) => {
        if (e.target === licenseModal) {
            licenseModal.classList.remove('active');
        }
    });
}

// Confirmation Modal
const confirmationModal = document.getElementById('confirmation-modal');
const closeConfirmationModal = document.getElementById('close-confirmation-modal');
const confirmActionBtn = document.getElementById('confirm-action-btn');
const cancelActionBtn = document.getElementById('cancel-action-btn');
const confirmationTitle = document.getElementById('confirmation-title');
const confirmationMessage = document.getElementById('confirmation-message');

let currentAction = null;

// Verify Organization Button
const verifyBtn = document.getElementById('verify-btn');
if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
        currentAction = 'verify';
        confirmationTitle.textContent = 'تأكيد التحقق';
        confirmationMessage.textContent = 'هل أنت متأكد من اعطاء صلاحية لهذه المنظمة؟ سيتم منحها حق الوصول الكامل إلى النظام.';
        confirmationModal.classList.add('active');
    });
}

// Reject Organization Button
const rejectBtn = document.getElementById('reject-btn');
if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
        currentAction = 'reject';
        confirmationTitle.textContent = 'تأكيد الرفض';
        confirmationMessage.textContent = 'هل أنت متأكد من أنك تريد رفض هذه المنظمة؟ لن تتمكن من الوصول إلى النظام.';
        confirmationModal.classList.add('active');
    });
}

// Confirm Action
if (confirmActionBtn) {
    confirmActionBtn.addEventListener('click', () => {
        if (currentAction === 'verify') {
            handleVerifyAction();
        } else if (currentAction === 'reject') {
            handleRejectAction();
        }
    });
}

// Cancel Action
if (cancelActionBtn) {
    cancelActionBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('active');
        currentAction = null;
    });
}

// Close confirmation modal
if (closeConfirmationModal) {
    closeConfirmationModal.addEventListener('click', () => {
        confirmationModal.classList.remove('active');
        currentAction = null;
    });
}

// Close confirmation modal when clicking outside
if (confirmationModal) {
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.classList.remove('active');
            currentAction = null;
        }
    });
}

// Handle Verify Action
function handleVerifyAction() {
    confirmActionBtn.innerHTML = '<span>⏳</span><span>جاري المعالجة...</span>';
    confirmActionBtn.disabled = true;
    cancelActionBtn.disabled = true;

    setTimeout(() => {
        confirmationModal.classList.remove('active');
        showNotification('تم التحقق من المنظمة بنجاح! سيتم إرسال إشعار بالبريد الإلكتروني.', 'success');

        // Reset buttons
        confirmActionBtn.innerHTML = 'تأكيد';
        confirmActionBtn.disabled = false;
        cancelActionBtn.disabled = false;

        // Redirect after delay
        setTimeout(() => {
            showNotification('جاري إعادة التوجيه إلى قائمة الانتظار...', 'info');
            setTimeout(() => {
                // Navigate back
                window.history.back();
            }, 1500);
        }, 2000);
    }, 1500);
}

// Handle Reject Action
function handleRejectAction() {
    confirmActionBtn.innerHTML = '<span>⏳</span><span>جاري المعالجة...</span>';
    confirmActionBtn.disabled = true;
    cancelActionBtn.disabled = true;

    setTimeout(() => {
        confirmationModal.classList.remove('active');
        showNotification('تم رفض المنظمة. سيتم إرسال إشعار بالبريد الإلكتروني.', 'warning');

        // Reset buttons
        confirmActionBtn.innerHTML = 'تأكيد';
        confirmActionBtn.disabled = false;
        cancelActionBtn.disabled = false;

        // Redirect after delay
        setTimeout(() => {
            showNotification('جاري إعادة التوجيه إلى قائمة الانتظار...', 'info');
            setTimeout(() => {
                // Navigate back
                window.history.back();
            }, 1500);
        }, 2000);
    }, 1500);
}

// Save Admin Notes
const saveNoteBtn = document.getElementById('save-note-btn');
const adminNotes = document.getElementById('admin-notes');

if (saveNoteBtn && adminNotes) {
    saveNoteBtn.addEventListener('click', () => {
        const noteText = adminNotes.value.trim();

        if (!noteText) {
            showNotification('الرجاء إدخال ملاحظة قبل الحفظ', 'warning');
            return;
        }

        saveNoteBtn.innerHTML = '<span>⏳</span><span>جاري الحفظ...</span>';
        saveNoteBtn.disabled = true;

        setTimeout(() => {
            showNotification('تم حفظ الملاحظة بنجاح', 'success');
            saveNoteBtn.innerHTML = 'حفظ الملاحظة';
            saveNoteBtn.disabled = false;

            // Add animation to indicate save
            adminNotes.style.animation = 'pulse 0.5s ease-out';
            setTimeout(() => {
                adminNotes.style.animation = '';
            }, 500);
        }, 1000);
    });
}

// Add pulse animation
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(pulseStyle);

// Notification Function
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;

    const icon = type === 'success' ? '✅' : 
                 type === 'warning' ? '⚠️' : 
                 type === 'info' ? 'ℹ️' : '❌';
    
    notification.innerHTML = `
        <span style="font-size: 1.5rem;">${icon}</span>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUpToast 0.4s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// Add slide up animation for toast
const slideUpToastStyle = document.createElement('style');
slideUpToastStyle.textContent = `
    @keyframes slideUpToast {
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
document.head.appendChild(slideUpToastStyle);

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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        if (licenseModal && licenseModal.classList.contains('active')) {
            licenseModal.classList.remove('active');
        }
        if (confirmationModal && confirmationModal.classList.contains('active')) {
            confirmationModal.classList.remove('active');
            currentAction = null;
        }
    }

    // Ctrl/Cmd + S to save notes
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (saveNoteBtn && !saveNoteBtn.disabled) {
            saveNoteBtn.click();
        }
    }
});

// Animate cards on load
function animateCards() {
    const cards = document.querySelectorAll('.info-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

window.addEventListener('load', () => {
    animateCards();
});

// Add smooth scroll
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

// Auto-save notes draft
let notesSaveTimeout;
if (adminNotes) {
    adminNotes.addEventListener('input', () => {
        clearTimeout(notesSaveTimeout);
        notesSaveTimeout = setTimeout(() => {
            const noteText = adminNotes.value.trim();
            if (noteText) {
                // Save draft to localStorage
                try {
                    localStorage.setItem('admin-notes-draft', noteText);
                    console.log('Draft saved');
                } catch (e) {
                    console.log('Could not save draft');
                }
            }
        }, 1000);
    });

    // Load draft on page load
    try {
        const draft = localStorage.getItem('admin-notes-draft');
        if (draft && !adminNotes.value) {
            adminNotes.value = draft;
        }
    } catch (e) {
        console.log('Could not load draft');
    }
}

// Clear draft after successful save
const originalHandleVerifyAction = handleVerifyAction;
handleVerifyAction = function() {
    try {
        localStorage.removeItem('admin-notes-draft');
    } catch (e) {
        console.log('Could not clear draft');
    }
    originalHandleVerifyAction();
};

const originalHandleRejectAction = handleRejectAction;
handleRejectAction = function() {
    try {
        localStorage.removeItem('admin-notes-draft');
    } catch (e) {
        console.log('Could not clear draft');
    }
    originalHandleRejectAction();
};

console.log('Organization Verification Details Page initialized');
console.log('Organization: مركز الحياة للدم');