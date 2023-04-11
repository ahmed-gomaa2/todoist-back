const connection = require('../../config/db/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET;

module.exports = app => {
    app.post('/register', async (req, res) => {
        const {username, email, password} = req.body;
        try {
            connection.query('SELECT * FROM users WHERE email = ?', email,  async(findUserError, findUserRes) => {
                if(findUserError) {
                    console.log(findUserError);
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}});
                } else if(findUserRes.length > 0) {
                    res.status(400).json({error: {type: 'email', msg: 'THIS USER ALREADY EXISTS!'}});
                }else {
                    const salt = await bcrypt.genSalt(10);
                    console.log(salt);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (insertUserError, insertUserRes) => {
                        if(insertUserError) {
                            res.status(401).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}});
                        } else {
                            const user = {
                                id: insertUserRes.insertId,
                                username
                            }

                            const payload = {
                                user: {
                                    id: insertUserRes.insertId
                                }
                            }

                            jwt.sign(
                                payload,
                                jwtSecretKey,
                                {
                                    expiresIn: 350000
                                },
                                (err, token) => {
                                    if(err) {
                                        res.status(500).json({error: {type: 'jwt', msg: 'SOMETHING WENT WRONG WITH JWT!'}})
                                    }else {
                                        res.json({token, user});
                                    }
                                }
                            )
                        }
                    });
                }
            });
        }catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
        }
    });
}