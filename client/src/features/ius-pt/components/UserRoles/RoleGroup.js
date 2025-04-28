import React, { useState, useMemo, useCallback } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import styles from './style.module.css';
import RoleSubGroup from './RoleSubGroup';
import RoleRow from './RoleRow';

// Вспомогательная функция для поверхностного сравнения объектов
const shallowEqual = (objA, objB) => {
  if (Object.is(objA, objB)) return true;

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
};

const RoleGroup = React.memo(({ 
  typename, 
  types, 
  expandedGroups, 
  toggleGroup, 
  onSelectRole 
}) => {
  const [allChecked, setAllChecked] = useState(false);

  const handleSelectAll = useCallback((checked) => {
    setAllChecked(checked);

    // Передаем состояние выбора всех ролей в родительский компонент
    Object.values(types).flat().forEach((role) => {
      onSelectRole(role, checked);
    });
  }, [types, onSelectRole]);

  // Проверяем, нужно ли формировать подгруппы
  const shouldCreateSubGroups = Object.keys(types).length > 1;

  // Мемоизированный список типов для подгрупп
  const typeKeys = useMemo(() => Object.keys(types), [types]);

  return (
    <div className={styles.group}>
      <div className={styles.groupHeader}>
        <Button
          variant="link"
          onClick={() => toggleGroup(typename)}
          aria-controls={`group-${typename}`}
          aria-expanded={expandedGroups[typename]}
          className={styles.toggleButton}
        >
          <span className={styles.icon}>
            {expandedGroups[typename] ? <FaAngleDown /> : <FaAngleRight />}
          </span>
        </Button>
        <div>
          <input
            type='checkbox'
            className={styles.checkbox}
            checked={allChecked}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          {typename} ({Object.values(types).flat().length} элементов)
        </div>
      </div>

      <Collapse in={expandedGroups[typename]}>
        <div id={`group-${typename}`} className={styles.groupContent}>
          {shouldCreateSubGroups ? (
            // Если подгрупп больше двух, отображаем подгруппы
            typeKeys.map((type) => (
              <RoleSubGroup
                key={`${typename}-${type}`}
                type={type}
                roles={types[type]}
                expanded={expandedGroups[`${typename}-${type}`]}
                toggleGroup={() => toggleGroup(`${typename}-${type}`)}
                allChecked={allChecked}
                onSelectRole={onSelectRole}
              />
            ))
          ) : (
            // Если подгрупп две или меньше, отображаем роли напрямую
            typeKeys.flatMap((type) => 
              types[type].map((role, index) => (
                <RoleRow
                  key={`${typename}-${type}-${index}`}
                  role={role}
                  isChecked={allChecked}
                  onSelectRole={onSelectRole}
                />
              ))
            )
          )}
        </div>
      </Collapse>
    </div>
  );
}, (prevProps, nextProps) => {
  // Кастомная функция сравнения для React.memo
  return (
    prevProps.typename === nextProps.typename &&
    shallowEqual(prevProps.types, nextProps.types) &&
    prevProps.expandedGroups[prevProps.typename] === 
      nextProps.expandedGroups[nextProps.typename] &&
    prevProps.onSelectRole === nextProps.onSelectRole
  );
});

export default RoleGroup;