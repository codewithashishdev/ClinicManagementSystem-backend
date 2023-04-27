const bcrypt = require('bcrypt')
const Joi = require('joi')
const db = require("../models")
const util = require("../utils/const")
const { GenerateToken } = require('../middleware/anthentication')
const otp = require('../otp/otpGenerate')
const nodemailer = require('nodemailer');
const userType = require('../utils/userType')
const otpGenerator = require('otp-generator');


const User = db.user



const signup = async (req, res) => {

    try {
        let userschema = Joi.object().keys({
            full_name: Joi.string().min(3).required(),
            gender: Joi.string().required(),
            phone: Joi.number().integer().min(1000000000).max(9999999999).message('Invalid mobile number').required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
            user_type: Joi.string().required(),
            date_of_birth: Joi.date().required(),
            address_line_1: Joi.string(),
            address_line_2: Joi.string(),
            landmark: Joi.string(),
            city: Joi.string().required(),
            state: Joi.string(),
            pin: Joi.number().integer().min(111111).max(999999)
        })
        //validate req.body
        const error = userschema.validate(req.body)
        if (error.error) {
            return res.status(400).send(
                {
                    error: true,
                    data: null,
                    message: error.error.details[0].message
                }
            );
        }
        else {
            //bcrypt password hash
            req.body.password = await bcrypt.hash(req.body.password, 10);
            //crate user in db
            if (req.body.user_type === 'Doctor') {
                console.log('doctor')
                const user = await db.Doctor.create(req.body)
                return res.status(201).send({
                    error: false,
                    data: user,
                    message: util.create
                })
            }
            if (req.body.user_type === 'Staff') {
                const user = await db.Staff.create(req.body)
                return res.status(201).send({
                    error: false,
                    data: user,
                    message: util.create
                })
            }
            if (req.body.user_type === 'Patient') {
                const user = await db.Patient.create(req.body)
                return res.status(201).send({
                    error: false,
                    data: user,
                    message: util.create
                })
            }

        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            error: error,
            message:'Already resister'
        })
    }
}

