const userType = require('../utils/userType')
module.exports = (sequelize, DataTypes) => {
    const bill = sequelize.define('bill', {
        patientID:{
            type: DataTypes.INTEGER,
            autoincrement: true,
            primaryKey:true,
            allowNull: false
        },
        appointmentID:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Medicine:{
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
        unitPrice:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Numberofunit:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Amount:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        TotalAmount:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Payment_type:{
            type: DataTypes.ENUM,
            values:userType.payment, //card cash, UPI
            allowNull: false
        },
        payment_status:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        } 
     })
    return bill
}








// Bill 			
// 	Datatype	allow Null	enum

// unitPrice	inateger	no	
// Numberofunit	integer	yes	
// Amout	integer	yes	
// TotalAmount	integer	yes	
// Payment_type	integer	no	online,offline
// payment_status	boolean	no	yes,no