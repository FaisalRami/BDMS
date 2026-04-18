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

// Search Functionality
const searchInput = document.getElementById('searchInput');
const dateFilter = document.getElementById('dateFilter');
const typeFilter = document.getElementById('typeFilter');

function filterTable() {
    const searchValue = searchInput.value.toLowerCase();
    const dateValue = dateFilter.value;
    const typeValue = typeFilter.value;
    
    const rows = document.querySelectorAll('.table-row');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const orgName = row.querySelector('.org-name-cell').textContent.toLowerCase();
        const orgType = row.querySelector('.org-type-cell').textContent;
        const date = row.querySelector('.date-cell').textContent;
        
        let showRow = true;
        
        // Search filter
        if (searchValue && !orgName.includes(searchValue)) {
            showRow = false;
        }
        
        // Type filter
        if (typeValue) {
            const typeMap = {
                'blood-bank': 'بنك دم',
                'hospital': 'مستشفى',
                'non-profit': 'غير ربحية',
                'university': 'جامعة'
            };
            if (orgType !== typeMap[typeValue]) {
                showRow = false;
            }
        }
        
        // Date filter
        if (dateValue) {
            const rowDate = new Date(date);
            const now = new Date();
            
            switch(dateValue) {
                case 'today':
                    if (rowDate.toDateString() !== now.toDateString()) {
                        showRow = false;
                    }
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (rowDate < weekAgo) {
                        showRow = false;
                    }
                    break;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    if (rowDate < monthAgo) {
                        showRow = false;
                    }
                    break;
                case 'year':
                    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    if (rowDate < yearAgo) {
                        showRow = false;
                    }
                    break;
            }
        }
        
        if (showRow) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updatePaginationInfo(visibleCount);
}

if (searchInput) {
    searchInput.addEventListener('input', filterTable);
}

if (dateFilter) {
    dateFilter.addEventListener('change', filterTable);
}

if (typeFilter) {
    typeFilter.addEventListener('change', filterTable);
}

// Table Sorting Functionality
const sortIcons = document.querySelectorAll('.sort-icon');

sortIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const th = this.closest('th');
        const table = th.closest('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('.table-row'));
        const columnIndex = Array.from(th.parentElement.children).indexOf(th);
        
        // Determine sort direction
        const isAscending = this.dataset.sortDirection !== 'asc';
        this.dataset.sortDirection = isAscending ? 'asc' : 'desc';
        
        // Update icon
        this.textContent = isAscending ? '↑' : '↓';
        
        // Reset other sort icons
        sortIcons.forEach(otherIcon => {
            if (otherIcon !== this) {
                otherIcon.textContent = '⇅';
                delete otherIcon.dataset.sortDirection;
            }
        });
        
        // Sort rows
        rows.sort((a, b) => {
            const aValue = a.children[columnIndex].textContent.trim();
            const bValue = b.children[columnIndex].textContent.trim();
            
            // Handle dates
            if (columnIndex === 2) { // Date column
                const aDate = new Date(aValue);
                const bDate = new Date(bValue);
                return isAscending ? aDate - bDate : bDate - aDate;
            }
            
            // Handle text
            return isAscending 
                ? aValue.localeCompare(bValue, 'ar')
                : bValue.localeCompare(aValue, 'ar');
        });
        
        // Reattach sorted rows
        rows.forEach(row => tbody.appendChild(row));
        
        showNotification(`تم ترتيب البيانات ${isAscending ? 'تصاعدياً' : 'تنازلياً'}`, 'info');
    });
});

// Modal Functionality
const reviewModal = document.getElementById('review-modal');
const closeModal = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');
const approveBtn = document.getElementById('approve-btn');
const rejectBtn = document.getElementById('reject-btn');

let currentOrganization = '';

// Review buttons
function attachReviewListeners() {
    const reviewButtons = document.querySelectorAll('.btn-review');
    
    reviewButtons.forEach(button => {
        button.removeEventListener('click', handleReviewClick);
        button.addEventListener('click', handleReviewClick);
    });
}

