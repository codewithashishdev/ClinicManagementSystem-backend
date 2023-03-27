const db = require("../models");
const Joi = require("joi");
const { feedback } = require("../models");

const user = db.user
const Feedback = db.feedback
const Appointment = db.appointment

const addFeedback = async (req, res) => {
    try {
        let feedbackschema = Joi.object().keys({
            feedbackID: Joi.number().required(),
            appointmentID: Joi.number().required(),
            patientID: Joi.number().required(),
            medicine: Joi.string().required(),
            date: Joi.date().required(),// appointmentID
            diecription: Joi.string().required(),
            doctorID: Joi.number().required()
        })
        const error = feedbackschema.validate(req.body)
        if (error.error) {
            return res.status(400).send({
                error: true,
                message: error.error.details[0].message
            })

        } else {
            console.log("else")
            const feedback = await Feedback.create(req.body)
            //to do set is visited false on appointment
            return res.status(201).send({
                error: false,
                data: feedback,
                message: "created"
            })
        }
    }

    catch (error) {
        console.log(error)
        res.status(500).send({
            error: true,
            message: "internal error"
        })
    }
}
const updateFeedback = async (req, res) => {
    try {
        let ID = req.params.feedBackID
        console.log('try')
        if (ID) {
            let feedbackschema = Joi.object().keys({
                feedbackID: Joi.number().required(),
                appointmentID: Joi.number().required(),
                patientID: Joi.number().required(),
                medicine: Joi.string().required(),
                date: Joi.date().required(),// appointmentID
                discription: Joi.string().required(),
                doctorID: Joi.number().required()
            })
            const error = feedbackschema.validate(req.body).error
            if (error) {
                return res.status(400).send({
                    error: true,
                    message: error.details[0].message
                })

            } else {
                console.log('this is working')
                const feedback = await Feedback.update(req.body, {
                    where: {
                        feedBackID: ID
                    },
                    raw: true
                })
                return res.status(200).send({
                    error: false,
                    data: feedback,
                    message: "this is update"
                })
            }
        } else {
            return res.status(400).send({
                error: true,
                message: "id require"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("this is not good")
    }

}


const appointmentList = async (req, res) => {
    try {
        let appointhischema = Joi.object().keys({
            patientID: Joi.number().required(),//doctorId
            doctorID: Joi.number().required(),
            is_visited: Joi.boolean().required()
            //is visited
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
                where: { patientID: req.body.patientID },
                raw: true
            })
            console.log(appoint)
            if (appoint) {
                return res.status(200).send({
                    error: false,
                    data: appoint,
                    message: "already",
                })
            } else {
                return res.status(404).send({
                    error: true,
                    data: null,
                    message: "not exists"
                })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("this")
    }
}


module.exports = {
    addFeedback,
    updateFeedback,
    appointmentList
}