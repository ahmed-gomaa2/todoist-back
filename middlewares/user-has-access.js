const connection = require('../config/db/db.config');

module.exports = (req, res, table, next) => {
    const user_id = req.user;
    const object = req.body;

    if(req.user) {
        connection.query(`SELECT * FROM ${table} WHERE user_id = ? AND id = ?`, [user_id, object.id], (findTodoError, findTodoRes) => {
            if(findTodoError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}});
            } else if(findTodoRes.length === 0) {
                res.status(401).json({error: {type: 'todo', msg: 'YOU DON\'T HAVE ACCESS TO THIS'}})
            }else {
                next();
            }
        });
    }
}