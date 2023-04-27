'use strict'
const userType = require('../utils/userType')
module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define('Staff', {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement :true
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        gender: {
            type: DataTypes.ENUM,
           values: userType.gender
        },

        phone: {
            type: DataTypes.BIGINT,
            allowNull:false
        },

        email: {
            type: DataTypes.STRING,
            allowNull:false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        user_type: {
            type:  DataTypes.ENUM,
            values: userType.Type
        },
        
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        address_line_1: {
            type: DataTypes.STRING,
            allowNull: false
        },

        address_line_2: {
            type: DataTypes.STRING,
        },

        landmark: {
            type: DataTypes.STRING,
            allowNull: false
        },

        city: {
            type: DataTypes.STRING,
            allowNull: false
        },

        state: {
            type: DataTypes.STRING,
            allowNull:false
        },

        pin: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
return Staff
}