const connection = require('../../config/db/db.config');
const auth = require('../../middlewares/auth');
const userHasAccess = require('../../middlewares/user-has-access');

module.exports = app => {
    app.get('/projects/:id', auth, (req, res, next) => {
        connection.query('SELECT * FROM projects WHERE user_id = ? AND id = ?', [req.user, req.params.id], (findProjectError, findProjectRes) => {
            if(findProjectError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}})
            } else if(findProjectRes.length === 0) {
                res.status(401).json({error: 'user', msg: 'YOU DON\'T HAVE ACCESS TO THIS PROJECT!'})
            }else {
                next();
            }
        });
    }, (req, res) => {
         const user_id = req.user;
         const project_id = req.params.id;

         connection.query('SELECT * FROM projects_todos WHERE project_id = ? ORDER BY id DESC', project_id, (getProjectsTasksError, getProjectsTasksRes) => {
             if(getProjectsTasksError) {
                 res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}});
             }else if(getProjectsTasksRes.length === 0) {
                 res.send([]);
             }else {
                 let tasks = [];
                 getProjectsTasksRes.map((t, i) => {
                     connection.query('SELECT * FROM todos WHERE id = ?', t.todo_id, (findTaskError, findTaskRes) => {
                         if(findTaskError) {
                             res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}});
                         }else {
                             const todo = {
                                 ...findTaskRes[0],
                                 project_id: t.project_id,
                                 user_id
                             }

                             tasks.push(todo);

                             if(i === getProjectsTasksRes.length - 1) {
                                 res.send(tasks);
                             }
                         }
                     });
                 });
             }
         });
    });
}