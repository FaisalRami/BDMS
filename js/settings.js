// Sidebar Toggle Functionality
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const sidebar = document.getElementById('sidebar');

if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
}

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !sidebarToggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// Pages Tabs Functionality (Horizontal)
const pageTabs = document.querySelectorAll('.page-tab');
const pageForms = document.querySelectorAll('.page-forms');
const sectionsGroups = document.querySelectorAll('.sections-group');

pageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const page = tab.dataset.page;
        
        // Remove active class from all page tabs
        pageTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Hide all page forms
        pageForms.forEach(form => form.classList.remove('active'));
        
        // Show selected page forms
        const selectedPageForm = document.querySelector(`.page-forms[data-page="${page}"]`);
        if (selectedPageForm) {
            selectedPageForm.classList.add('active');
        }
        
        // Hide all sections groups
        sectionsGroups.forEach(group => group.classList.remove('active'));
        
        // Show selected sections group
        const selectedSectionsGroup = document.querySelector(`.sections-group[data-page="${page}"]`);
        if (selectedSectionsGroup) {
            selectedSectionsGroup.classList.add('active');
            
            // Activate first section tab
            const firstSectionTab = selectedSectionsGroup.querySelector('.section-tab');
            if (firstSectionTab) {
                firstSectionTab.click();
            }
        }
    });
});

// Section Tabs Functionality (Vertical)
const sectionTabs = document.querySelectorAll('.section-tab');
const sectionForms = document.querySelectorAll('.section-form');

sectionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const section = tab.dataset.section;
        const parentGroup = tab.closest('.sections-group');
        
        // Remove active class from sibling tabs
        const siblingTabs = parentGroup.querySelectorAll('.section-tab');
        siblingTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Find parent page
        const currentPage = document.querySelector('.page-forms.active');
        if (currentPage) {
            // Hide all section forms in current page
            const forms = currentPage.querySelectorAll('.section-form');
            forms.forEach(form => form.classList.remove('active'));
            
            // Show selected section form
            const selectedForm = currentPage.querySelector(`.section-form[data-section="${section}"]`);
            if (selectedForm) {
                selectedForm.classList.add('active');
            }
        }
    });
});

// Sub Tabs Functionality (For "How It Works" section)
const subTabs = document.querySelectorAll('.sub-tab');
const subtabContents = document.querySelectorAll('.subtab-content');

subTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const subtab = tab.dataset.subtab;
        const parentForm = tab.closest('.section-form');
        
        // Remove active class from sibling sub tabs
        const siblingSubTabs = parentForm.querySelectorAll('.sub-tab');
        siblingSubTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Hide all subtab contents in this form
        const contents = parentForm.querySelectorAll('.subtab-content');
        contents.forEach(content => content.classList.remove('active'));
        
        // Show selected subtab content
        const selectedContent = parentForm.querySelector(`.subtab-content[data-subtab="${subtab}"]`);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
    });
});

// Save Button Functionality
const saveButtons = document.querySelectorAll('.btn-save');

saveButtons.forEach(button => {
    button.addEventListener('click', () => {
        const originalText = button.textContent;
        button.textContent = 'جاري الحفظ...';
        button.disabled = true;
        
        // Simulate saving
        setTimeout(() => {
            button.textContent = 'تم الحفظ ✓';
            showNotification('تم حفظ التغييرات بنجاح', 'success');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        }, 1000);
    });
});

// Delete FAQ Button Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete-faq')) {
        if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
            const faqItem = e.target.closest('.faq-item');
            faqItem.style.animation = 'fadeOut 0.3s ease-out';
            
            setTimeout(() => {
                faqItem.remove();
                showNotification('تم حذف السؤال بنجاح', 'success');
                updateFAQNumbers();
            }, 300);
        }
    }
});

// Update FAQ Numbers
function updateFAQNumbers() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        const number = item.querySelector('.faq-number');
        if (number) {
            number.textContent = index + 1;
        }
    });
}

// Add FAQ Button Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-item') && e.target.closest('[data-section="contact-faq"]')) {
        const faqList = document.querySelector('.faq-list');
        const faqCount = faqList.querySelectorAll('.faq-item').length + 1;
        
        const newFAQ = document.createElement('div');
        newFAQ.className = 'faq-item';
        newFAQ.style.animation = 'slideIn 0.4s ease-out';
        newFAQ.innerHTML = `
            <div class="faq-item-header">
                <span class="faq-number">${faqCount}</span>
                <button class="btn-delete-faq">حذف</button>
            </div>
            <div class="form-group">
                <label>السؤال:</label>
                <input type="text" class="form-input" placeholder="أدخل السؤال" />
            </div>
            <div class="form-group">
                <label>الإجابة:</label>
                <textarea class="form-textarea" rows="3" placeholder="أدخل الإجابة"></textarea>
            </div>
        `;
        
        faqList.appendChild(newFAQ);
        showNotification('تم إضافة سؤال جديد', 'success');
    }
});

