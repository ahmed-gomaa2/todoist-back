const connection = require('../../config/db/db.config');
const auth = require('../../middlewares/auth');
const userHasAccess = require('../../middlewares/user-has-access');

module.exports = app => {
    app.get('/all-tasks', auth, (req, res) => {
        const user_id = req.user;
        connection.query('SELECT * FROM todos WHERE user_id = ? AND project = ? ORDER BY create_at DESC', [user_id, 0], (getAllTasksError, getAllTasksRes) => {
            if(getAllTasksError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            } else if(getAllTasksRes.length === 0) {
                res.send([]);
            }else {
                res.send(getAllTasksRes);
            }
        });
    });
}