//login section
const login = async (req, res) => {
    try {
        console.log('in try')
        let loginschema = Joi.object().keys({
            user_type: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
        const error = loginschema.validate(req.body)
        if (error.error) {
            return res.status(400).send({
                error: error.error.details[0].message,
            })
        }
        else {
            if (req.body.user_type === 'Doctor') {
                const user = await db.Doctor.findOne({
                    where: { email: req.body.email },
                    raw: true
                })

                if (user) {
                    const ComparePassword = await bcrypt.compare(req.body.password, user.password)
                    console.log(ComparePassword)
                    if (ComparePassword) {
                        // generate token
                        user.token = await GenerateToken(user)

                        res.status(200).send({
                            isSuccess: true,
                            Message: util.login,
                            Data: user,
                        })
                    }
                    else {
                        res.status(400).send({
                            isSuccess: false,
                            message: util.wrongusername,
                            data: null,
                        })
                    }
                }else{
                    res.status(400).send({
                        isSuccess: true,
                        Message: 'Doctor Not Exist',
                        Data: null,
                    })
                }
            }

            if (req.body.user_type === 'Patient') {
                const user = await db.Patient.findOne({
                    where: { email: req.body.email },
                    raw: true
                })
                // console.log(email);
                if (user) {
                    const cmp = await bcrypt.compare(req.body.password, user.password)
                    console.log(cmp)
                    if (cmp) {
                        // generate 
                        user.token = await GenerateToken(user)

                        res.status(200).send({
                            isSuccess: true,
                            Message: util.login,
                            Data: user,
                        })
                    }
                }else{
                    res.status(400).send({
                        isSuccess: true,
                        Message: 'Patient Mamber Not Exist',
                        Data: null,
                    })
                }

            }

            if (req.body.user_type === 'Staff') {
                const user = await db.Staff.findOne({
                    where: { email: req.body.email },
                    raw: true
                })
                // console.log(email);
                if (user) {
                    const cmp = await bcrypt.compare(req.body.password, user.password)
                    console.log(cmp)
                    if (cmp) {
                        // generate token
                        user.token = await GenerateToken(user)

                        res.status(200).send({
                            isSuccess: true,
                            Message: util.login,
                            Data: user,
                        })
                    }
                }else{
                    res.status(400).send({
                        isSuccess: true,
                        Message: 'Staff Mamber Not Exist',
                        Data: null,
                    })
                }
            }
        }
    } catch (error) {
        // console.log(error)
        res.status(500).send(util.catch)
    }
}
//change password
const changePassword = async (req, res) => {
    try {
        let change_password = Joi.object().keys({
            old_password: Joi.string().required(),
            new_password: Joi.string().required(),
            comfirm_password: Joi.string().required()
        })
        const error = change_password.validate(req.body).error
        if (error) {
            return res.status(400).send({
                error: error.details[0].message,
            })
        }
        else {
            console.log('this')
            if (req.body.new_password !== req.body.comfirm_password) {
                return res.status(400).send({
                    error: util.oldnewpwd
                })
            }
            else {
                console.log('this2')
                console.log(req.user.email)
                const user = await db.Patient.findOne({
                    where:{email :req.user.email}
                })
                // console.log(user)
                // console.log('this3')
                if (user) {
                    const cmp = await bcrypt.compare(req.body.old_password, user.password)
                    if (cmp) {
                        let hashPassword = await bcrypt.hash(req.body.new_password, 10);
                        await db.Patient.update(
                            {
                                password: hashPassword
                            }, {
                            where: {
                                email: req.user.email
                            }
                        }, {
                            return: true
                        })
                        res.status(200).send({
                            message: util.changepassword
                        })
                    }
                    else {
                        return res.status(401).send({
                            error: true,
                            data: null,
                            message: util.notmachedpwd
                        })
                    }
                }
            }
        }
    } catch (error) {
        // console.log(error)
        res.status(500).send(util.catch)
    }
}

const forgotPassword = async (req, res) => {
    try {
        let forgotschema = Joi.object().keys({
            user_type: Joi.string().required(),
            email: Joi.string().email().required()
        })
        //validate the email
        const error = forgotschema.validate(req.body).error
        if (error) {
            return res.status(400).send({
                error: error.details[0].message,
            })
        }
        else {
            // console.log(req.body.email, '------')
            //user exits in databases 

//doctor
            if(req.body.user_type === 'Doctor'){

                const Doctor =await db.Doctor.findOne({
                    where: { email: req.body.email },
                    raw: true
                })

                if(!Doctor){
                    return res.status(401).send({
                        error: true,
                        data: null,
                        message: util.userNotexit
                })
            }else{
                let mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "codiottest@gmail.com",//
                        pass: 'eufgexjkzczkmrya'
                    }
                });
                const user = await db.Doctor.findOne({
                    where: {
                        email: req.body.email
                    }
                })
                    let mailDetails = {
                        from: "codiottest@gmail.com",
                        to: req.body.email,
                        subject: "ForgotPassword",
                        text: `UserName : ${user.email}\nYour Role : ${user.user_type}\nPassword : ${user.password}`
                    };
         
                    mailTransporter.sendMail(mailDetails, function (err, data) {
                        if (err) {
                            // console.log(err)
                            console.log(util.mailError)
                            return res.status(400).send({
                                message: "email error"
                            })
    
                        } else {
                            // console.log(data)
                            console.log(util.mailsucce);
                            return res.status(200).send({
                                message: "password is send in your email"
                            })
                        }
                    })
            }
            }
//Patient            
            else if(req.body.user_type === 'Patient'){

                const Patient =await db.Patient.findOne({
                    where: { email: req.body.email },
                    raw: true
                })

                if(!Patient){
                    return res.status(401).send({
                        error: true,
                        data: null,
                        message: util.userNotexit
                })
            }else{
                let mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "codiottest@gmail.com",//
                        pass: 'eufgexjkzczkmrya'
                    }
                });
                const user = await db.Patient.findOne({
                    where: {
                        email: req.body.email
                    }
                })
                    let mailDetails = {
                        from: "codiottest@gmail.com",
                        to: req.body.email,
                        subject: "ForgotPassword",
                        text: `UserName : ${user.email}\nYour Role : ${user.user_type}\nPassword : ${user.password}`
                    };
         
                    mailTransporter.sendMail(mailDetails, function (err, data) {
                        if (err) {
                            // console.log(err)
                            console.log(util.mailError)
                            return res.status(400).send({
                                message: "email error"
                            })
    
                        } else {
                            // console.log(data)
                            console.log(util.mailsucce);
                            return res.status(200).send({
                                message: "password is send in your email"
                            })
                        }
                    })
            }
            }
//Staff              
            else if(req.body.user_type === 'Staff'){

                const Staff =await db.Staff.findOne({
                    where: { email: req.body.email },
                    raw: true
                })

                if(!Staff){
                    return res.status(401).send({
                        error: true,
                        data: null,
                        message: util.userNotexit
                })
            }else{
                let mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "codiottest@gmail.com",//
                        pass: 'eufgexjkzczkmrya'
                    }
                });
                const user = await db.Staff.findOne({
                    where: {
                        email: req.body.email
                    }
                })
                    let mailDetails = {
                        from: "codiottest@gmail.com",
                        to: req.body.email,
                        subject: "ForgotPassword",
                        text: `UserName : ${user.email}\nYour Role : ${user.user_type}\nPassword : ${user.password}`
                    };
         
                    mailTransporter.sendMail(mailDetails, function (err, data) {
                        if (err) {
                            // console.log(err)
                            console.log(util.mailError)
                            return res.status(400).send({
                                message: "email error"
                            })
    
                        } else {
                            // console.log(data)
                            console.log(util.mailsucce);
                            return res.status(200).send({
                                message: "password is send in your email"
                            })
                        }
                    })
            }
            } else{
                return res.status(404).send({
                    data :  null,
                    error : true
                })
            }            
            
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send(util.catch)
    }

}
module.exports = {
    signup,
    login,
    changePassword,
    forgotPassword
}





