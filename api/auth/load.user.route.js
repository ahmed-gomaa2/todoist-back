const connection = require('../../config/db/db.config');
const jwt = require('jsonwebtoken');
const auth = require('../../middlewares/auth');
const jwtSecretKey = process.env.JWT_SECRET;

module.exports = app => {
    app.get('/get-user', auth, (req, res) => {
        const user_id = req.user;
        connection.query('SELECT * FROM users WHERE id = ?', user_id, (findUserError, findUserRes) => {
            if(findUserError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            } else if(findUserRes.length === 0) {
                res.status(400).json({error: {type: 'user', msg: 'THIS USER DOESN\'T EVEN EXIST!'}})
            }else {
                const user = {
                    username: findUserRes[0].username,
                    email: findUserRes[0].email
                }
                res.send(user);
            }
        });
    });
}