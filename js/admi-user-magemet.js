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

// Tabs Functionality
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        showNotification(`تم التبديل إلى ${tab === 'donors' ? 'المتبرعين' : 'المنظمات'}`, 'info');
    });
});

// Filter Button
const filterBtn = document.getElementById('filter-btn');
if (filterBtn) {
    filterBtn.addEventListener('click', () => {
        showNotification('سيتم فتح نافذة التصفية قريباً', 'info');
    });
}

// Download Data Button
const downloadDataBtn = document.getElementById('download-data-btn');
if (downloadDataBtn) {
    downloadDataBtn.addEventListener('click', () => {
        downloadDataBtn.innerHTML = '<span>⏳</span><span>جاري التحميل...</span>';
        downloadDataBtn.disabled = true;

        setTimeout(() => {
            showNotification('تم تحميل البيانات بنجاح', 'success');
            downloadDataBtn.innerHTML = '<span class="download-icon">⬇</span><span>تحميل البيانات</span>';
            downloadDataBtn.disabled = false;
        }, 2000);
    });
}

// Actions Dropdown Toggle
const toggleButtons = document.querySelectorAll('.btn-action-toggle');
let currentOpenDropdown = null;

toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rowIndex = btn.dataset.row;
        const dropdown = document.getElementById(`dropdown-${rowIndex}`);
        
        // Close currently open dropdown if different
        if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
            currentOpenDropdown.classList.remove('active');
            const prevBtn = document.querySelector(`[data-row="${currentOpenDropdown.id.split('-')[1]}"]`);
            if (prevBtn) prevBtn.classList.remove('active');
        }
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
        btn.classList.toggle('active');
        
        if (dropdown.classList.contains('active')) {
            currentOpenDropdown = dropdown;
        } else {
            currentOpenDropdown = null;
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    if (currentOpenDropdown) {
        currentOpenDropdown.classList.remove('active');
        const btn = document.querySelector(`[data-row="${currentOpenDropdown.id.split('-')[1]}"]`);
        if (btn) btn.classList.remove('active');
        currentOpenDropdown = null;
    }
});

// Prevent dropdown from closing when clicking inside
document.querySelectorAll('.actions-dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// User Details Modal
const userModal = document.getElementById('user-modal');
const closeUserModal = document.getElementById('close-user-modal');
const closeUserBtn = document.getElementById('close-user-btn');
const userModalBody = document.getElementById('user-modal-body');

// View User Details (Desktop buttons)
const viewButtons = document.querySelectorAll('.btn-view');
viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const userName = btn.dataset.user;
        showUserDetails(userName);
    });
});

// View User Details (Mobile dropdown buttons)
const viewMobileButtons = document.querySelectorAll('.btn-view-mobile');
viewMobileButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const userName = btn.dataset.user;
        showUserDetails(userName);
        // Close dropdown
        if (currentOpenDropdown) {
            currentOpenDropdown.classList.remove('active');
            const toggleBtn = document.querySelector(`[data-row="${currentOpenDropdown.id.split('-')[1]}"]`);
            if (toggleBtn) toggleBtn.classList.remove('active');
            currentOpenDropdown = null;
        }
    });
});

