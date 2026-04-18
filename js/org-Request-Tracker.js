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

// Get all table rows for filtering
const allRows = Array.from(document.querySelectorAll('.table-row'));
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const bloodTypeFilter = document.getElementById('blood-type-filter');
const dateFilter = document.getElementById('date-filter');
const emptyState = document.getElementById('empty-state');
const tableContainer = document.querySelector('.table-container');

// Search Functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterRequests();
    });
}

// Filter Functionality
function filterRequests() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const statusValue = statusFilter.value;
    const bloodValue = bloodTypeFilter.value;
    const dateValue = dateFilter.value;

    let visibleCount = 0;

    allRows.forEach(row => {
        const requestText = row.querySelector('.request-wrapper').textContent.toLowerCase();
        const rowStatus = row.dataset.status;
        const rowBlood = row.dataset.blood;
        const rowDate = row.dataset.date;

        // Search match
        const searchMatch = !searchTerm || requestText.includes(searchTerm);

        // Status match
        const statusMatch = statusValue === 'all' || rowStatus === statusValue;

        // Blood type match
        const bloodMatch = bloodValue === 'all' || rowBlood === bloodValue;

        // Date match (simplified)
        let dateMatch = true;
        if (dateValue !== 'all') {
            const today = new Date();
            const requestDate = new Date(rowDate);
            
            if (dateValue === 'today') {
                dateMatch = requestDate.toDateString() === today.toDateString();
            } else if (dateValue === 'week') {
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                dateMatch = requestDate >= weekAgo;
            } else if (dateValue === 'month') {
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                dateMatch = requestDate >= monthAgo;
            }
        }

        if (searchMatch && statusMatch && bloodMatch && dateMatch) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Show/hide empty state
    if (visibleCount === 0) {
        tableContainer.style.display = 'none';
        emptyState.classList.remove('hidden');
    } else {
        tableContainer.style.display = 'block';
        emptyState.classList.add('hidden');
    }
}

// Add event listeners to filters
if (statusFilter) statusFilter.addEventListener('change', filterRequests);
if (bloodTypeFilter) bloodTypeFilter.addEventListener('change', filterRequests);
if (dateFilter) dateFilter.addEventListener('change', filterRequests);

// Detail Modal Functionality
const detailModal = document.getElementById('detail-modal');
const closeDetailModal = document.getElementById('close-detail-modal');
const modalBody = document.getElementById('modal-body');

// Sample detailed data
const requestsData = {
    '12345': {
        id: '#12345',
        title: 'حالة طارئة O-',
        blood: 'O-',
        units: 5,
        created: '2023-11-15',
        deadline: '2023-11-18',
        status: 'قيد الانتظار',
        priority: 'عالية',
        location: 'مستشفى المدينة المركزي',
        description: 'مطلوب بشكل عاجل لحالة طوارئ جراحية',
        donor: 'لم يتم التعيين بعد'
    },
    '67890': {
        id: '#67890',
        title: 'جراحة A+',
        blood: 'A+',
        units: 3,
        created: '2023-11-10',
        deadline: '2023-11-12',
        status: 'مقبول من المتبرع',
        priority: 'متوسطة',
        location: 'مركز الجراحة الإقليمي',
        description: 'لعملية جراحية مجدولة',
        donor: 'أحمد محمود - +970-59-111-2222'
    },
    '24680': {
        id: '#24680',
        title: 'إمداد B-',
        blood: 'B-',
        units: 2,
        created: '2023-11-05',
        deadline: '2023-11-08',
        status: 'مؤكد في الموقع',
        priority: 'متوسطة',
        location: 'بنك الدم المركزي',
        description: 'تجديد مخزون البنك',
        donor: 'فاطمة علي - +970-59-333-4444'
    },
    '13579': {
        id: '#13579',
        title: 'أطفال AB+',
        blood: 'AB+',
        units: 1,
        created: '2023-10-30',
        deadline: '2023-11-02',
        status: 'مكتمل',
        priority: 'عالية',
        location: 'مستشفى الأطفال',
        description: 'لقسم أمراض الدم للأطفال',
        donor: 'محمد حسن - +970-59-555-6666'
    },
    '97531': {
        id: '#97531',
        title: 'بحث O+',
        blood: 'O+',
        units: 4,
        created: '2023-10-25',
        deadline: '2023-10-28',
        status: 'ملغي',
        priority: 'منخفضة',
        location: 'مركز الأبحاث الطبية',
        description: 'للأغراض البحثية',
        donor: 'لم يتم التعيين'
    },
    '55555': {
        id: '#55555',
        title: 'عاجل AB-',
        blood: 'AB-',
        units: 2,
        created: '2023-10-20',
        deadline: '2023-10-21',
        status: 'منتهي',
        priority: 'عالية',
        location: 'مستشفى الطوارئ',
        description: 'حالة طارئة',
        donor: 'لم يتم التعيين'
    }
};

// View Details buttons
const viewButtons = document.querySelectorAll('.btn-view');

viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        const requestId = button.dataset.id;
        const data = requestsData[requestId];

        if (data) {
            const statusClass = getStatusClass(data.status);
            const priorityClass = getPriorityClass(data.priority);

            const modalContent = `
                <div class="modal-detail-grid">
                    <div class="modal-detail-item">
                        <span class="modal-detail-label">رقم الطلب</span>
                        <span class="modal-detail-value">${data.id}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label">العنوان</span>
                        <span class="modal-detail-value">${data.title}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label">فصيلة الدم</span>
                        <span class="modal-detail-value">
                            <span class="blood-badge blood-${data.blood.toLowerCase().replace('+', '-positive').replace('-', '-negative')}">${data.blood}</span>
                        </span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label">عدد الوحدات</span>
                        <span class="modal-detail-value">${data.units}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label">تاريخ الإنشاء</span>
                        <span class="modal-detail-value">${data.created}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label">الموعد النهائي</span>
                        <span class="modal-detail-value">${data.deadline}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label">الحالة</span>
                        <span class="modal-detail-value">
                            <span class="status-badge ${statusClass}">${data.status}</span>
                        </span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label">الأولوية</span>
                        <span class="modal-detail-value">${data.priority}</span>
                    </div>
                    <div class="modal-detail-item full-width">
                        <span class="modal-detail-label">الموقع</span>
                        <span class="modal-detail-value">${data.location}</span>
                    </div>
                    <div class="modal-detail-item full-width">
                        <span class="modal-detail-label">الوصف</span>
                        <span class="modal-detail-value">${data.description}</span>
                    </div>
                    <div class="modal-detail-item full-width">
                        <span class="modal-detail-label">المتبرع</span>
                        <span class="modal-detail-value">${data.donor}</span>
                    </div>
                </div>
            `;

            modalBody.innerHTML = modalContent;
            detailModal.classList.add('active');
        }
    });
});

