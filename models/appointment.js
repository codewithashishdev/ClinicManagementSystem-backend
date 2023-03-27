const userType = require("../utils/userType")

module.exports = (sequelize, DataTypes) => {
    const appointment = sequelize.define('appointment', {
        patientID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
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
        created_by:{    
            type: DataTypes.ENUM,
            values: userType.Type,
        },
        disease:{
            type: DataTypes.STRING,
            allowNull: true
        },
        is_visited:{
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        is_deleted:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        }

    })
    return appointment
}