function showUserDetails(userName) {
    // Sample user data
    const userData = {
        'صوفيا كارتر': {
            id: '#12345',
            email: 'sophia.carter@email.com',
            blood: 'O+',
            phone: '+970-59-123-4567',
            address: 'رام الله، فلسطين',
            lastDonation: '2023-11-15',
            totalDonations: '5',
            registrationDate: '2022-01-10'
        },
        'إيثان بينيت': {
            id: '#67890',
            email: 'ethan.bennett@email.com',
            blood: 'A-',
            phone: '+970-59-234-5678',
            address: 'نابلس، فلسطين',
            lastDonation: '2023-10-20',
            totalDonations: '3',
            registrationDate: '2022-03-15'
        },
        'أوليفيا هايز': {
            id: '#11223',
            email: 'olivia.hayes@email.com',
            blood: 'B+',
            phone: '+970-59-345-6789',
            address: 'الخليل، فلسطين',
            lastDonation: '2023-09-05',
            totalDonations: '7',
            registrationDate: '2021-11-20'
        },
        'ليام فوستر': {
            id: '#44556',
            email: 'liam.foster@email.com',
            blood: 'AB-',
            phone: '+970-59-456-7890',
            address: 'بيت لحم، فلسطين',
            lastDonation: '2023-08-12',
            totalDonations: '4',
            registrationDate: '2022-06-05'
        },
        'آفا مورجان': {
            id: '#77889',
            email: 'ava.morgan@email.com',
            blood: 'O-',
            phone: '+970-59-567-8901',
            address: 'القدس، فلسطين',
            lastDonation: '2023-07-28',
            totalDonations: '6',
            registrationDate: '2021-09-18'
        }
    };

    const data = userData[userName] || {
        id: 'غير معروف',
        email: 'غير معروف',
        blood: 'غير معروف',
        phone: 'غير معروف',
        address: 'غير معروف',
        lastDonation: 'غير معروف',
        totalDonations: '0',
        registrationDate: 'غير معروف'
    };

    const modalContent = `
        <div class="user-detail-grid">
            <div class="user-detail-item full-width">
                <span class="user-detail-label">الاسم الكامل</span>
                <span class="user-detail-value">${userName}</span>
            </div>
            <div class="user-detail-item">
                <span class="user-detail-label">معرف المستخدم</span>
                <span class="user-detail-value">${data.id}</span>
            </div>
            <div class="user-detail-item">
                <span class="user-detail-label">فصيلة الدم</span>
                <span class="user-detail-value">${data.blood}</span>
            </div>
            <div class="user-detail-item">
                <span class="user-detail-label">البريد الإلكتروني</span>
                <span class="user-detail-value">${data.email}</span>
            </div>
            <div class="user-detail-item">
                <span class="user-detail-label">رقم الهاتف</span>
                <span class="user-detail-value">${data.phone}</span>
            </div>
            <div class="user-detail-item full-width">
                <span class="user-detail-label">العنوان</span>
                <span class="user-detail-value">${data.address}</span>
            </div>
            <div class="user-detail-item">
                <span class="user-detail-label">آخر تبرع</span>
                <span class="user-detail-value">${data.lastDonation}</span>
            </div>
            <div class="user-detail-item">
                <span class="user-detail-label">إجمالي التبرعات</span>
                <span class="user-detail-value">${data.totalDonations}</span>
            </div>
            <div class="user-detail-item full-width">
                <span class="user-detail-label">تاريخ التسجيل</span>
                <span class="user-detail-value">${data.registrationDate}</span>
            </div>
        </div>
    `;

    userModalBody.innerHTML = modalContent;
    userModal.classList.add('active');
}

if (closeUserModal) {
    closeUserModal.addEventListener('click', () => {
        userModal.classList.remove('active');
    });
}

if (closeUserBtn) {
    closeUserBtn.addEventListener('click', () => {
        userModal.classList.remove('active');
    });
}

if (userModal) {
    userModal.addEventListener('click', (e) => {
        if (e.target === userModal) {
            userModal.classList.remove('active');
        }
    });
}

// Delete User Modal
const deleteModal = document.getElementById('delete-modal');
const closeDeleteModal = document.getElementById('close-delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const userToDeleteEl = document.getElementById('user-to-delete');

let userToDelete = null;

// Delete User (Desktop buttons)
const deleteButtons = document.querySelectorAll('.btn-delete');
deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        userToDelete = btn.dataset.user;
        userToDeleteEl.textContent = userToDelete;
        deleteModal.classList.add('active');
    });
});

// Delete User (Mobile dropdown buttons)
const deleteMobileButtons = document.querySelectorAll('.btn-delete-mobile');
deleteMobileButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        userToDelete = btn.dataset.user;
        userToDeleteEl.textContent = userToDelete;
        deleteModal.classList.add('active');
        // Close dropdown
        if (currentOpenDropdown) {
            currentOpenDropdown.classList.remove('active');
            const toggleBtn = document.querySelector(`[data-row="${currentOpenDropdown.id.split('-')[1]}"]`);
            if (toggleBtn) toggleBtn.classList.remove('active');
            currentOpenDropdown = null;
        }
    });
});

