const jwt = require("jsonwebtoken");
const user = require("../model/userModel.js");
const jwt_secret = "abc123";

const protect = async (req, res,next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) //token is in headers and starts with Bearer token
    {
        try {
            token = req.headers.authorization.split(" ")[1]; //extracting token

            //verify token
            const decoded = jwt.verify(token, "abc123");
            const userID = decoded.id; //extracting user id from decoded token
            req.user = await user.findById(userID).select('-password');
            next();
        }catch (error) {
            console.log(error);
            res.status(401).json("not authorized");
        }
    }
    if (!token) {
        res.status(401).json("not authorized, not token")
    }
}

module.exports={protect};