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

// Tabs Functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Initialize tabs
function initTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// Switch to specific tab
function switchTab(tabName) {
    // Remove active class from all buttons and panes
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));

    // Add active class to clicked button and corresponding pane
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    const activePane = document.getElementById(`${tabName}-tab`);

    if (activeButton && activePane) {
        activeButton.classList.add('active');
        activePane.classList.add('active');
        
        // Save current tab to localStorage
        localStorage.setItem('currentProfileTab', tabName);
        
        // Log tab change
        console.log(`Switched to tab: ${tabName}`);
    }
}

// Load last active tab on page load
function loadLastActiveTab() {
    const lastTab = localStorage.getItem('currentProfileTab');
    if (lastTab) {
        switchTab(lastTab);
    }
}

// Form Elements
const updateBtn = document.getElementById('update-btn');
const cancelBtn = document.getElementById('cancel-btn');
const changeLogoBtn = document.getElementById('change-logo-btn');

// Profile Data Storage
let profileData = {
    organization: {
        name: '',
        type: '',
        licenseNumber: '',
        logo: ''
    },
    contact: {
        mainPhone: '',
        mainEmail: '',
        website: '',
        physicalAddress: ''
    },
    admin: {
        name: '',
        email: '',
        phone: ''
    },
    description: {
        mission: ''
    }
};

