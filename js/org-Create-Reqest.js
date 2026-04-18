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

// Radio Options Functionality
const radioOptions = document.querySelectorAll('.radio-option');

radioOptions.forEach(option => {
    option.addEventListener('click', () => {
        const input = option.querySelector('input[type="radio"]');
        const name = input.name;
        
        // Remove selected class from all options with the same name
        document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
            radio.closest('.radio-option').classList.remove('selected');
        });
        
        // Add selected class to clicked option
        option.classList.add('selected');
        input.checked = true;
    });
});

// Form Validation
const form = document.getElementById('create-request-form');
const unitsInput = document.getElementById('units');
const bloodTypeSelect = document.getElementById('bloodType');
const deadlineInput = document.getElementById('deadline');

// Real-time validation
unitsInput.addEventListener('input', () => {
    if (unitsInput.value < 1) {
        unitsInput.setCustomValidity('يجب أن يكون عدد الوحدات 1 على الأقل');
    } else if (unitsInput.value > 100) {
        unitsInput.setCustomValidity('عدد الوحدات كبير جداً');
    } else {
        unitsInput.setCustomValidity('');
    }
});

deadlineInput.addEventListener('change', () => {
    const selectedDate = new Date(deadlineInput.value);
    const now = new Date();
    
    if (selectedDate <= now) {
        deadlineInput.setCustomValidity('يجب أن يكون الموعد النهائي في المستقبل');
        showNotification('يجب أن يكون الموعد النهائي في المستقبل', 'error');
    } else {
        deadlineInput.setCustomValidity('');
    }
});

// Form Submission
const submitBtn = form.querySelector('.btn-submit');
const successModal = document.getElementById('success-modal');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        requestType: document.querySelector('input[name="requestType"]:checked')?.value,
        units: unitsInput.value,
        bloodType: bloodTypeSelect.value,
        deadline: deadlineInput.value,
        notes: document.getElementById('notes').value
    };
    
    // Validate
    if (!formData.requestType || !formData.units || !formData.bloodType || !formData.deadline) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = '';
    
    // Simulate API call
    setTimeout(() => {
        // Reset loading state
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'إرسال الطلب';
        
        // Show success modal
        successModal.classList.add('active');
        
        // Log data (in production, send to API)
        console.log('Request Data:', formData);
    }, 2000);
});

// Cancel Button
const cancelBtn = document.getElementById('cancel-btn');
cancelBtn.addEventListener('click', () => {
    if (confirm('هل أنت متأكد من إلغاء الطلب؟ سيتم فقدان جميع البيانات المدخلة.')) {
        form.reset();
        // Remove selected class from radio options
        radioOptions.forEach(option => option.classList.remove('selected'));
        // Set first radio as selected
        if (radioOptions.length > 0) {
            radioOptions[0].classList.add('selected');
            radioOptions[0].querySelector('input[type="radio"]').checked = true;
        }
        showNotification('تم إلغاء الطلب', 'info');
    }
});

// Success Modal Actions
const viewRequestsBtn = document.getElementById('view-requests-btn');
const createAnotherBtn = document.getElementById('create-another-btn');

if (viewRequestsBtn) {
    viewRequestsBtn.addEventListener('click', () => {
        showNotification('جاري التوجيه إلى صفحة الطلبات...', 'info');
        setTimeout(() => {
            // Redirect to requests page
            // window.location.href = 'requests.html';
            console.log('Redirecting to requests page...');
        }, 1000);
    });
}

if (createAnotherBtn) {
    createAnotherBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        form.reset();
        // Remove selected class from radio options
        radioOptions.forEach(option => option.classList.remove('selected'));
        // Set first radio as selected
        if (radioOptions.length > 0) {
            radioOptions[0].classList.add('selected');
            radioOptions[0].querySelector('input[type="radio"]').checked = true;
        }
        showNotification('يمكنك إنشاء طلب جديد الآن', 'success');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        successModal.classList.remove('active');
    }
});

// Notification Button
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        showNotification('لديك إشعاران جديدان', 'info');
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
        notification.style.animation = 'slideUpToast 0.4s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
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

// Set minimum date for deadline input
const now = new Date();
now.setHours(now.getHours() + 1); // At least 1 hour from now
const minDate = now.toISOString().slice(0, 16);
deadlineInput.setAttribute('min', minDate);

// Auto-save form data to localStorage (optional)
let autoSaveTimeout;
const formInputs = form.querySelectorAll('input, select, textarea');

formInputs.forEach(input => {
    input.addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            saveFormData();
        }, 1000);
    });
});

function saveFormData() {
    const formData = {
        requestType: document.querySelector('input[name="requestType"]:checked')?.value,
        units: unitsInput.value,
        bloodType: bloodTypeSelect.value,
        deadline: deadlineInput.value,
        notes: document.getElementById('notes').value
    };
    
    // In production, consider using sessionStorage instead
    console.log('Auto-saved form data:', formData);
}

// Load saved form data on page load (optional)
window.addEventListener('load', () => {
    console.log('Create Request Page initialized successfully');
    
    // Add animation to form elements
    const formElements = document.querySelectorAll('.form-group');
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 50);
    });
});

console.log('Create Request Page initialized successfully');