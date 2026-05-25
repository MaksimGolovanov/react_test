export const DRIVER_STATUSES = {
  at_work: { text: 'На работе', color: 'green' },
  on_vacation: { text: 'В отпуске', color: 'orange' },
  on_sick_leave: { text: 'На больничном', color: 'red' },
  on_study: { text: 'На учёбе', color: 'blue' },
  deactivated: { text: 'Деактивирован', color: 'default' },
};

export const getRowClassNameByStatus = (status) => {
  switch (status) {
    case 'at_work': return 'driver-row-at-work';
    case 'on_vacation': return 'driver-row-on-vacation';
    case 'on_sick_leave': return 'driver-row-on-sick-leave';
    case 'on_study': return 'driver-row-on-study';
    case 'deactivated': return 'driver-row-deactivated';
    default: return '';
  }
};