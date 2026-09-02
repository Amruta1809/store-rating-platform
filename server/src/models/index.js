const sequelize = require('../config/db');
const User = require('./user.model');
const Store = require('./store.model');
const Rating = require('./rating.model');

// A store optionally belongs to one owner (User with role STORE_OWNER)
User.hasOne(Store, { foreignKey: 'ownerId', as: 'ownedStore' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// A user can rate many stores; a store can have many ratings
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

module.exports = { sequelize, User, Store, Rating };
