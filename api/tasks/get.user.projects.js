const connection = require('../../config/db/db.config');
const auth = require('../../middlewares/auth');
const userHasAccess = require('../../middlewares/user-has-access');

module.exports = app => {
    app.get('/projects', auth, (req, res) => {
        const user_id = req.user;
        connection.query('SELECT * FROM projects WHERE user_id = ? ORDER BY create_at DESC', user_id, (findProjectsError, findProjectsRes) => {
            if(findProjectsError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}});
            } else if(findProjectsRes.length === 0) {
                res.send([]);
            }else {
                res.send(findProjectsRes);
            }
        });
    });
}