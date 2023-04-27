const db = require("../models");
const { Op } = require("sequelize")
const Joi = require('joi')
const { appointment, feedback } = require("../models");
const userType = require("../utils/userType");
const _const = require("../utils/const");
const appointmessage = require('../utils/appointmessage');

const Appointment = db.appointment
const Feedback = db.feedback
const Bill = db.bill

const dashboard = async (req, res) => {

}

const bookAppointment = async (req, res) => {
    try {
        let appointmentSchema = Joi.object().keys({
            patientID: Joi.number().required(),
            time: Joi.string().required(),
            date: Joi.date().required(),
            doctorID: Joi.number().required(),
            disease: Joi.string().required()
        })
        //appointment validation
        const error = appointmentSchema.validate(req.body).error
        if (error) {
            return res.status(400).send(
                {
                    error: true,
                    data: null,
                    message: error.details[0].message
                }
            );
        } else {
            console.log('in else')
            //date time doctor
            const appointment =await Appointment.findOne({
                where: {
                    [Op.and]: [
                        { doctorID: req.body.doctorID },
                        { time: req.body.time },
                        { date: req.body.date }
                    ]
                }
            })
            console.log(appointment)
            if (appointment) {
                return res.status(401).send({
                    error: true,
                    data: null,
                    message: appointmessage.allreadyappoint
                })
            } else {

                const appointment = await Appointment.create(req.body)
                return res.status(201).send({
                    error: false,
                    data: appointment,
                    message: appointmessage.appointmessage
                })

            }
        }
      
    }
    catch (error) {
        console.log(error)
        res.status(500).send(_const.catch)
    }
}
const updateAppointment = async (req, res) => {
    try {
        // check if appoin id exist or not
        let id = req.params.appId
        console.log(!id)

        if (!id) {
            console.log("this")
            console.log(appointment.patientId)
            return res.status(404).send({
                error: true,
                data: null,
                message:
                    appointmessage.idnotexits
            })
        }
        else {
            let appointmentSchema = Joi.object().keys({
                patientID: Joi.number.required(),
                time: Joi.string().required(),
                date: Joi.date().required(),
                doctorID: Joi.number().required(),
                disease: Joi.string().required(),
                is_active: Joi.boolean().required(),
                is_deleted: Joi.boolean().required()
            })
            
            //validate schema and also 
            const error = appointmentSchema.validate(req.body).error
            if (error) {
                return res.status(400).send(
                    {
                        error: true,
                        data: null,
                        message: error.details[0].message
                    }
                );
            } else {
                console.log('thi2s', req.body)
                const appoint = await Appointment.findOne({
                    where: { patientID: req.body.patientID },
                    raw: true
                })
                console.log('this2')
                if (appoint) {
                    //find appointment
                    const appointment = await Appointment.findOne({
                        where: {
                            time: req.body.time
                        }
                    })

                    //to do add condition to check if time slot available or not
                    if (appointment) {
                        const appointment = await Appointment.update(req.body,
                            {
                                where: { patientID: req.body.patientID },
                                raw: true
                            })

                        res.status(200).send({
                            error: false,
                            data: appointment,
                            message: appointmessage.uapdateAppointment
                        })

                    } else {
                        res.status(404).send({
                            error: true,
                            data: "invalid body",
                            message: appointmessage.allreadyappoint,
                        })
                    }
                } else {
                    return res.status(404).send({
                        error: true,
                        data: null,
                        message: "appointment is not exist in databases"
                    })
                }
            }
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send(_const.catch)
    }
}

//appointment List in this api kinjal ma'am changes
const appointmentHistroy = async (req, res) => {
    try {
        const appointment = await Appointment.findAll()
        if (!appointment) {
            return res.status(404).send({
                error: true,
                data: null
            })
        } else {
            return res.status(200).send({
                error: false,
                data: appointment
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send(_const.catch)
    }
}
//'/patient/checkup-feedback/:appId',
const viewFeedback = async (req, res) => {
    try {
        let id = req.params.appId
        if (!id) {
            res.status(401).send({
                error: true,
                data: null,
                message: "Id is not exists"
            })
        } else {
            const feedback = await Feedback.findOne({
                where: { //include
                    feedbackID: req.params.appId
                },
                raw: true
            })
            return res.status(200).send({
                error: false,//docotor join
                data: feedback,
                message: "doctors feedback"
            })
        }
    } catch (error) {
        console.log(error)

        res.status(500).send(_const.catch)
    }
}
const viewBill = async (req, res) => {
    try {
        let billId = req.params.billId
        if (billId) {
            let appointhischema = Joi.object().keys({
                billId: Joi.number().required()
            })
            const error = appointhischema.validate(req.params).error
            if (error) {
                return res.send(400).send({
                    error: true,
                    data: null,
                    message: error.details[0].message
                })
            } else {
                const bill = await Bill.findOne({
                    where: {
                        patientId: req.body.patientId
                    },
                    raw: true
                })
                res.status(200).send({
                    error: false,
                    data: bill,
                    message: "patient's bill"
                })
            }
        } else {
            return res.send(400).send({
                error: true,
                message: " this bill id missing"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'internal error'
        })
    }
}



module.exports = {
    dashboard,
    bookAppointment,
    updateAppointment,
    viewFeedback,
    appointmentHistroy,
    viewBill
}





  // {
        //     console.log('this1')
        //     //already in database
        //     const appointment = await Appointment.findOne({
        //         where: { patientID: req.body.patientID },
        //         raw: true
        //     })

        //     if (appointment) {
        //         return res.status(401).send({
        //             error: true,
        //             data: null,
        //             message: appointmessage.allreadyappoint
        //         })

        //     } else {
        //         // find time
        //         const appointment = await Appointment.findOne({
        //             where:{
        //                 time: req.body.time
        //             }
        //         })
        //         if (appointment) {
        //             return res.status(401).send({
        //                 error: true,
        //                 message: "appointment time is same"
        //             })
        //         } else {
        //             const appointment = await Appointment.create(req.body)
        //             return res.status(201).send({
        //                 error: false,
        //                 data: appointment,
        //                 message: appointmessage.appointmessage
        //             })
        //         }
        //     }
        // }