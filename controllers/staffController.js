const db = require("../models");
const Joi = require("joi")

const user = db.user
const Appointment = db.appointment
const Bill = db.bill



const bookAppointment = async (req, res) => {
    try {
        let appointmentSchema = Joi.object().keys({
            patientID: Joi.number(),
            time: Joi.string().required(),
            date: Joi.date().required(),
            doctorID: Joi.number().required(),
            create_by: Joi.string().required(),
            disease: Joi.string().required(),
            is_active: Joi.boolean().required(),
            is_deleted: Joi.boolean().required()
        })
        console.log('this')
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
            //finde appointment
            const appointment = await Appointment.findOne({
                where: { patientID: req.body.patientID },
                raw: true
            })
            console.log("---------------------------------------------")
            //to do add condition to check if time slot available or not
            console.log(appointment)
            console.log('app')
            if (appointment) {
                console.log('if')
                return res.status(401).send({
                    error: true,
                    data: null,
                    message: "appointment already exist in database"
                })

            } else {
                const appointment = await Appointment.findOne({
                    where: {
                        time: req.body.time
                    },
                    raw: true
                })
                if (appointment) {
                    return res.status(401).send({
                        error: true,
                        message: "appointment time is same"
                    })
                } else {
                    const appointment = await Appointment.create(req.body)
                    return res.status(201).send({
                        error: false,
                        data: appointment,
                        message: "appointment created successfully "
                    })
                }

            }
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            message: "internal error"
        })
    }
}


const updateAppointment = async (req, res) => {
    try {
        // check if appoin id exist or not
        let id = req.params.appId
        console.log(!id)

        if (!id) {
            console.log("this")
            return res.status(404).send({
                error: true,
                data: null,
                message: "id is not exits"
            })
        }
        else {
            let appointmentSchema = Joi.object().keys({
                patientID: Joi.number().required(),
                time: Joi.string().required(),
                date: Joi.date().required(),
                doctorID: Joi.number().required(),
                create_by: Joi.string().required(),
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
                const appointment = await Appointment.findOne({
                    where: { patientID: req.body.patientID },
                    raw: true
                })
                console.log('this2')
                if (appointment) {
                    //find appointment
                    const appointment = await Appointment.findOne({
                        where: {
                            time: req.body.time
                        },
                        raw: true
                    })
                    //to do add condition to check if time slot available or not
                    if (appointment) {
                        const appointment = await Appointment.update(req.body,
                           {
                            where: {
                                patientID: req.body.patientID
                            }
                           }
                            )

                        res.status(200).send({
                            error: false,
                            data: appointment,
                            message: "appointment is updated"
                        })

                    } else {
                        res.status(404).send({
                            error: true,
                            data: "invalid body",
                            message: "appointment is already exists",
                        })
                    }
                } else {
                    return res.status(404).send({
                        message: "this appointment is not in database"
                    })
                }
            }
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            error: "internal server error"
        })
    }
}

const viewappointment = async (req, res) => {
    try {
        let appointhischema = Joi.object().keys({
            patientId: Joi.number().required()
        })
        const error = appointhischema.validate(req.body).error
        if (error) {
            return res.status(400).send(
                {
                    error: true,
                    data: null,
                    message: error.details[0].message
                })
        }
        else {
            console.log('hello')
            const appoint = await Appointment.findAll({
                where: { patientId: req.body.patientId },
                raw: true
            })
            if (appoint) {
                return res.status(200).send({
                    error: false,
                    data: appoint[0],
                    message: "this is ",
                })
            } else {
                return res.status(404).send({
                    error: true,
                    data: null,
                    message: "this2"
                })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).send('this is error')
    }
}

const patientAppointment = async (req, res) => {
    try {
        let id = req.params.appId
        if (id) {
            const appointment = await Appointment.findAll({
                where: {
                    patientId: id
                },
                raw: true
            })
            if (appointment) {
                return res.status(200).send({
                    error: false,
                    data: appointment,
                    message: "all patient's appointment"
                })
            } else {
                return res.status(404).send({
                    message: "no appontment in this id"
                })
            }
        } else {
            return res.status(404).send({
                error: true,
                message: "id is not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'error' })
    }
}
const createbill = async (req, res) => {
    try {
        let billSchema = Joi.object().keys({
            patientID: Joi.number().required(),
            appointmentID: Joi.number().required(),
            Medicine: Joi.string().required(),
            date: Joi.date().required(),
            discription: Joi.string().required(),
            unitPrice: Joi.number().required(),
            Numberofunit: Joi.number(),
            Amount: Joi.number().required(),
            TotalAmount: Joi.number().required(),
            Payment_type: Joi.string().required(),
            payment_status: Joi.string().required()
        })
        const error = billSchema.validate(req.body).error
        if(error){
            return res.status(400).send({
                iscreated: false,
                data: null
            })
        }else{
            const bill = await Bill.create(req.body)
            console.log(bill)
            return res.status(201).send({
                message: "bill created successfully ",
                error: false,
                data: bill
            })
        }
   
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
const BillHistroy = async (req, res) => {
    try {
        const bill = await Bill.findAll()
        if(!bill){
            return res.status(400).send({
                error: true,
                data: null,
            })
        }else{
            return res.status(200).send({
                error: false,
                data: bill,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('this is error')
    }
}

const BillDetail = async (req, res) => {
    //view bill same
    try {
        let billId = req.params.billId
        if (!billId) {
            return res.status(400).send({
                error: true,
                message: "this bill id missing"
            })
        } else {
            let appointhischema = Joi.object().keys({
                patientID: Joi.number().required()
            })
            const error = appointhischema.validate(req.body).error
            if (error) {
                return res.status(400).send({
                    error: true,
                    data: null,
                    message: error.details[0].message
                })
            } else {
                const bill = await Bill.findOne({
                    where: {
                     BillID: req.params.billID
                    },
                    raw: true
                })
                res.status(200).send({
                    error: false,
                    data: bill,
                    message: "patient's bill"
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'internal error'
        })
    }
}
const BillStatus = async (req, res) => {
    try {
        let billId = req.params.billId
        if (!billId) {
            return res.status(400).send({
                error: true,
                message: " this bill id missing"
            })
        } else {
            let billSchema = Joi.object().keys({
                patientID: Joi.number().required(),
            })
            const error = billSchema.validate(req.body).error
            if (error) {
                return res.status(400).send({
                    error: true,
                    data: null,
                    message: error.details[0].message
                })
            } else {
                let bill = await Bill.findOne({
                    where: {
                        patientID: req.body.patientID
                    }
                })
                return res.status(200).send({
                    error: false,
                    data:{
                        payment_status:bill.payment_status,
                        Payment_type: bill.Payment_type
                    },
                    message: "patient's bill status"
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'internal error'
        })
    }
}

module.exports = {
    bookAppointment,
    updateAppointment,
    viewappointment,
    patientAppointment,
    createbill,
    BillHistroy,
    BillDetail,
    BillStatus
}