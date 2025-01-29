import React, { useState, useEffect } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import styles from './style.module.css';
import RoleRow from './RoleRow';

const RoleSubGroup = ({ type, roles, expanded, toggleGroup, allChecked, onSelectRole }) => {
  const [subGroupChecked, setSubGroupChecked] = useState(false);

  useEffect(() => {
    setSubGroupChecked(allChecked);
  }, [allChecked]);

  const handleSelectAll = (checked) => {
    setSubGroupChecked(checked);
  };

  return (
    <div className={styles.subGroup}>
      <div className={styles.subGroupHeader}>
        <Button
          variant="link"
          onClick={() => toggleGroup(type)}
          aria-controls={`sub-group-${type}`}
          aria-expanded={expanded}
          className={styles.toggleButton}
        >
          <span className={styles.icon}>
            {expanded ? <FaAngleDown /> : <FaAngleRight />}
          </span>
        </Button>
        <div>
          <input
            type='checkbox'
            className={styles.checkbox}
            checked={subGroupChecked}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          {type} ({roles.length} элементов)
        </div>
      </div>

      <Collapse in={expanded}>
        <div id={`sub-group-${type}`} className={styles.groupContent}>
          {roles.map((role, index) => (
            <RoleRow
              key={`${type}-${index}`}
              role={role}
              isChecked={subGroupChecked}
              onSelectRole={onSelectRole}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default RoleSubGroup;