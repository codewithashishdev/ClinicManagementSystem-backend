const jwt = require("jsonwebtoken");
const SECRET_KEY = require('../utils/secureKeys')
const Authentication = async (req, res, next) => {
    console.log(req.headers.authorization)
    // console.log(Header)
    let token = req.headers.authorization
    console.log("fffffffffffffffffffffffffffffffffff", token)
    if (token) {
        jwt.verify(token, SECRET_KEY.SECRET_KEY,
            (err,decoded) => {
                if (decoded) {
                    console.log("++++++++++++++++++++++++++++++",decoded)
                    req.user = decoded;
                }
                if (err) {
                    console.log(err)
                    return res.status(401).send({msg:"this authentication"})
                }
            })
        next()
    }
    else {
        //todo set response
        res.status(401)
    }
}
const GenerateToken = async (userdata) => {
    // Create token
    const token = jwt.sign(
        {
            id: userdata.id,
            email: userdata.email
        },
        SECRET_KEY.SECRET_KEY,
        { expiresIn: "2d" }
    );
    return token
}

// const generate = async() =>{
    
// const config = process.env;

// const verifyToken = (req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, config.TOKEN_KEY);
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };

// module.exports = verifyToken;
// }


module.exports = {
    Authentication,
    GenerateToken
}