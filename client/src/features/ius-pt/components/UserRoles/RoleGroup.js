import React, { useState, useEffect } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import styles from './style.module.css';
import RoleSubGroup from './RoleSubGroup';

const RoleGroup = ({ typename, types, expandedGroups, toggleGroup }) => {
  const [allChecked, setAllChecked] = useState(false);

  const handleSelectAll = (checked) => {
    setAllChecked(checked);
  };

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
          {Object.keys(types).map((type) => (
            <RoleSubGroup
              key={type}
              type={type}
              roles={types[type]}
              expanded={expandedGroups[`${typename}-${type}`]}
              toggleGroup={() => toggleGroup(`${typename}-${type}`)}
              allChecked={allChecked}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default RoleGroup;