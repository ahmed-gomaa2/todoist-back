const connection = require('../../config/db/db.config');
const auth = require('../../middlewares/auth');
const userHasAccess = require('../../middlewares/user-has-access');

module.exports = app => {
    app.delete('/delete-task/:task_id', auth, (req, res, next) => {
        const user_id = req.user;
        const {task_id} = req.params;

        connection.query('SELECT * FROM todos WHERE user_id = ? AND id = ?', [user_id, task_id], (findUserTaskError, findUserTaskRes) => {
            if(findUserTaskError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            }else if(findUserTaskRes.length === 0) {
                res.status(400).json({error: {type: 'user', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!'}})
            }else {
                req.task = {...findUserTaskRes[0]}
                next();
            }
        });
    }, (req, res) => {
        const user_id = req.user;
        const {task_id} = req.params;
        const task = req.task;

        if(task.project) {
            connection.query('DELETE projects_todos, todos FROM projects_todos INNER JOIN todos ON projects_todos.todo_id = todos.id WHERE todo_id = ?', task.id, (deleteTaskError, deleteTaskRes) => {
                if(deleteTaskError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
                } else {
                    const taskId = task.id;
                    res.status(200).send(String(taskId));
                }
            });
        }else {
            connection.query('DELETE FROM todos WHERE id = ?', task_id, (deleteTaskError, deleteTaskRes) => {
                if(deleteTaskError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
                } else {
                    res.status(200).send(task_id);
                }
            });
        }
    });
}