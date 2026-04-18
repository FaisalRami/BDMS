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

// Search and Filter Functionality
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const bloodTypeFilter = document.getElementById('bloodTypeFilter');
const dateFilter = document.getElementById('dateFilter');

function filterTable() {
    const searchValue = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value.toLowerCase();
    const bloodValue = bloodTypeFilter.value;
    const dateValue = dateFilter.value;
    
    const rows = document.querySelectorAll('#history-tbody .table-row');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const requestId = row.querySelector('.request-id-cell')?.textContent.toLowerCase() || '';
        const bloodType = row.querySelector('.blood-badge')?.textContent || '';
        const status = row.dataset.status || '';
        const deadline = row.querySelector('.deadline-cell')?.textContent || '';
        
        let showRow = true;
        
        // Search filter
        if (searchValue && !requestId.includes(searchValue)) {
            showRow = false;
        }
        
        // Status filter
        if (statusValue && status !== statusValue) {
            showRow = false;
        }
        
        // Blood type filter
        if (bloodValue && bloodType !== bloodValue) {
            showRow = false;
        }
        
        // Date filter
        if (dateValue && deadline !== dateValue) {
            showRow = false;
        }
        
        if (showRow) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
}

if (searchInput) {
    searchInput.addEventListener('input', filterTable);
}

if (statusFilter) {
    statusFilter.addEventListener('change', filterTable);
}

if (bloodTypeFilter) {
    bloodTypeFilter.addEventListener('change', filterTable);
}

if (dateFilter) {
    dateFilter.addEventListener('change', filterTable);
}

// Modal Functionality
const detailsModal = document.getElementById('details-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal');
const closeModalFooterBtn = document.getElementById('close-modal-btn');

// بيانات تفصيلية للطلبات (يمكن استبدالها ببيانات من API)
const requestDetails = {
    'REQ-2023-001': {
        description: 'طلب عاجل لتوفير 5 وحدات من فصيلة A+ لإجراء عملية جراحية طارئة',
        urgency: 'عاجل جداً',
    },
    'REQ-2023-002': {
        description: 'طلب لتوفير 3 وحدات من فصيلة B- لحالة طوارئ',
        urgency: 'عاجل',
    },
    'REQ-2023-003': {
        description: 'طلب لتوفير 10 وحدات من فصيلة O+ لعملية قلب مفتوح',
        urgency: 'عاجل',
    },
    'REQ-2023-004': {
        description: 'طلب لتوفير 2 وحدات من فصيلة AB+ لمريض يخضع للعلاج الكيماوي',
        urgency: 'متوسط',
    },
    'REQ-2023-005': {
        description: 'طلب لتوفير 4 وحدات من فصيلة A- لضحايا حادث مرور',
        urgency: 'عاجل جداً',
    },
    'REQ-2023-006': {
        description: 'طلب لتوفير 6 وحدات من فصيلة B+ لحالة ولادة قيصرية طارئة',
        urgency: 'عاجل',
    },
    'REQ-2023-007': {
        description: 'طلب لتوفير 8 وحدات من فصيلة O- النادرة لحالة طوارئ',
        urgency: 'عاجل جداً',
    }
};

// View Details buttons
const viewDetailsButtons = document.querySelectorAll('.btn-view-details');

viewDetailsButtons.forEach(button => {
    button.addEventListener('click', () => {
        const requestId = button.dataset.request;
        const row = button.closest('.table-row');
        
        const bloodType = row.querySelector('.blood-badge')?.textContent || 'غير محدد';
        const units = row.querySelector('.units-cell')?.textContent || '0';
        const donations = row.querySelector('.donations-cell')?.textContent || '0';
        const deadline = row.querySelector('.deadline-cell')?.textContent || 'غير محدد';
        const status = row.querySelector('.status-badge')?.textContent || 'غير محدد';
        const completion = row.querySelector('.completion-cell')?.textContent || 'N/A';
        
        const details = requestDetails[requestId] || {
            description: 'لا توجد تفاصيل إضافية لهذا الطلب',
            urgency: 'غير محدد',
        };

        // Create modal content
        const modalContent = `
            <div class="modal-detail-grid">
                <div class="modal-detail-item full-width">
                    <span class="modal-detail-label">رقم الطلب</span>
                    <span class="modal-detail-value">${requestId}</span>
                </div>
                <div class="modal-detail-item full-width">
                    <span class="modal-detail-label">الوصف</span>
                    <span class="modal-detail-value">${details.description}</span>
                </div>
                <div class="modal-detail-item">
                    <span class="modal-detail-label">فصيلة الدم</span>
                    <span class="modal-detail-value">${bloodType}</span>
                </div>
                    <div class="modal-detail-item">
                    <span class="modal-detail-label">درجة الاستعجال</span>
                    <span class="modal-detail-value">${details.urgency}</span>
                </div>
                <div class="modal-detail-item">
                    <span class="modal-detail-label">الوحدات المطلوبة</span>
                    <span class="modal-detail-value">${units}</span>
                </div>
                <div class="modal-detail-item">
                    <span class="modal-detail-label">التبرعات المستلمة</span>
                    <span class="modal-detail-value">${donations}</span>
                </div>
                <div class="modal-detail-item">
                    <span class="modal-detail-label">الموعد النهائي</span>
                    <span class="modal-detail-value">${deadline}</span>
                </div>
                <div class="modal-detail-item">
                    <span class="modal-detail-label">الحالة</span>
                    <span class="modal-detail-value">${status}</span>
                </div>
                <div class="modal-detail-item">
                    <span class="modal-detail-label">تاريخ الإنجاز</span>
                    <span class="modal-detail-value">${completion}</span>
                </div>
            </div>
        `;

        modalBody.innerHTML = modalContent;
        detailsModal.classList.add('active');
    });
});

// Close modal functions
function closeModal() {
    if (detailsModal) {
        detailsModal.classList.remove('active');
    }
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (closeModalFooterBtn) {
    closeModalFooterBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside
if (detailsModal) {
    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            closeModal();
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailsModal && detailsModal.classList.contains('active')) {
        closeModal();
    }
});

// Download Report Button
const downloadBtn = document.getElementById('download-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        showNotification('جاري تحميل التقرير...', 'info');
        
        setTimeout(() => {
            showNotification('تم تحميل التقرير بنجاح!', 'success');
        }, 2000);
    });
}

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


const rowsPerPage = 4;
const table = document.getElementById('history-table');
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


// Animate rows on load
function animateRows() {
    const rows = document.querySelectorAll('#history-tbody .table-row');
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

console.log('Request History Page initialized successfully');