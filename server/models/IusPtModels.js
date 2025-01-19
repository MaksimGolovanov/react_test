const sequelize = require('../db')
const { DataTypes } = require('sequelize')


//const IusUser = sequelize.define('iususer', {



//});

const IusSpravAdm = sequelize.define('iusspravadm',{

    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    iusadm: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING }
});
 
const IusSpravType = sequelize.define('iusspravtype',{

    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING }
    
});
const IusSpravRoles = sequelize.define('iusspravroles',{

    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    typename: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING },
    mandat: { type: DataTypes.STRING },
    
    
});

module.exports = {
    IusSpravAdm, IusSpravType, IusSpravRoles
} 