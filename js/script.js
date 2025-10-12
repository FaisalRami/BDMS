let selectedOption = null;

function selectOption(option) {
  selectedOption = option;

//   إزالة التحديد من كل الكروت
  document.querySelectorAll('.card-option').forEach(card => {
    card.classList.remove('selected');
  });

  // تحديد الكرت المختار
  document.getElementById(option).classList.add('selected');
}

function goToPage() {
  if (!selectedOption) {
    alert("يرجى اختيار أحد الخيارات قبل المتابعة.");
    return;
  }

  // الانتقال للصفحة المناسبة
  if (selectedOption === 'donor') {
    window.location.href = 'regestrationDonor.html';
  } else if (selectedOption === 'organization') {
    window.location.href = 'regestrationOrganization.html';
  }
}
