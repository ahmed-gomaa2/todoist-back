const connection = require('../../config/db/db.config');

module.exports = app => {
    app.get('/logout', (req, res) => {
        const token = req.header('x-auth-token');
        console.log(token);
        if(!token) {
            return res.status(400).json({error: {type: 'jwt', msg: 'YOUR NOT LOGGED IN!'}});
        }else {
            connection.query('SELECT * FROM expired_tokens WHERE token = ?', token, (findTokenError, findTokenRes) => {
                if(findTokenError) {
                    res.status('500').json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}});
                } else if(findTokenRes.length > 0) {
                    res.status(401).json({error: {type: 'jwt', msg: 'THIS TOKEN IS ALREADY EXPIRED!'}});
                }else {
                    connection.query('INSERT INTO expired_tokens (token) VALUES (?)', token, (insertTokenError, insertTokenRes) => {
                        if(insertTokenError) {
                            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
                        } else {
                            res.status(200).json({msg: 'USER LOGGED OUT SUCCESSFULLY!'});
                        }
                    });
                }
            });
        }
    });
}