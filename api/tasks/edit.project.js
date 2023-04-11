const connection = require('../../config/db/db.config');
const auth = require('../../middlewares/auth');

module.exports = app => {
    app.put('/edit-project', auth, (req, res, next) => {
        const project = req.body;
        const user_id = req.user;

        connection.query('SELECT * FROM projects WHERE id = ? AND user_id = ?', [project.id, user_id], (findProjectError, findProjectRes) => {
            if(findProjectError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            } else if(findProjectRes.length === 0) {
                res.status(400).json({error: {type: 'user', msg: 'YOU DON\'T HAVE ACCESS TO THIS PROJECT!'}})
            }else {
                next();
            }
        });
    }, (req, res) => {
        const user_id = req.user;
        const project = req.body;

        connection.query('UPDATE projects SET name = ? WHERE id = ?', [project.name, project.id], (editProjectError, editProjectRes) => {
            if(editProjectError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER'}})
            } else {
                res.send(project);
            }
        });
    });
}