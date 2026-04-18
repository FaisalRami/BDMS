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

// Create Sub-Admin Form
const createForm = document.getElementById('create-subadmin-form');

createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const roles = Array.from(document.querySelectorAll('input[name="roles"]:checked'))
        .map(checkbox => checkbox.value);
    
    if (roles.length === 0) {
        showNotification('يرجى اختيار دور واحد على الأقل', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = createForm.querySelector('.btn-create-subadmin');
    submitBtn.classList.add('loading');
    submitBtn.textContent = '';
    
    // Simulate API call
    setTimeout(() => {
        // Add new sub-admin to table
        addSubAdminToTable({
            id: Date.now(),
            name: name,
            email: email,
            roles: roles
        });
        
        // Reset form
        createForm.reset();
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'إنشاء مسؤول فرعي';
        
        showNotification('تم إنشاء المسؤول الفرعي بنجاح!', 'success');
    }, 1500);
});

// Add Sub-Admin to Table
function addSubAdminToTable(subAdmin) {
    const tbody = document.getElementById('subadmin-tbody');
    const row = document.createElement('tr');
    row.className = 'table-row';
    
    const rolesMap = {
        'manage-donors': 'المتبرعين',
        'manage-requests': 'الطلبات',
        'view-reports': 'التقارير'
    };
    
    const roleBadges = subAdmin.roles.map(role => 
        `<span class="role-badge">${rolesMap[role]}</span>`
    ).join('');
    
    row.innerHTML = `
        <td class="name-cell">${subAdmin.name}</td>
        <td class="email-cell">${subAdmin.email}</td>
        <td class="roles-cell">${roleBadges}</td>
        <td class="actions-cell">
            <button class="btn-action edit" data-id="${subAdmin.id}" data-name="${subAdmin.name}" data-email="${subAdmin.email}">تعديل</button>
            <span class="separator">|</span>
            <button class="btn-action delete" data-id="${subAdmin.id}" data-name="${subAdmin.name}">حذف</button>
        </td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
    
    // Add event listeners
    row.querySelector('.btn-action.edit').addEventListener('click', handleEdit);
    row.querySelector('.btn-action.delete').addEventListener('click', handleDelete);
    
    // Animate new row
    row.style.opacity = '0';
    row.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        row.style.transition = 'all 0.5s ease-out';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
    }, 10);
}

// Edit Modal
const editModal = document.getElementById('edit-modal');
const closeEditModalBtn = document.getElementById('close-edit-modal');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const saveEditBtn = document.getElementById('save-edit-btn');

let currentEditId = null;

function handleEdit(e) {
    const button = e.target;
    currentEditId = button.dataset.id;
    const name = button.dataset.name;
    const email = button.dataset.email;
    
    document.getElementById('edit-id').value = currentEditId;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    
    editModal.classList.add('active');
}

closeEditModalBtn.addEventListener('click', () => {
    editModal.classList.remove('active');
});

cancelEditBtn.addEventListener('click', () => {
    editModal.classList.remove('active');
});

saveEditBtn.addEventListener('click', () => {
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    
    if (!name || !email) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    // Show loading
    saveEditBtn.classList.add('loading');
    saveEditBtn.textContent = '';
    
    // Simulate API call
    setTimeout(() => {
        // Update table row
        const rows = document.querySelectorAll('.table-row');
        rows.forEach(row => {
            const editBtn = row.querySelector('.btn-action.edit');
            if (editBtn && editBtn.dataset.id === currentEditId) {
                row.querySelector('.name-cell').textContent = name;
                row.querySelector('.email-cell').textContent = email;
                editBtn.dataset.name = name;
                editBtn.dataset.email = email;
            }
        });
        
        editModal.classList.remove('active');
        saveEditBtn.classList.remove('loading');
        saveEditBtn.textContent = 'حفظ التغييرات';
        
        showNotification('تم تحديث المسؤول الفرعي بنجاح!', 'success');
    }, 1500);
});

// Close modal when clicking outside
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.classList.remove('active');
    }
});

// Delete Modal
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

let currentDeleteId = null;
let currentDeleteRow = null;

function handleDelete(e) {
    const button = e.target;
    currentDeleteId = button.dataset.id;
    currentDeleteRow = button.closest('.table-row');
    const name = button.dataset.name;
    
    document.getElementById('delete-name').textContent = name;
    deleteModal.classList.add('active');
}

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('active');
});

confirmDeleteBtn.addEventListener('click', () => {
    // Show loading
    confirmDeleteBtn.classList.add('loading');
    confirmDeleteBtn.textContent = '';
    
    // Simulate API call
    setTimeout(() => {
        // Remove row with animation
        currentDeleteRow.style.animation = 'fadeOutRow 0.5s ease-out forwards';
        
        setTimeout(() => {
            currentDeleteRow.remove();
        }, 500);
        
        deleteModal.classList.remove('active');
        confirmDeleteBtn.classList.remove('loading');
        confirmDeleteBtn.textContent = 'حذف';
        
        showNotification('تم حذف المسؤول الفرعي بنجاح!', 'success');
    }, 1500);
});

// Close modal when clicking outside
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
    }
});

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

// Add event listeners to existing buttons
document.querySelectorAll('.btn-action.edit').forEach(button => {
    button.addEventListener('click', handleEdit);
});

document.querySelectorAll('.btn-action.delete').forEach(button => {
    button.addEventListener('click', handleDelete);
});

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

// Notification Button
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        showNotification('لديك إشعاران جديدان', 'info');
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (editModal.classList.contains('active')) {
            editModal.classList.remove('active');
        }
        if (deleteModal.classList.contains('active')) {
            deleteModal.classList.remove('active');
        }
    }
});

console.log('Sub-Admin Page initialized successfully');







const rowsPerPage = 4;
const table = document.getElementById('subadmin-table');
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