// Load saved profile data
function loadProfileData() {
    const savedData = localStorage.getItem('organizationProfile');
    if (savedData) {
        try {
            profileData = JSON.parse(savedData);
            populateForm(profileData);
            showNotification('تم تحميل البيانات المحفوظة', 'info');
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    }
}

// Populate form with data
function populateForm(data) {
    // Organization Details
    if (data.organization) {
        const orgName = document.getElementById('org-name');
        const orgType = document.getElementById('org-type');
        const licenseNumber = document.getElementById('license-number');
        
        if (orgName) orgName.value = data.organization.name || '';
        if (orgType) orgType.value = data.organization.type || '';
        if (licenseNumber) licenseNumber.value = data.organization.licenseNumber || '';
    }

    // Contact Information
    if (data.contact) {
        const mainPhone = document.getElementById('main-phone');
        const mainEmail = document.getElementById('main-email');
        const website = document.getElementById('website');
        const physicalAddress = document.getElementById('physical-address');
        
        if (mainPhone) mainPhone.value = data.contact.mainPhone || '';
        if (mainEmail) mainEmail.value = data.contact.mainEmail || '';
        if (website) website.value = data.contact.website || '';
        if (physicalAddress) physicalAddress.value = data.contact.physicalAddress || '';
    }

    // Administrative Contact
    if (data.admin) {
        const adminName = document.getElementById('admin-name');
        const adminEmail = document.getElementById('admin-email');
        const adminPhone = document.getElementById('admin-phone');
        
        if (adminName) adminName.value = data.admin.name || '';
        if (adminEmail) adminEmail.value = data.admin.email || '';
        if (adminPhone) adminPhone.value = data.admin.phone || '';
    }

    // Optional Description
    if (data.description) {
        const orgMission = document.getElementById('org-mission');
        if (orgMission) orgMission.value = data.description.mission || '';
    }
}

// Collect form data
function collectFormData() {
    return {
        organization: {
            name: document.getElementById('org-name')?.value || '',
            type: document.getElementById('org-type')?.value || '',
            licenseNumber: document.getElementById('license-number')?.value || '',
            logo: profileData.organization.logo
        },
        contact: {
            mainPhone: document.getElementById('main-phone')?.value || '',
            mainEmail: document.getElementById('main-email')?.value || '',
            website: document.getElementById('website')?.value || '',
            physicalAddress: document.getElementById('physical-address')?.value || ''
        },
        admin: {
            name: document.getElementById('admin-name')?.value || '',
            email: document.getElementById('admin-email')?.value || '',
            phone: document.getElementById('admin-phone')?.value || ''
        },
        description: {
            mission: document.getElementById('org-mission')?.value || ''
        }
    };
}

// Validate form data
function validateForm(data) {
    const errors = [];

    // Validate Organization Details
    if (!data.organization.name.trim()) {
        errors.push('اسم المنظمة مطلوب');
    }
    if (!data.organization.type) {
        errors.push('نوع المنظمة مطلوب');
    }
    if (!data.organization.licenseNumber.trim()) {
        errors.push('رقم الترخيص مطلوب');
    }

    // Validate Contact Information
    if (!data.contact.mainPhone.trim()) {
        errors.push('الهاتف الرئيسي مطلوب');
    }
    if (!data.contact.mainEmail.trim()) {
        errors.push('البريد الإلكتروني الرئيسي مطلوب');
    } else if (!isValidEmail(data.contact.mainEmail)) {
        errors.push('البريد الإلكتروني الرئيسي غير صحيح');
    }
    if (!data.contact.physicalAddress.trim()) {
        errors.push('العنوان الفعلي مطلوب');
    }

    // Validate Administrative Contact
    if (!data.admin.name.trim()) {
        errors.push('اسم المسؤول مطلوب');
    }
    if (!data.admin.email.trim()) {
        errors.push('البريد الإلكتروني للمسؤول مطلوب');
    } else if (!isValidEmail(data.admin.email)) {
        errors.push('البريد الإلكتروني للمسؤول غير صحيح');
    }

    return errors;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    
    let icon, bgColor, textColor, borderColor;
    
    if (type === 'success') {
        icon = '✅';
        bgColor = 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
        textColor = '#065f46';
        borderColor = '#10b981';
    } else if (type === 'error') {
        icon = '❌';
        bgColor = 'linear-gradient(135deg, #fee2e2, #fecaca)';
        textColor = '#991b1b';
        borderColor = '#ef4444';
    } else if (type === 'info') {
        icon = 'ℹ️';
        bgColor = 'linear-gradient(135deg, #dbeafe, #bfdbfe)';
        textColor = '#1e40af';
        borderColor = '#3b82f6';
    }

    notification.innerHTML = `
        <span style="font-size: 1.75rem;">${icon}</span>
        <span style="font-weight: 700;">${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: ${textColor};
        border: 2px solid ${borderColor};
        padding: 1.25rem 2.5rem;
        border-radius: 14px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        font-family: "Cairo", sans-serif;
        font-size: 1.05rem;
        animation: slideDownToast 0.4s ease-out;
        max-width: 90%;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUpToast 0.4s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

// Update Profile Button Handler
if (updateBtn) {
    updateBtn.addEventListener('click', async () => {
        // Collect form data
        const data = collectFormData();

        // Validate form
        const errors = validateForm(data);
        if (errors.length > 0) {
            showNotification(errors[0], 'error');
            // Highlight first error field
            highlightErrorField(errors[0]);
            return;
        }

        // Change button state
        const originalHTML = updateBtn.innerHTML;
        updateBtn.innerHTML = '<span>⏳</span> جاري التحديث...';
        updateBtn.disabled = true;
        if (cancelBtn) cancelBtn.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Save to localStorage
        try {
            localStorage.setItem('organizationProfile', JSON.stringify(data));
            profileData = data;
            showNotification('تم تحديث الملف الشخصي بنجاح!', 'success');
            
            // Log success
            console.log('Profile updated:', data);
        } catch (error) {
            showNotification('حدث خطأ أثناء حفظ البيانات', 'error');
            console.error('Save error:', error);
        }

        // Restore button
        updateBtn.innerHTML = originalHTML;
        updateBtn.disabled = false;
        if (cancelBtn) cancelBtn.disabled = false;
    });
}

// Cancel Button Handler
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من إلغاء التغييرات؟')) {
            loadProfileData();
            showNotification('تم إلغاء التغييرات', 'info');
        }
    });
}

// Highlight error field helper
function highlightErrorField(errorMessage) {
    // Map error messages to field IDs
    const fieldMap = {
        'اسم المنظمة': 'org-name',
        'نوع المنظمة': 'org-type',
        'رقم الترخيص': 'license-number',
        'الهاتف الرئيسي': 'main-phone',
        'البريد الإلكتروني الرئيسي': 'main-email',
        'العنوان الفعلي': 'physical-address',
        'اسم المسؤول': 'admin-name',
        'البريد الإلكتروني للمسؤول': 'admin-email'
    };

    for (const [key, fieldId] of Object.entries(fieldMap)) {
        if (errorMessage.includes(key)) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.style.borderColor = '#ef4444';
                field.focus();
                setTimeout(() => {
                    field.style.borderColor = '';
                }, 3000);
            }
            break;
        }
    }
}

// Logo Upload Handler
if (changeLogoBtn) {
    changeLogoBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    showNotification('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    const logoImg = document.getElementById('org-logo');
                    if (logoImg) {
                        logoImg.src = event.target.result;
                        profileData.organization.logo = event.target.result;
                        showNotification('تم تحميل الشعار بنجاح', 'success');
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        
        fileInput.click();
    });
}

// Auto-save functionality (every 30 seconds)
let autoSaveInterval;

function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        const data = collectFormData();
        try {
            localStorage.setItem('organizationProfile_autosave', JSON.stringify(data));
            console.log('Auto-saved at:', new Date().toLocaleTimeString('ar-SA'));
        } catch (error) {
            console.error('Auto-save error:', error);
        }
    }, 30000); // 30 seconds
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
}

// Real-time validation for email fields
function addEmailValidation(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('blur', () => {
        if (input.value.trim() !== '' && !isValidEmail(input.value)) {
            input.style.borderColor = '#ef4444';
            showNotification('البريد الإلكتروني غير صحيح', 'error');
        } else if (input.value.trim() !== '') {
            input.style.borderColor = '#10b981';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
    });
}

// Add email validation
addEmailValidation('main-email');
addEmailValidation('admin-email');

// Phone number formatting
function formatPhoneNumber(input) {
    if (!input) return;
    
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format as: +1 (555) 123-4567
        if (value.length > 0) {
            if (value.length <= 1) {
                value = `+${value}`;
            } else if (value.length <= 4) {
                value = `+${value.slice(0, 1)} (${value.slice(1)}`;
            } else if (value.length <= 7) {
                value = `+${value.slice(0, 1)} (${value.slice(1, 4)}) ${value.slice(4)}`;
            } else {
                value = `+${value.slice(0, 1)} (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 11)}`;
            }
        }
        
        e.target.value = value;
    });
}

// Apply phone formatting
formatPhoneNumber(document.getElementById('main-phone'));
formatPhoneNumber(document.getElementById('admin-phone'));

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (updateBtn) updateBtn.click();
    }

    // Ctrl/Cmd + 1-4 to switch tabs
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const tabNames = ['organization', 'contact', 'admin', 'description'];
        const tabIndex = parseInt(e.key) - 1;
        if (tabNames[tabIndex]) {
            switchTab(tabNames[tabIndex]);
        }
    }
});

// Track unsaved changes
let hasUnsavedChanges = false;

document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('input', () => {
        hasUnsavedChanges = true;
    });
});

updateBtn?.addEventListener('click', () => {
    hasUnsavedChanges = false;
});

window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'لديك تغييرات غير محفوظة. هل تريد المغادرة؟';
    }
});

// Add animations CSS
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideDownToast {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUpToast {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-30px);
        }
    }
`;
document.head.appendChild(animationStyles);

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tabs
    initTabs();
    
    // Load last active tab
    loadLastActiveTab();
    
    // Load profile data
    loadProfileData();
    
    // Start auto-save
    startAutoSave();
    
    // Show welcome message
    setTimeout(() => {
        showNotification('مرحباً بك في صفحة الملف الشخصي', 'info');
    }, 500);
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    stopAutoSave();
});

