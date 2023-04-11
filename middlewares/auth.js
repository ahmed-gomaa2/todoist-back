const connection = require('../config/db/db.config');
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    console.log(token);
    if(!token) {
        //If there's no token unauthorized request
        res.status(401).json({error: {type: 'jwt', msg: 'PLEASE LOGIN AND TRY AGAIN!'}})
    }else {
        //Check if the token is included in the expired token table.
        connection.query('SELECT * FROM expired_tokens WHERE token = ?', token, (findTokenError, findTokenRes) => {
            if(findTokenError) {
                //If there's DB error throw a server error.
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}});
            } else if(findTokenRes.length > 0) {
                //If the token is included in the expired token table throw unauthorized request.
                res.status(401).json({error: {type: 'jwt', msg: 'THIS TOKEN IS EXPIRED PLEASE LOGIN AND TRY AGAIN!'}})
            }else {
                //if the token is not included in the expired token table verify that the token is not out of the date.
                try {
                    jwt.verify(
                        token,
                        jwtSecretKey,
                        (err, decoded) => {
                            if(err) {
                                console.log(err);
                            }
                            req.user = decoded.user.id;
                            next();
                        }
                    )
                }catch (err) {
                    //If the token is out of date throw an unauthorized error.
                    res.status(401).json({error: {type: 'jwt', msg: 'THIS TOKEN IS EXPIRED!'}})
                }
            }
        });
    }
}