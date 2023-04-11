const connection = require('../../config/db/db.config');
const auth = require('../../middlewares/auth');
const userHasAccess = require('../../middlewares/user-has-access');

module.exports = app => {
    app.put('/make-project-completed', auth, (req, res, next) => userHasAccess(req, res, 'projects', next), (req, res) => {
        const project = req.body;
        const user_id = req.user;
        connection.query('UPDATE projects SET completed = 1 WHERE id = ?', project.id, (makeProjectCompletedError, makeProjectCompletedRes) => {
            if(makeProjectCompletedError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}});
            } else {
                project.completed = 1;
                res.status(200).json({project});
            }
        });
    });
}