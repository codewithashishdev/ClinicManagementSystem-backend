const userType = require("../utils/userType")

module.exports = (sequelize, DataTypes) => {
    const appointment = sequelize.define('appointment', {
        ID:{

            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement :true
        },
        patientID:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        doctorID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            foreignKey:true
        },
        disease:{
            type: DataTypes.STRING,
            allowNull: true
        }

    })
    return appointment
}