function handleReviewClick(e) {
    const button = e.currentTarget;
    const orgName = button.dataset.org;
    // تم جلب هذه البيانات من خاصيات data-* للزر الذي تم النقر عليه
    const orgTypeFromBtn = button.dataset.type;
    const date = button.dataset.date;
    const license = button.dataset.license;
    
    currentOrganization = orgName;
    
    // Organization extended data
    const orgData = {
        'مركز الدم بالمدينة': {
            type: "بنك دم مركزي",
            address: 'شارع الجامعة، نابلس',
            license: "LIC-2023-004",
            manager: 'أحمد محمود',
            phone: '+970-59-123-4567',
            emailOrg: 'info@citybdc.org',
            emailMang: 'ahmad.m@citybdc.org',
            orgDescription: 'أكبر مركز تبرع بالدم يخدم محافظة نابلس.',
            licenseFile: '/docs/licenses/citybdc_lic.pdf' // مثال لمسار ملف
        },
        'خدمات الدم بالمستشفى الإقليمي': {
            type: "وحدة مستشفى",
            address: 'شارع فيصل، رام الله',
            license: "LIC-2022-012",
            manager: 'فاطمة خليل',
            phone: '+970-59-234-5678',
            emailOrg: 'contact@regionalhosp.com',
            emailMang: 'fatma.k@regionalhosp.com',
            orgDescription: 'وحدة الدم التابعة للمستشفى الإقليمي لدعم العمليات الجراحية.',
            licenseFile: '/docs/licenses/regionalhosp_lic.pdf'
        },
        'مركز التبرع بالدم المجتمعي': {
            type: "مبادرة مجتمعية",
            address: 'شارع المستشفى، الخليل',
            license: "LIC-2024-001",
            manager: 'محمد العلي',
            phone: '+970-59-345-6789',
            emailOrg: 'info@communitybdc.org',
            emailMang: 'mohamed.a@communitybdc.org',
            orgDescription: 'منظمة غير ربحية تركز على حملات التوعية والتبرع.',
            licenseFile: '/docs/licenses/communitybdc_lic.pdf'
        },
        'مركز الدم بنظام صحة الجامعة': {
            type: "بنك دم جامعي",
            address: 'الحرم الجامعي، بيرزيت',
            license: "LIC-2021-008",
            manager: 'سارة حسن',
            phone: '+970-59-456-7890',
            emailOrg: 'bloodcenter@university.edu',
            emailMang: 'sara.h@university.edu',
            orgDescription: 'مركز متكامل لدعم البحث العلمي وخدمة المجتمع الجامعي.',
            licenseFile: '/docs/licenses/university_lic.pdf'
        },
        'خدمات الدم بالمترو': {
            type: "بنك دم خاص",
            address: 'شارع الملك، القدس',
            license: "LIC-2020-025",
            manager: 'يوسف قاسم',
            phone: '+970-59-567-8901',
            emailOrg: 'info@metrobloods.com',
            emailMang: 'yousef.q@metrobloods.com',
            orgDescription: 'خدمات دم متخصصة وعالية الجودة في منطقة المترو.',
            licenseFile: '/docs/licenses/metrobloods_lic.pdf'
        }
    };

    const data = orgData[orgName] || {
        type: 'غير محدد',
        address: 'غير محدد',
        license: license || 'غير محدد', // استخدام الترخيص من الزر إذا لم يكن في القائمة
        manager: 'غير محدد',
        phone: 'غير محدد',
        emailOrg: 'غير محدد',
        emailMang: 'غير محدد',
        orgDescription: 'لا يوجد وصف.',
        licenseFile: '#' // رابط وهمي
    };

    // Create modal content
    const modalContent = `
        <div class="review-section">
            <div class="review-card">
                <h4>معلومات المنظمة</h4>
                <div class="review-grid">
                    <div><span>اسم المنظمة:</span> ${orgName}</div>
                    <div><span>نوع المنظمة:</span> ${data.type}</div>
                    <div class="full-width-item"><span>وصف المنظمة:</span> ${data.orgDescription}</div>
                </div>
            </div>

             <div class="review-card">
                <h4>معلومات الاتصال والمسؤول</h4>
                <div class="review-grid"> 
                    <div><span>بريد المنظمة:</span> ${data.emailOrg}</div>
                    <div><span>العنوان:</span> ${data.address}</div>
                    <div><span>رقم الجوال:</span> ${data.phone}</div>                   
                </div>
            </div>

            <div class="review-card">
                <h4> التفاصيل الادارية</h4>
                <div class="review-grid">
                    <div><span>رقم الترخيص:</span> ${data.license}</div>
                    <div>
                        <span>الرخصة المحملة:</span> 
                        ${data.licenseFile && data.licenseFile !== '#' 
                            ? `<a href="${data.licenseFile}" target="_blank" class="file-link">عرض الملف المُحمّل</a>`
                            : 'لا يوجد ملف'}
                    </div>
                    <div><span>اسم المسؤول:</span> ${data.manager}</div>
                    <div><span>بريد الالكتروني للمسؤول:</span> ${data.emailMang}</div>
                    <div><span>تاريخ التسجيل:</span> ${date}</div>
                </div>
            </div>
        </div>
    `;

    modalBody.innerHTML = modalContent;
    reviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Initialize review listeners
attachReviewListeners();

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', closeModalHandler);
}

function closeModalHandler() {
    reviewModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
if (reviewModal) {
    reviewModal.addEventListener('click', (e) => {
        if (e.target === reviewModal) {
            closeModalHandler();
        }
    });
}

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reviewModal.classList.contains('active')) {
        closeModalHandler();
    }
});

