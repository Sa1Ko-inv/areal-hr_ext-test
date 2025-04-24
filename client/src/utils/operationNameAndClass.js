export const getOperationName = (type) => {
  const operation = {
    create: 'Создание',
    update: 'Обновление',
    hire: 'Прием на работу',
    fire: 'Увольнение',
    department_change: 'Смена отдела',
    salary_change: 'Изменение зарплаты',
  };
  return operation[type] || type;
}

export const getOperationClass = (type) => {
  return `operation-${type}`;
}