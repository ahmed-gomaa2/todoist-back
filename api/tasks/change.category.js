const connection = require('../../config/db/db.config');
const auth = require('../../middlewares/auth');

module.exports = app => {
    app.put('/change-category', auth, (req, res, next) => {
        const user_id = req.user;
        const {task} = req.body;


        connection.query('SELECT * FROM todos WHERE user_id = ? AND id = ?', [user_id, task.id], (findTaskError, findTaskRes) => {
            if(findTaskError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            }else if(findTaskRes.length === 0) {
                res.status(400).json({error: {type: 'user', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!'}})
            }else {
                next();
            }
        })
    }, (req, res) => {
        const user_id = req.user;
        const {task} = req.body;
        const {newCategory} = req.body;

        connection.query('UPDATE todos SET category = ? WHERE user_id = ? AND id = ?', [newCategory, user_id, task.id], (changeCategoryError, changeCategoryRes) => {
            if(changeCategoryError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            }else {
                task.category = newCategory;
                res.send(task);
            }
        })
    });
}