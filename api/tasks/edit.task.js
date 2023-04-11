const connection = require('../../config/db/db.config');
const auth = require('../../middlewares/auth');

module.exports = app => {
    app.put('/edit-task', auth, (req, res, next) => {
        const task = req.body;
        const user_is = req.user;

        connection.query('SELECT * FROM todos WHERE id = ? AND user_id = ?', [task.id, user_is], (findTaskError, findTaskRes) => {
            if(findTaskError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            } else if(findTaskRes.length === 0) {
                res.status(400).json({error: 'user', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!'})
            }else {
                next();
            }
        });
    }, (req, res) => {
        const user_id = req.user;
        const task = req.body;

        connection.query('UPDATE todos SET title = ?, text = ? WHERE id = ?', [task.title, task.text, task.id], (editTaskError, editTaskRes) => {
            if(editTaskError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            }else {
                res.send(task);
            }
        });
    });
}