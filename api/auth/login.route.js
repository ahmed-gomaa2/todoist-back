const connection = require('../../config/db/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET;

module.exports = app => {
    app.post('/login', (req, res) => {
        const {email, password} = req.body;
        connection.query('SELECT * FROM users WHERE email = ?', email, async (findUserError, findUserRes) => {
            if(findUserError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER', err: findUserError}});
            } else if (findUserRes.length === 0) {
                res.status(401).json({error: {type: 'email', msg: 'THIS EMAIL DOESN\'T EXIST!'}})
            }else {
                const isPasswordMatch = await bcrypt.compare(password, findUserRes[0].password);
                if(!isPasswordMatch) {
                    res.status(400).json({error: {type: 'password', msg: 'WRONG PASSWORD!'}});
                }else {
                    const payload = {
                        user: {
                            id: findUserRes[0].id
                        }
                    }

                    jwt.sign(
                        payload,
                        jwtSecretKey,
                        {
                            expiresIn: 350000
                        },
                        (jwtError, token) => {
                            if(jwtError) {
                                res.status(500).json({error: jwtError.message})
                            }else {
                                res.json({token})
                            }
                        }
                    )
                }
            }
        });
    });
}
