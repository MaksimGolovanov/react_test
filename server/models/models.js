const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('users', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     login: { type: DataTypes.STRING, unique: true },
     password: { type: DataTypes.STRING },
     description: { type: DataTypes.STRING },
     tabNumber: { type: DataTypes.STRING },
})
const Role = sequelize.define('roles', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     role: { type: DataTypes.STRING, defaultValue: 'USER' },
     description: { type: DataTypes.STRING },
})
const Dolgnost = sequelize.define('dolgnost', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     dolgn: { type: DataTypes.STRING, },
     dolgn_s: { type: DataTypes.STRING },
})
const Staff = sequelize.define('stafs', {
     tabNumber: { type: DataTypes.STRING, primaryKey: true },
     login: { type: DataTypes.STRING },
     fio: { type: DataTypes.STRING },
     post: { type: DataTypes.STRING },
     organization: { type: DataTypes.STRING },
     department: { type: DataTypes.STRING },
     email: { type: DataTypes.STRING },
     telephone: { type: DataTypes.STRING },
     ip: { type: DataTypes.STRING },
     del: { type: DataTypes.STRING },
})
const Department = sequelize.define('department', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     code: { type: DataTypes.STRING },
     description: { type: DataTypes.STRING },
     short_name: { type: DataTypes.STRING },
})
const Prints = sequelize.define('prints', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     url: { type: DataTypes.STRING },
     ip: { type: DataTypes.STRING },
     logical_name: { type: DataTypes.STRING },
     print_model: { type: DataTypes.STRING },
     department: { type: DataTypes.STRING },
     location: { type: DataTypes.STRING },
     serial_number: { type: DataTypes.STRING },
     status: { type: DataTypes.INTEGER },
     description: { type: DataTypes.STRING },
})

const Usb = sequelize.define('usb', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     num_form: { type: DataTypes.STRING },
     ser_num: { type: DataTypes.STRING },
     volume: { type: DataTypes.STRING },
     data_uch: { type: DataTypes.DATE },
     email: { type: DataTypes.STRING },
     fio: { type: DataTypes.STRING },
     department: { type: DataTypes.STRING },
     data_prov: { type: DataTypes.DATE },
     log: { type: DataTypes.STRING },
}) 
const Card = sequelize.define('card', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     ser_num: { type: DataTypes.STRING },
     type: { type: DataTypes.STRING },
     description: { type: DataTypes.STRING },
     fio: { type: DataTypes.STRING },
     department: { type: DataTypes.STRING },
     data_prov: { type: DataTypes.DATE },
     log: { type: DataTypes.STRING },
}) 

const PrintsModel = sequelize.define('printsmodels', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     name: { type: DataTypes.STRING },
     cartridge: { type: DataTypes.STRING },
     paper_size: { type: DataTypes.STRING },
     scanner: { type: DataTypes.STRING },
     img1: { type: DataTypes.STRING },
     img2: { type: DataTypes.STRING },
     img3: { type: DataTypes.STRING },
})

const Location = sequelize.define('location', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     location: { type: DataTypes.STRING },
})

const PrinterStatistics = sequelize.define('printerstatistics', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     itemid: { type: DataTypes.STRING },
     clock: { type: DataTypes.INTEGER },
     value: { type: DataTypes.INTEGER },
})

const Post = sequelize.define('post', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     title: { type: DataTypes.STRING(200), allowNull: false },
     body: { type: DataTypes.TEXT, allowNull: false },
})

const IP_addresses = sequelize.define('ip_addresses', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     ip: { type: DataTypes.STRING(15), allowNull: false },
     subnet_mask: { type: DataTypes.STRING(15) },
     device_type: { type: DataTypes.STRING(60) },
     switch: { type: DataTypes.STRING(60) },
     switch_port: { type: DataTypes.STRING(5) },
     network_segment: { type: DataTypes.STRING(50) },
     description: { type: DataTypes.TEXT },
})

Prints.belongsToMany(PrintsModel, { through: 'print_models' })
PrintsModel.belongsToMany(Prints, { through: 'print_models' })

User.belongsToMany(Role, { through: 'user_roles' })
Role.belongsToMany(User, { through: 'user_roles' })

const EsMtr = sequelize.define('EsMtr', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     cod: { type: DataTypes.STRING },
     name: { type: DataTypes.STRING },
     unit: { type: DataTypes.STRING },
     gross: { type: DataTypes.STRING },
     cargoClass: { type: DataTypes.STRING },
     jobCategory: { type: DataTypes.STRING },
     BasicEstimatedPrice: { type: DataTypes.INTEGER },
     BasicWholesalePrice: { type: DataTypes.INTEGER },
     BasicJustification: { type: DataTypes.STRING },
     CurrentEstimatedPrice: { type: DataTypes.INTEGER },
     CurrentWholesalePrice: { type: DataTypes.INTEGER },
     CurrentJustification: { type: DataTypes.STRING },
     Note: { type: DataTypes.STRING },
})

module.exports = {
     User,
     Role,
     Staff,
     Department,
     Prints,
     PrintsModel,
     Location,
     PrinterStatistics,
     Post,
     EsMtr,
     IP_addresses,
     Dolgnost,
     Usb,
     Card
}
