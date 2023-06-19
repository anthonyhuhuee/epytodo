import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.SECRET_TOKEN;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ "msg": "No token, authorization denied" });
    }

    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ "msg": "Internal server error" });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ "msg": "Token is not valid" });
        }
        req.user = user.userId;
        next();
    })
};

export default authenticateToken;