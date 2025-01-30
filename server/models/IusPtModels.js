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

    tabNumber: { type: DataTypes.STRING,primaryKey: true, },
    name: { type: DataTypes.STRING },
    contractDetails: { type: DataTypes.STRING },
    computerName: { type: DataTypes.STRING },
    location: {type: DataTypes.STRING},
});

// Модель для промежуточной таблицы IusUserRoles
const IusUserRoles = sequelize.define('IusUserRoles', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tabNumber: { type: DataTypes.STRING, references: { model: 'IusUser', key: 'tabNumber' } },
    roleId: { type: DataTypes.INTEGER, references: { model: 'IusSpravRoles', key: 'id' } },
}, {
    indexes: [ 
        {
            unique: true,
            fields: ['tabNumber', 'roleId']
        }
    ]
});

// Связь многие ко многим между IusUser и IusSpravRoles
IusUser.belongsToMany(IusSpravRoles, {
    through: IusUserRoles,
    foreignKey: 'tabNumber', // Поле в промежуточной таблице, которое ссылается на IusUser
    otherKey: 'roleId',      // Поле в промежуточной таблице, которое ссылается на IusSpravRoles
});

IusSpravRoles.belongsToMany(IusUser, {
    through: IusUserRoles,
    foreignKey: 'roleId',    // Поле в промежуточной таблице, которое ссылается на IusSpravRoles
    otherKey: 'tabNumber',   // Поле в промежуточной таблице, которое ссылается на IusUser
});

IusUserRoles.belongsTo(IusSpravRoles, {
    foreignKey: 'roleId', // Поле в промежуточной таблице, которое ссылается на IusSpravRoles
    targetKey: 'id',      // Поле в IusSpravRoles, на которое ссылается roleId
});

IusUserRoles.belongsTo(IusUser, {
    foreignKey: 'tabNumber', // Поле в промежуточной таблице, которое ссылается на IusUser
    targetKey: 'tabNumber',  // Поле в IusUser, на которое ссылается tabNumber
});


 
// Связь один к одному между Staff.tab_num и IusUser.tabNumber
Staff.hasOne(IusUser, { foreignKey: 'tabNumber', sourceKey: 'tabNumber' });
IusUser.belongsTo(Staff, { foreignKey: 'tabNumber', targetKey: 'tabNumber' });

// Экспорт моделей  

module.exports = {
    IusSpravAdm,
    IusSpravRoles,
    IusUser,
    IusUserRoles, // Экспортируем промежуточную таблицу
};