if (closeDeleteModal) {
    closeDeleteModal.addEventListener('click', () => {
        deleteModal.classList.remove('active');
        userToDelete = null;
    });
}

if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('active');
        userToDelete = null;
    });
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
        confirmDeleteBtn.innerHTML = '<span>⏳</span><span>جاري الحذف...</span>';
        confirmDeleteBtn.disabled = true;
        cancelDeleteBtn.disabled = true;

        setTimeout(() => {
            deleteModal.classList.remove('active');
            showNotification(`تم حذف المستخدم ${userToDelete} بنجاح`, 'success');

            // Find and remove the row
            const rows = document.querySelectorAll('.table-row');
            rows.forEach(row => {
                const viewBtn = row.querySelector('.btn-view, .btn-view-mobile');
                if (viewBtn && viewBtn.dataset.user === userToDelete) {
                    row.style.animation = 'fadeOutRow 0.5s ease-out forwards';
                    setTimeout(() => {
                        row.remove();
                    }, 500);
                }
            });

            // Reset buttons
            confirmDeleteBtn.innerHTML = '<span>🗑</span><span>تأكيد الحذف</span>';
            confirmDeleteBtn.disabled = false;
            cancelDeleteBtn.disabled = false;
            userToDelete = null;
        }, 1500);
    });
}

if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.classList.remove('active');
            userToDelete = null;
        }
    });
}

// Add fade out animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOutRow {
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

// Notification Function
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;

    const icon = type === 'success' ? '✅' : 
                 type === 'info' ? 'ℹ️' : 
                 type === 'error' ? '❌' : '⚠️';
    
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
        if (userModal && userModal.classList.contains('active')) {
            userModal.classList.remove('active');
        }
        if (deleteModal && deleteModal.classList.contains('active')) {
            deleteModal.classList.remove('active');
            userToDelete = null;
        }
        // Close dropdown
        if (currentOpenDropdown) {
            currentOpenDropdown.classList.remove('active');
            const btn = document.querySelector(`[data-row="${currentOpenDropdown.id.split('-')[1]}"]`);
            if (btn) btn.classList.remove('active');
            currentOpenDropdown = null;
        }
    }
});

// Animate rows on load
function animateRows() {
    const rows = document.querySelectorAll('.table-row');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';

        setTimeout(() => {
            row.style.transition = 'all 0.5s ease-out';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

window.addEventListener('load', () => {
    animateRows();
});

console.log('User Management Page initialized');
console.log('Total users:', document.querySelectorAll('.table-row').length);









const rowsPerPage = 4;
const table = document.getElementById('users-table');
const rows = table.querySelectorAll('tbody tr');
const pagination = document.getElementById('pagination');
const totalPages = Math.ceil(rows.length / rowsPerPage);

let currentPage = 1;

function showPage(page) {
  rows.forEach((row, index) => {
    row.style.display =
      index >= (page - 1) * rowsPerPage && index < page * rowsPerPage
        ? ''
        : 'none';
  });

  const buttons = pagination.querySelectorAll('.page-btn');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i + 1 === page);
  });

  // تعطيل السابق / التالي عند الأطراف
  document.getElementById('prevBtn').disabled = page === 1;
  document.getElementById('nextBtn').disabled = page === totalPages;
}

function setupPagination() {
  // زر السابق
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '‹ السابق';
  prevBtn.id = 'prevBtn';
  prevBtn.classList.add('nav-btn');
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage);
    }
  });
  pagination.appendChild(prevBtn);

  // الأزرار الرقمية
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.classList.add('page-btn');
    button.addEventListener('click', () => {
      currentPage = i;
      showPage(currentPage);
    });
    pagination.appendChild(button);
  }

  // زر التالي
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'التالي ›';
  nextBtn.id = 'nextBtn';
  nextBtn.classList.add('nav-btn');
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      showPage(currentPage);
    }
  });
  pagination.appendChild(nextBtn);

  showPage(1);
}

setupPagination();
