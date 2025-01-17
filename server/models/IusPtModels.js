const sequelize = require('../db')
const { DataTypes } = require('sequelize')


//const IusUser = sequelize.define('iususer', {



//});

const IusSpravAdm = sequelize.define('iusspravadm',{

    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    iusadm: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING }
});
 

module.exports = {
    IusSpravAdm
}