//sign-up section
// const signup = async (req, res) => {

//     try {
//         let userschema = Joi.object().keys({
//             full_name: Joi.string().min(3).required(),
//             gender: Joi.string().required(),
//             phone: Joi.number().integer().min(1000000000).max(9999999999).message('Invalid mobile number').required(),
//             email: Joi.string().email().required(),
//             password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
//             user_type: Joi.string().required(),
//             date_of_birth: Joi.date().required(),
//             address_line_1: Joi.string(),
//             address_line_2: Joi.string(),
//             landmark: Joi.string(),
//             city: Joi.string().required(),
//             state: Joi.string(),
//             pin: Joi.number().integer().min(111111).max(999999)
//         })
//         //validate req.body

//         const error = userschema.validate(req.body)
//         if (error.error) {
//             return res.status(400).send(
//                 {
//                     error: true,
//                     data: null,
//                     message: error.error.details[0].message
//                 }
//             );
//         }
//         else {
//             //bcrypt password hash
//             req.body.password = await bcrypt.hash(req.body.password, 10);
//             //crate user in db

//             const user = await User.create(req.body)
//             return res.status(201).send({
//                 error: false,
//                 data: user,
//                 message: util.create
//             })
//         }

//     }
//     catch (error) {
//            console.log(error)
//         res.status(500).send({
//             error: error,
//             message: util.catch
//         })
//     }
// }




//login section
// const login = async (req, res) => {
//     //    console.log(req.body)
//     try {
//         let loginschema = Joi.object().keys({
//             user_type: Joi.string().required(),
//             email: Joi.string().email().required(),
//             password: Joi.string().required()
//         })
//         const error = await loginschema.validate(req.body)
//         if (error.error) {
//             return res.status(400).send({
//                 error: error.error.details[0].message,
//             })
//         }
//         else {

//             const user = await User.findOne({
//                 where: { email: req.body.email },
//                 raw: true
//             })
//             // console.log(email);
//             if (user) {
//                 const cmp = await bcrypt.compare(req.body.password, user.password)
//                 console.log(cmp)
//                 if (cmp) {
//                     // generate token
//                     user.token = await GenerateToken(user)

//                     res.status(200).send({
//                         isSuccess: true,
//                         Message: util.login,
//                         Data: user,
//                     })
//                 }
//                 else {
//                     return res.status(400).send({
//                         isSuccess: false,
//                         message: util.wrongusername,
//                         data: null,
//                     })
//                 }
//             }
//             else {
//                 return res.status(400).send({
//                     error: true,
//                     data: null,
//                     message: util.wrongusername
//                 })
//             }

//         }
//     } catch (error) {
//         // console.log(error)
//         res.status(500).send(util.catch)
//     }
// }






// try {
//     let forgotschema = Joi.object().keys({
//         user_type: Joi.string().required(),
//         email: Joi.string().email().required()
//     })
//     //validate the email
//     const error = forgotschema.validate(req.body).error
//     if (error) {
//         return res.status(400).send({
//             error: error.details[0].message,
//         })
//     }
//     else {
//         // console.log(req.body.email, '------')
//         //user exits in databases 
//         const user = await User.findOne({
//             where: { email: req.body.email },
//             raw: true
//         })
//         // console.log(user)
//         if (!user) { // todo
//             return res.status(401).send({
//                 error: true,
//                 data: null,
//                 message: util.userNotexit
//             })
  
//         } else {

//             let mailTransporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                     user: "codiottest@gmail.com",//
//                     pass: 'eufgexjkzczkmrya'
//                 }
//             });
//             const user = await User.findOne({
//                 where: {
//                     email: req.body.email
//                 }
//             })
//             let mailDetails = {
//                 from: "codiottest@gmail.com",
//                 to: req.body.email,
//                 subject: "ForgotPassword",
//                 text: `UserName : ${user.email}\nYour Role : ${user.user_type}\nPassword : ${user.password}`
//             };
//             console.log(mailDetails.text, mailDetails.subject)
//             mailTransporter.sendMail(mailDetails, function (err, data) {
//                 if (err) {
//                     // console.log(err)
//                     console.log(util.mailError)
//                     return res.status(400).send({
//                         message: "email error"
//                     })

//                 } else {
//                     // console.log(data)
//                     console.log(util.mailsucce);
//                     return res.status(200).send({
//                         message: "password is send in your email"
//                     })
//                 }
//             });
//         }
//     }
// }
// catch (error) {
//     console.log(error)
//     res.status(500).send(util.catch)
// }