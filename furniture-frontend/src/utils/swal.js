import Swal from 'sweetalert2';

const baseOptions = {
  background: '#1f2937', 
  color: '#f9fafb',
  confirmButtonColor: '#3b82f6', 
  cancelButtonColor: '#374151', 
  customClass: {
    popup: 'rounded-xl border border-gray-700',
    confirmButton: 'px-5 py-2.5 rounded-lg font-medium ml-2',
    cancelButton: 'px-5 py-2.5 rounded-lg font-medium mr-2 bg-gray-700 hover:bg-gray-600'
  },
  buttonsStyling: false
};

// Re-apply specific inline styles where buttonsStyling: false removes them completely
// In a real app with Tailwind, we might just inject the Tailwind button classes.
const tailwindBtnPrimary = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ml-2 transition-colors';
const tailwindBtnDanger = 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg ml-2 transition-colors';
const tailwindBtnCancel = 'bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors';

const baseSwal = Swal.mixin({
  background: '#1f2937', // dark-800
  color: '#f9fafb',
  width: '22em',
  padding: '1em',
  customClass: {
    popup: 'rounded-2xl border border-gray-700 shadow-2xl',
    title: 'font-display text-lg',
    confirmButton: tailwindBtnPrimary,
    cancelButton: tailwindBtnCancel,
  },
  buttonsStyling: false,
});

export const showSuccess = (title, text = '') => {
  return baseSwal.fire({
    icon: 'success',
    title,
    text,
    timer: 2500,
    showConfirmButton: false,
  });
};

export const showError = (title, text = '') => {
  return baseSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Okay',
  });
};

export const confirmAction = async (title, text, confirmButtonText = 'Yes', isDanger = false) => {
  const result = await baseSwal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'rounded-2xl border border-gray-700 shadow-2xl',
      title: 'font-display',
      confirmButton: isDanger ? tailwindBtnDanger : tailwindBtnPrimary,
      cancelButton: tailwindBtnCancel,
    }
  });
  return result.isConfirmed;
};

export const confirmDelete = async (itemName = 'this item') => {
  return confirmAction(
    'Are you sure?',
    `Delete ${itemName}? This action cannot be undone.`,
    'Yes, delete it',
    true
  );
};
