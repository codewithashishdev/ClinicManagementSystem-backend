const userType = require("../utils/userType")

module.exports = (sequelize, DataTypes) => {
    const feedback = sequelize.define('feedback', {
        feedbackID:{
            type: DataTypes.INTEGER,
            autoincrement: true,
            primaryKey:true,
            unique: true
        },//appointment
        appointmentID:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        patientID:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        medicine:{
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        discription:{
            type: DataTypes.TEXT
        },
        doctorID:{
            type: DataTypes.STRING,
            allowNull: false
        }
     })
    return feedback
}