function getStatusClass(status) {
    const statusMap = {
        'قيد الانتظار': 'status-waiting',
        'مقبول من المتبرع': 'status-accepted',
        'مؤكد في الموقع': 'status-confirmed',
        'مكتمل': 'status-completed',
        'ملغي': 'status-cancelled',
        'منتهي': 'status-expired'
    };
    return statusMap[status] || 'status-waiting';
}

function getPriorityClass(priority) {
    const priorityMap = {
        'عالية': 'priority-high',
        'متوسطة': 'priority-medium',
        'منخفضة': 'priority-low'
    };
    return priorityMap[priority] || 'priority-medium';
}

// Close detail modal
if (closeDetailModal) {
    closeDetailModal.addEventListener('click', () => {
        detailModal.classList.remove('active');
    });
}

// Close modal when clicking outside
if (detailModal) {
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            detailModal.classList.remove('active');
        }
    });
}

// QR Code Modal Functionality
const qrModal = document.getElementById('qr-modal');
const closeQrModal = document.getElementById('close-qr-modal');
const downloadQrBtn = document.getElementById('download-qr');

// QR buttons
const qrButtons = document.querySelectorAll('.btn-qr-icon');

qrButtons.forEach(button => {
    button.addEventListener('click', () => {
        const requestId = button.dataset.id;
        qrModal.classList.add('active');
        
        // Generate QR code appearance (placeholder)
        const qrCode = document.getElementById('qr-code');
        if (qrCode) {
            qrCode.style.animation = 'pulse 0.5s ease-out';
            setTimeout(() => {
                qrCode.style.animation = '';
            }, 500);
        }
    });
});

