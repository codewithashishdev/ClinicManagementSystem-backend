const dbConfig = require('../config/dbConfig')

const {Sequelize,DataTypes}= require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        // operatorsAliases :false,
        pool:{
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        },
        logging: false
    }
)

sequelize.authenticate()
.then(()=>{
    console.log('connected...')
})
.catch(err=>{
    console.log('error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize


db.user = require('./user')(sequelize,DataTypes)
db.appointment = require('./appointment')(sequelize,DataTypes)
db.feedback = require('./feedback')(sequelize,DataTypes)
db.bill = require('./bill')(sequelize,DataTypes)
db.Doctor = require('./Doctor')(sequelize,DataTypes)
db.Patient = require('./Patient')(sequelize,DataTypes)
db.Staff = require('./Staff')(sequelize,DataTypes)

db.sequelize.sync({force:false})
.then(()=>{
    console.log('re-sync')
})

module.exports = db