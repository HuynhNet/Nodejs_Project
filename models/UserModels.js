var DB = require('./connectDB');

var User = {
    addUser: (user,callback) => {
        var sql = 'INSERT INTO users SET ?';
        return DB.query(sql, [user], callback);
    },

    getUser: (email, callback) => {
        var sql = 'SELECT * FROM users WHERE email = ?';
        return DB.query(sql, [email], callback);
    },

    getIdByEmail: (email, callback) => {
        var sql = 'SELECT id FROM users WHERE email = ?';
        return DB.query(sql, [email], callback);
    },

    getUsers: (level, callback) => {
        var sql = 'SELECT * FROM users WHERE id_level = ?';
        return DB.query(sql, [level], callback);
    },

    deleteAdmin: (id, callback) => {
        var sql = 'DELETE FROM users WHERE id = ?';
        return DB.query(sql, [id], callback);
    }

}

module.exports = User;