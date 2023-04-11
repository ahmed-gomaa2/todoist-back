const connection = require('../../config/db/db.config');
const auth = require('../../middlewares/auth');

module.exports = app => {
    app.delete('/delete-project/:project_id', auth, (req, res, next) => {
        const project_id = req.params.project_id;
        const user_id = req.user;

        connection.query('SELECT * FROM projects WHERE user_id = ? AND id = ?', [user_id, project_id], (findProjectError, findProjectRes) => {
            if(findProjectError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            } else if(findProjectRes.length === 0) {
                res.status(400).json({error: {type: 'user', msg: 'YOU DON\'T HAVE ACCESS TO THIS PROJECT!'}})
            }else {
                next();
            }
        });
    },(req, res, next) => {
        const project_id = req.params.project_id;
        const user_id = req.user;
        connection.query('SELECT * FROM projects_todos WHERE project_id = ?', project_id, (findTasksError, findTasksRes) => {
            if(findTasksError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            } else if(findTasksRes.length ===0) {
                next();
            }else {
                connection.query(
                    'DELETE projects_todos, todos, projects FROM projects_todos INNER JOIN todos ON projects_todos.todo_id = todos.id INNER JOIN projects ON projects_todos.project_id = projects.id WHERE project_id = ?',
                    [+project_id],
                    (deleteProjectError, deleteProjectRes) => {
                        if (deleteProjectError) {
                            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
                        } else {
                            res.send(project_id);
                        }
                    }
                );
            }
        });
    }, (req, res) => {
        const project_id = req.params.project_id;
        const user_id = req.user;
        connection.query('DELETE FROM projects WHERE id = ?', project_id, (deleteProjectError, deleteProjectREs) => {
            if(deleteProjectError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            }else {
                res.send(project_id);
            }
        })

    });
}