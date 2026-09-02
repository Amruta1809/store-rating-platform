const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: {
          args: [20, 60],
          msg: 'Name must be between 20 and 60 characters',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false, // stores bcrypt hash, never plain text
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: true,
      validate: {
        len: { args: [0, 400], msg: 'Address must be at most 400 characters' },
      },
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'NORMAL', 'STORE_OWNER'),
      allowNull: false,
      defaultValue: 'NORMAL',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password'] }, // never leak password hash by default
    },
    scopes: {
      withPassword: { attributes: {} },
    },
  }
);

module.exports = User;