// Delete Task Button Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete-task')) {
        if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
            const taskItem = e.target.closest('.task-item');
            taskItem.style.animation = 'fadeOut 0.3s ease-out';
            
            setTimeout(() => {
                taskItem.remove();
                showNotification('تم حذف المهمة بنجاح', 'success');
            }, 300);
        }
    }
});

// Add Task Button Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-item') && 
        (e.target.closest('[data-section="signup-donor"]') || 
         e.target.closest('[data-section="signup-org"]'))) {
        
        const tasksList = e.target.previousElementSibling;
        
        const newTask = document.createElement('div');
        newTask.className = 'task-item';
        newTask.style.animation = 'slideIn 0.4s ease-out';
        newTask.innerHTML = `
            <input type="text" class="form-input" placeholder="أدخل المهمة الجديدة" />
            <button class="btn-delete-task">حذف</button>
        `;
        
        tasksList.appendChild(newTask);
        showNotification('تم إضافة مهمة جديدة', 'success');
    }
});

// Add animations
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
`;
document.head.appendChild(fadeOutStyle);

// File Upload Functionality
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('file-input')) {
        const file = e.target.files[0];
        if (file) {
            const label = e.target.nextElementSibling;
            const originalContent = label.innerHTML;
            
            label.innerHTML = `
                <span class="upload-icon">✓</span>
                <span>تم اختيار: ${file.name}</span>
            `;
            
            label.style.color = '#059669';
            
            showNotification('تم اختيار الملف بنجاح', 'success');
        }
    }
});

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
        showNotification('لديك إشعاران جديدان', 'success');
    });
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const activeForm = document.querySelector('.section-form.active');
        if (activeForm) {
            const saveBtn = activeForm.querySelector('.btn-save');
            if (saveBtn) {
                saveBtn.click();
            }
        }
    }
    
    // Esc to close sidebar
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

// Auto-save functionality (optional)
let autoSaveTimeout;
const formInputs = document.querySelectorAll('.form-input, .form-textarea');

formInputs.forEach(input => {
    input.addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        
        // Show saving indicator after 2 seconds of no typing
        autoSaveTimeout = setTimeout(() => {
            console.log('Auto-saving...', input.value);
            // You can implement actual auto-save here
        }, 2000);
    });
});

// Initialize page
console.log('Admin Settings Page initialized successfully');
console.log('Tabs system ready');

// Add smooth transitions
document.querySelectorAll('input, textarea, button').forEach(element => {
    element.style.transition = 'all 0.3s ease';
});

// Animate elements on load
window.addEventListener('load', () => {
    const elements = document.querySelectorAll('.form-group');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 50);
    });
});

console.log('All event listeners attached successfully');



// Delete Team Member Button Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete-member')) {
        if (confirm('هل أنت متأكد من حذف هذا العضو؟')) {
            const memberItem = e.target.closest('.team-member-item');
            memberItem.style.animation = 'fadeOut 0.3s ease-out';
            
            setTimeout(() => {
                memberItem.remove();
                showNotification('تم حذف العضو بنجاح', 'success');
                updateTeamMemberNumbers();
            }, 300);
        }
    }
});

// Update Team Member Numbers
function updateTeamMemberNumbers() {
    const memberItems = document.querySelectorAll('.team-member-item');
    memberItems.forEach((item, index) => {
        const number = item.querySelector('.team-member-number');
        if (number) {
            number.textContent = index + 1;
        }
    });
}

// Add Team Member Button Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-member')) {
        const membersList = document.querySelector('.team-members-list');
        const memberCount = membersList.querySelectorAll('.team-member-item').length + 1;
        
        const newMember = document.createElement('div');
        newMember.className = 'team-member-item';
        newMember.style.animation = 'slideIn 0.4s ease-out';
        newMember.innerHTML = `
            <div class="team-member-header">
                <span class="team-member-number">${memberCount}</span>
                <button class="btn-delete-member">حذف</button>
            </div>
            <div class="form-group">
                <label>الصورة:</label>
                <div class="file-upload-area">
                    <input type="file" id="about-team-image4" class="file-input" accept="image/*" />
                    <label for="about-team-image4" class="file-upload-label">
                        <span class="upload-icon">📁</span>
                        <span>اختر صورة</span>
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label>الاسم:</label>
                <input type="text" class="form-input" placeholder="أدخل اسم العضو" />
            </div>
            <div class="form-group">
                <label>الوظيفة:</label>
                <input type="text" class="form-input" placeholder="أدخل الوظيفة" />
            </div>
            <div class="form-group">
                <label>المهمة:</label>
                <textarea class="form-textarea" rows="3" placeholder="أدخل مهمة العضو"></textarea>
            </div>
        `;
        
        membersList.appendChild(newMember);
        showNotification('تم إضافة عضو جديد', 'success');
        
        // Scroll to the new member
        newMember.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});