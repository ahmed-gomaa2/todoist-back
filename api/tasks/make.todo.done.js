const connection = require('../../config/db/db.config');
const auth = require('../../middlewares/auth');
const userHasAccess = require('../../middlewares/user-has-access');

module.exports = app => {
    app.put('/make-todo-done', auth, (req, res, next) => userHasAccess(req, res, 'todos', next), (req, res) => {
        const todo = req.body;
        connection.query('UPDATE todos SET done = 1 WHERE id = ?', todo.id, (updateTodoError, updateTodoRes) => {
            if(updateTodoError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            } else {
                todo.done = 1;
                res.status(200).json({todo});
            }
        });
    });
}