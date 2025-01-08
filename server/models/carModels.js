const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const Car = sequelize.define('Car', {
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  const Driver = sequelize.define('Driver', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
  });

  const Status = sequelize.define('Status', {
    status_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  const Customer = sequelize.define('Customer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_info: {
      type: DataTypes.STRING,
    },
  });
  const Order = sequelize.define('Order', {
    order_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  });
  
  Order.belongsTo(Car, { foreignKey: 'car_id' });
  Order.belongsTo(Customer, { foreignKey: 'customer_id' });

  Car.belongsTo(Driver, { foreignKey: 'driver_id' });
Car.belongsTo(Status, { foreignKey: 'status_id' });
Order.belongsTo(Car, { foreignKey: 'car_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = {
  Car,
  Driver,
  Status,
  Customer,
  Order,
};