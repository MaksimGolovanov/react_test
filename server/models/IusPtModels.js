const sequelize = require('../db')
const { DataTypes } = require('sequelize')
const { Staff } = require('./models');


//const IusUser = sequelize.define('iususer', {



//});

const IusSpravAdm = sequelize.define('IusSpravAdm', {

    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    iusadm: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING }
});


const IusSpravRoles = sequelize.define('IusSpravRoles', {

    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    typename: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING },
    mandat: { type: DataTypes.STRING },
    business_process: { type: DataTypes.STRING },


});

const IusUser = sequelize.define('IusUser', {

    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tabNumber: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    contractDetails: { type: DataTypes.STRING },
    computerName: { type: DataTypes.STRING },
});

// Модель для промежуточной таблицы IusUserRoles
const IusUserRoles = sequelize.define('IusUserRoles', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tabNumber: { type: DataTypes.STRING, allowNull: false }, // Связь с IusUser
    roleId: { type: DataTypes.INTEGER, allowNull: false }, // Связь с IusSpravRoles
});

// Связь многие ко многим между IusUser и IusSpravRoles
IusUser.belongsToMany(IusSpravRoles, {
    through: IusUserRoles, // Используем модель промежуточной таблицы
    foreignKey: 'tabNumber', // Поле в промежуточной таблице, ссылающееся на IusUser
    otherKey: 'roleId', // Поле в промежуточной таблице, ссылающееся на IusSpravRoles
});

IusSpravRoles.belongsToMany(IusUser, {
    through: IusUserRoles, // Используем модель промежуточной таблицы
    foreignKey: 'roleId', // Поле в промежуточной таблице, ссылающееся на IusSpravRoles
    otherKey: 'tabNumber', // Поле в промежуточной таблице, ссылающееся на IusUser
});

// Связь один к одному между Staff.tab_num и IusUser.tabNumber
Staff.hasOne(IusUser, { foreignKey: 'tabNumber', sourceKey: 'tab_num' });
IusUser.belongsTo(Staff, { foreignKey: 'tabNumber', targetKey: 'tab_num' });

// Экспорт моделей  

module.exports = {
    IusSpravAdm,
    IusSpravRoles,
    IusUser,
    IusUserRoles, // Экспортируем промежуточную таблицу
};