// Close QR modal
if (closeQrModal) {
    closeQrModal.addEventListener('click', () => {
        qrModal.classList.remove('active');
    });
}

// Close QR modal when clicking outside
if (qrModal) {
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.classList.remove('active');
        }
    });
}

// Download QR code
if (downloadQrBtn) {
    downloadQrBtn.addEventListener('click', () => {
        const originalHTML = downloadQrBtn.innerHTML;
        downloadQrBtn.innerHTML = '<span>⏳</span><span>جاري التحميل...</span>';
        downloadQrBtn.disabled = true;

        setTimeout(() => {
            downloadQrBtn.innerHTML = '<span>✅</span><span>تم التحميل</span>';
            showNotification('تم تحميل رمز QR بنجاح', 'success');

            setTimeout(() => {
                downloadQrBtn.innerHTML = originalHTML;
                downloadQrBtn.disabled = false;
            }, 2000);
        }, 1000);
    });
}

// Cancel Request buttons
const cancelButtons = document.querySelectorAll('.btn-cancel-icon');

cancelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const requestId = button.dataset.id;
        const row = button.closest('.table-row');
        
        if (confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
            // Add loading animation
            row.style.animation = 'fadeOutRow 0.5s ease-out forwards';
            
            setTimeout(() => {
                row.remove();
                showNotification(`تم إلغاء الطلب #${requestId}`, 'info');
                
                // Check if table is empty
                const remainingRows = document.querySelectorAll('.table-row');
                if (remainingRows.length === 0) {
                    tableContainer.style.display = 'none';
                    emptyState.classList.remove('hidden');
                }
            }, 500);
        }
    });
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
            transform: scale(0.9);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
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
        }, index * 80);
    });
}

// Call animation on page load
window.addEventListener('load', () => {
    animateRows();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        if (detailModal.classList.contains('active')) {
            detailModal.classList.remove('active');
        }
        if (qrModal.classList.contains('active')) {
            qrModal.classList.remove('active');
        }
    }

    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    }
});

// Profile section interaction
const profileSection = document.querySelector('.profile-section');
if (profileSection) {
    profileSection.addEventListener('click', () => {
        showNotification('سيتم إعادة توجيهك إلى الملف الشخصي', 'info');
    });
}

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
console.log('Track Requests Page initialized');
console.log('Total requests:', allRows.length);

// Real-time status updates simulation (optional)
function simulateStatusUpdates() {
    setInterval(() => {
        const waitingRows = document.querySelectorAll('[data-status="waiting"]');
        if (waitingRows.length > 0 && Math.random() > 0.95) {
            const randomRow = waitingRows[Math.floor(Math.random() * waitingRows.length)];
            const statusBadge = randomRow.querySelector('.status-badge');
            
            statusBadge.classList.remove('status-waiting');
            statusBadge.classList.add('status-accepted');
            statusBadge.textContent = 'مقبول من المتبرع';
            randomRow.dataset.status = 'accepted';
            
            showNotification('تحديث: تم قبول طلب جديد من متبرع!', 'success');
        }
    }, 30000); // Check every 30 seconds
}

// Uncomment to enable real-time updates
// simulateStatusUpdates();

console.log('All event listeners attached successfully');


document.addEventListener('DOMContentLoaded', function() {
  const containers = document.querySelectorAll('.action-buttons-container');
  
  containers.forEach(container => {
    const toggle = container.querySelector('.dropdown-toggle');
    
    if (toggle) {
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        container.classList.toggle('open');
      });
    }
  });
  
  // إغلاق القائمة عند الضغط خارجها
  document.addEventListener('click', function() {
    containers.forEach(container => {
      container.classList.remove('open');
    });
  });
  
  // إغلاق القائمة عند الضغط على أحد الأزرار
  const buttons = document.querySelectorAll('.btn-qr-icon, .btn-cancel-icon');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const container = this.closest('.action-buttons-container');
      if (container) {
        container.classList.remove('open');
      }
    });
  });
});





const rowsPerPage = 4;
const table = document.getElementById('blood-table');
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