// Log activity
function logActivity(action, details) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${action}:`, details);
}

// Track profile updates
updateBtn?.addEventListener('click', () => {
    logActivity('PROFILE_UPDATE', 'Organization profile updated');
});

// Track tab switches
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        logActivity('TAB_SWITCH', `Switched to ${tabName} tab`);
    });
});

console.log('✅ BloodBridge Organization Profile - Initialized Successfully');



// File Action Buttons - View and Re-upload
const btnView = document.getElementById('btn-file-action');
const btnReupload = document.querySelector('.btn-file-action.secondary');

// View License Document Button
if (btnView) {
    btnView.addEventListener('click', () => {
        // Simulate opening PDF in new tab
        showNotification('جاري فتح المستند...', 'info');
        
        setTimeout(() => {
            // In production, this would open the actual document
            const documentUrl = 'license_document_final.pdf';
            window.open(documentUrl, '_blank');
            console.log('Opening document:', documentUrl);
        }, 500);
    });
}

// Re-upload License Document Button
if (btnReupload) {
    btnReupload.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    showNotification('حجم الملف يجب أن يكون أقل من 10 ميجابايت', 'error');
                    return;
                }

                // Check file type
                const allowedTypes = ['application/pdf', 'application/msword', 
                                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                     'image/jpeg', 'image/jpg', 'image/png'];
                
                if (!allowedTypes.includes(file.type)) {
                    showNotification('نوع الملف غير مدعوم. الرجاء رفع PDF, DOC, DOCX, أو صورة', 'error');
                    return;
                }

                // Simulate upload
                const originalHTML = btnReupload.innerHTML;
                btnReupload.innerHTML = '<span>⏳</span> جاري الرفع...';
                btnReupload.disabled = true;

                setTimeout(() => {
                    // Update file name display
                    const fileNameDisplay = document.querySelector('.file-name');
                    if (fileNameDisplay) {
                        fileNameDisplay.textContent = file.name;
                    }

                    // Save to profile data
                    if (!profileData.organization) {
                        profileData.organization = {};
                    }
                    profileData.organization.licenseDocument = file.name;

                    showNotification(`تم رفع الملف: ${file.name}`, 'success');
                    
                    // Restore button
                    btnReupload.innerHTML = originalHTML;
                    btnReupload.disabled = false;

                    console.log('Document uploaded:', file.name);
                }, 1500);
            }
        };
        
        fileInput.click();
    });
}