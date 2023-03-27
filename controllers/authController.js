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

//sign-up section
const signup = async (req, res) => {

    try {
        let userschema = Joi.object().keys({
            full_name: Joi.string().alphanum().min(3).max(30).required(),
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
        // console.log(error);
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
            const user = await User.create(req.body)
            return res.status(201).send({
                error: false,
                data: user,
                message: util.create
            })
        }

    }
    catch (error) {
        // console.log(error)
        res.status(500).send({
            error: error.errors[0].message,
            message: util.catch
        })
    }
}

//login section
const login = async (req, res) => {
    try {
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
            const user = await User.findOne({
                where: { email: req.body.email },
                raw: true
            })
            // console.log(email);
            if (user) {
                const cmp = await bcrypt.compare(req.body.password, user.password)
                // console.log(cmp)
                if (cmp) {
                    // generate token
                    user.token = await GenerateToken(user)

                    res.status(201).send({
                        error: false,
                        data: user,
                        message: util.login,
                    })
                }
                else {
                    return res.status(400).send({
                        error: true,
                        data: null,
                        message: util.wrongusername
                    })
                }
            }
            else {
                return res.status(400).send({
                    error: true,
                    data: null,
                    message: util.wrongusername
                })
            }

        }
    } catch (error) {
        // console.log(error)
        res.status(500).send(util.catch)
    }
}

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
            // console.log('this')
            if (req.body.new_password !== req.body.comfirm_password) {
                return res.status(400).send({
                    error: util.oldnewpwd
                })
            }
            else {
                // console.log('this2')
                const user = await User.findOne({
                    where: { email: req.user.email },
                    raw: true
                })
                // console.log(user)
                // console.log('this3')
                if (user) {
                    const cmp = await bcrypt.compare(req.body.old_password, user.password)
                    if (cmp) {
                        let hashPassword = await bcrypt.hash(req.body.new_password, 10);
                        await User.update(
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
            // console.log(req.body.email, '-=-----')
            //user exits in databases 
            const user = await User.findOne({
                where: { email: req.body.email },
                raw: true
            })
            // console.log(user)
            if (!user) { // todo
                return res.status(401).send({
                    error: true,
                    data: null,
                    message: util.userNotexit
                })
            } else {

                let mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "codiottest@gmail.com",//
                        pass: 'eufgexjkzczkmrya'
                    }
                });
              const user = await User.findOne({
                where:{
                    email:req.body.email
                }
              })
                let mailDetails = {
                    from: "codiottest@gmail.com",
                    to: req.body.email,
                    subject: util.subject_inemail,
                    text:`your password is ${user.password}`
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
                });
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