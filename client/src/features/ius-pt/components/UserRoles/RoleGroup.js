import React, { useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import styles from './style.module.css';
import RoleSubGroup from './RoleSubGroup';
import RoleRow from './RoleRow'; // Импортируем RoleRow для отображения ролей напрямую

const RoleGroup = ({ typename, types, expandedGroups, toggleGroup, onSelectRole }) => {
  const [allChecked, setAllChecked] = useState(false);

  const handleSelectAll = (checked) => {
    setAllChecked(checked);

    // Передаем состояние выбора всех ролей в родительский компонент
    Object.values(types).flat().forEach((role) => {
      onSelectRole(role, checked);
    });
  };

  // Проверяем, нужно ли формировать подгруппы
  const shouldCreateSubGroups = Object.keys(types).length > 1;

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
            Object.keys(types).map((type) => (
              <RoleSubGroup
                key={type}
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
            Object.values(types).flat().map((role, index) => (
              <RoleRow
                key={`${typename}-${index}`}
                role={role}
                isChecked={allChecked}
                onSelectRole={onSelectRole}
              />
            ))
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default RoleGroup;