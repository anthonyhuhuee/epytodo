import bcrypt from "bcrypt";
import db from '../../config/db.js';

export function getQueryUser(userId, callback) {
    const query = `SELECT * FROM user WHERE id = '${userId}'`;

    db.query(query, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }

        if (!results) {
            callback({ "msg": 'Not found' }, 404);
            return;
        }

        const user = results[0];
        callback({ user }, 200);
    });
}

export function getQueryUserTodos(userId, callback) {
    const query = `SELECT * FROM todo WHERE user_id = '${userId}'`;

    db.query(query, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }

        if (!results) {
            callback({ "msg": 'Not found' }, 404);
            return;
        }

        const user = results;
        callback({ user }, 200);
    });
}

export function getQueryUserById(id, callback) {
    const query = `SELECT * FROM user WHERE id = '${id}'`;

    db.query(query, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }

        if (!results) {
            callback({ "msg": 'Not found' }, 404);
            return;
        }

        const user = results[0];
        callback({ user }, 200);
    });
}

export function getQueryUserByEmail(email, callback) {
    const query = `SELECT * FROM user WHERE email = '${email}'`;

    db.query(query, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }

        if (!results) {
            callback({ "msg": 'Not found' }, 404);
            return;
        }

        const user = results[0];
        callback({ user }, 200);
    });
}

export function updateQueryUser(id, email, password, name, firstname, callback) {
    const selectQuery = `SELECT created_at FROM user WHERE id = '${id}'`;

    db.query(selectQuery, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }

        if (!results.length) {
            callback({ "msg": 'Not found' }, 404);
            return;
        }

        const { created_at } = results[0];
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                callback({ "msg": "Internal server error" }, 500);
                return;
            }

            const query = `
            UPDATE user SET email = '${email}', password = '${hash}', name = '${name}', firstname = '${firstname}' WHERE id = '${id}'`

            db.query(query, (error, results) => {
                if (error) {
                    callback({ "msg": 'Account already exists' }, 500);
                    return;
                }

                if (!results) {
                    callback({ "msg": 'Not found' }, 404);
                    return;
                }

                callback({id, email, hash, created_at, name, firstname}, 200);
            });
        });
    });
}

export function deleteQueryUser(id, callback) {
    const query = `DELETE FROM user WHERE id = '${id}'`;
    db.query(query, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }

        callback({ "msg": `Successfully deleted record number: ${id}` }, 200);
    });
}