// Approve button
if (approveBtn) {
    approveBtn.addEventListener('click', () => {
        const originalHTML = approveBtn.innerHTML;
        approveBtn.innerHTML = '<span>⏳</span><span>جاري المعالجة...</span>';
        approveBtn.disabled = true;
        rejectBtn.disabled = true;

        setTimeout(() => {
            reviewModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Remove row from table
            const rows = document.querySelectorAll('.table-row');
            rows.forEach(row => {
                const btn = row.querySelector('.btn-review');
                if (btn && btn.dataset.org === currentOrganization) {
                    row.style.animation = 'fadeOutRow 0.5s ease-out forwards';
                    setTimeout(() => {
                        row.remove();
                        updateTableCount();
                        attachReviewListeners();
                    }, 500);
                }
            });

            showNotification(`تمت الموافقة على ${currentOrganization} بنجاح`, 'success');
            
            approveBtn.innerHTML = originalHTML;
            approveBtn.disabled = false;
            rejectBtn.disabled = false;
        }, 1500);
    });
}

// Reject button
if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
        const originalHTML = rejectBtn.innerHTML;
        rejectBtn.innerHTML = '<span>⏳</span><span>جاري المعالجة...</span>';
        rejectBtn.disabled = true;
        approveBtn.disabled = true;

        setTimeout(() => {
            reviewModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Remove row from table
            const rows = document.querySelectorAll('.table-row');
            rows.forEach(row => {
                const btn = row.querySelector('.btn-review');
                if (btn && btn.dataset.org === currentOrganization) {
                    row.style.animation = 'fadeOutRow 0.5s ease-out forwards';
                    setTimeout(() => {
                        row.remove();
                        updateTableCount();
                        attachReviewListeners();
                    }, 500);
                }
            });

            showNotification(`تم رفض ${currentOrganization}`, 'error');
            
            rejectBtn.innerHTML = originalHTML;
            rejectBtn.disabled = false;
            approveBtn.disabled = false;
        }, 1500);
    });
}

// Add animations
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOutRow {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
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
document.head.appendChild(fadeOutStyle);

// Update table count
function updateTableCount() {
    const visibleRows = document.querySelectorAll('.table-row:not([style*="display: none"])');
    updatePaginationInfo(visibleRows.length);
    
    // Check if table is empty
    if (visibleRows.length === 0) {
        const tbody = document.getElementById('verification-tbody');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem; color: #6b7280; font-size: 1.1rem; font-weight: 600;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                        <span style="font-size: 3rem;">📋</span>
                        <span>لا توجد منظمات في قائمة الانتظار</span>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Update pagination info
function updatePaginationInfo(count) {
    const paginationRange = document.querySelector('.pagination-range');
    const paginationTotal = document.querySelector('.pagination-total');
    
    if (paginationRange && paginationTotal) {
        const end = Math.min(5, count);
        paginationRange.textContent = count > 0 ? `1-${end}` : '0';
        paginationTotal.textContent = count;
    }
}

// Pagination functionality
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageNumbers = document.querySelectorAll('.page-number');

if (pageNumbers.length > 0) {
    pageNumbers.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            pageNumbers.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update prev/next button states
            if (prevBtn) prevBtn.disabled = (index === 0);
            if (nextBtn) nextBtn.disabled = (index === pageNumbers.length - 1);
            
            showNotification(`الانتقال إلى الصفحة ${btn.textContent}`, 'info');
        });
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        const active = document.querySelector('.page-number.active');
        const prev = active.previousElementSibling;
        if (prev && prev.classList.contains('page-number')) {
            prev.click();
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const active = document.querySelector('.page-number.active');
        let next = active.nextElementSibling;
        while (next && !next.classList.contains('page-number')) {
            next = next.nextElementSibling;
        }
        if (next) {
            next.click();
        }
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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    }
});

// Auto-refresh notification count animation
setInterval(() => {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.animation = 'none';
        setTimeout(() => {
            badge.style.animation = 'pulse-badge 2s ease-in-out infinite';
        }, 10);
    }
}, 30000);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateTableCount();
    
    // Show welcome message
    setTimeout(() => {
        showNotification('مرحباً بك في لوحة التحقق من المنظمات', 'info');
    }, 500);
});

// Export filter stats
function exportFilteredData() {
    const visibleRows = document.querySelectorAll('.table-row:not([style*="display: none"])');
    const data = [];
    
    visibleRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        data.push({
            organization: cells[0].textContent,
            type: cells[1].textContent,
            date: cells[2].textContent,
            license: cells[3].textContent,
            status: cells[4].textContent.trim()
        });
    });
    
    console.log('Filtered Data:', data);
    showNotification(`تم تصدير ${data.length} سجل`, 'success');
    return data;
}

// Add export button functionality (if needed)
const exportBtn = document.getElementById('export-btn');
if (exportBtn) {
    exportBtn.addEventListener('click', exportFilteredData);
}

// Performance: Debounce search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to search
if (searchInput) {
    searchInput.removeEventListener('input', filterTable);
    searchInput.addEventListener('input', debounce(filterTable, 300));
}

// Log activity
function logActivity(action, details) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${action}:`, details);
}

// Track user actions
approveBtn?.addEventListener('click', () => {
    logActivity('APPROVE', currentOrganization);
});

rejectBtn?.addEventListener('click', () => {
    logActivity('REJECT', currentOrganization);
});

console.log('✅ BloodBridge Admin Verification Queue - Initialized Successfully');