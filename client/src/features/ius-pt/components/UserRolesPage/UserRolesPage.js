import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react-lite';
import iusPtStore from "../../store/IusPtStore";
import styles from './style.module.css';
import SearchInput from '../SearchInput/SearchInput';
import * as XLSX from 'xlsx';

const UserRolesPage = observer(({ info }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]); // Состояние для выбранных ролей
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        iusPtStore.fetchRoles();
    }, []);

    // Фильтрация ролей по выбранному типу и поисковому запросу
    const filteredRoles = selectedType
        ? iusPtStore.roles
            .filter(
                (role) =>
                    role.typename === selectedType &&
                    (role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        role.name.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .sort((a, b) => a.code.localeCompare(b.code))
        : [];

    // Обработчик выбора роли
    const handleRoleSelect = (roleId) => {
        setSelectedRoles((prevSelectedRoles) => {
            if (prevSelectedRoles.includes(roleId)) {
                // Если роль уже выбрана, удаляем её из списка
                return prevSelectedRoles.filter((id) => id !== roleId);
            } else {
                // Если роль не выбрана, добавляем её в список
                return [...prevSelectedRoles, roleId];
            }
        });
    };

    // Обработчик сохранения выбранных ролей
    const saveSelectedRoles = async () => {
        const tabNumber = info.IusUser?.tabNumber;
        if (!tabNumber) {
            console.error("Ошибка: табельный номер не указан.");
            alert("Ошибка: табельный номер не указан.");
            return;
        }

        try {
            await iusPtStore.addRolesToUser(tabNumber, selectedRoles);
            alert("Роли успешно сохранены!");
        } catch (error) {
            console.error("Ошибка при сохранении ролей:", error);
            alert("Ошибка при сохранении ролей.");
        } 
    };

    // Обработчик загрузки файла Excel
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);

                // Сопоставление code из Excel с id ролей из справочника
                const rolesFromExcel = json.map(row => row.code);
                const matchedRoles = iusPtStore.roles
                    .filter(role => rolesFromExcel.includes(role.code))
                    .map(role => role.id);

                setSelectedRoles(matchedRoles);
                alert("Файл успешно загружен и роли сопоставлены!");
            } catch (error) {
                console.error("Ошибка при обработке файла:", error);
                alert("Ошибка при обработке файла. Убедитесь, что файл имеет правильный формат.");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className={styles.container}>
            <div className={styles.layout}>
                {/* Список типов ИУС слева */}
                <div className={styles.types}>
                    <h5>Выбор ИУС</h5>
                    {iusPtStore.rolesTypes.map((type, index) => (
                        <div
                            key={index}
                            className={`${styles.row} ${selectedType === type ? styles.selected : ''}`}
                            onClick={() => setSelectedType(type)}
                        >
                            {type}
                        </div>
                    ))}
                </div>

                {/* Список ролей справа */}
                <div className={styles.roles}>
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Поиск ролей..."
                    />
                    {selectedType && (
                        <>
                            <div className={styles.headerRow}>
                                <h6>Роли для ИУС: {selectedType}</h6>
                                <div className={styles.selectedCount}>
                                    Выбрано ролей: {selectedRoles.length}
                                </div>
                            </div>
                            <div className={styles.rolesList}>
                                {filteredRoles.map((role, index) => (
                                    <div key={index} className={styles.row}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role.id)}
                                            onChange={() => handleRoleSelect(role.id)}
                                            className={styles.checkbox}
                                        />
                                        <div className={styles.roleDetails}>
                                            <div className={styles.rolecode}>{role.code}</div>
                                            <div className={styles.rolename}>{role.name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Кнопка для сохранения выбранных ролей */}
                            <button onClick={saveSelectedRoles} className={styles.saveButton}>
                                Сохранить выбранные роли
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Поле для загрузки файла Excel */}
            <div className={styles.fileUpload}>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </div>
        </div>
    );
});

export default UserRolesPage;