import bcrypt from "bcrypt";
import db from '../../config/db.js';

export function getQueryTodos(callback) {
    const query = `SELECT * FROM todo`;

    db.query(query, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }

        if (!results) {
            callback({ "msg": 'Not found' }, 404);
            return;
        }

        const todo = results;
        callback({ todo }, 200);
    });
}

export function getQueryTodosId(todosId, callback) {
    const query = `SELECT * FROM todo WHERE id = '${todosId}'`;

    db.query(query, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }

        if (!results) {
            callback({ "msg": 'Not found' }, 404);
            return;
        }

        const todo = results[0];
        callback({ todo }, 200);
    });
}

export function postQueryTodos(title, description, due_time, status, user_id, callback) {
    const query = `
    INSERT INTO todo (title, description, due_time, status, user_id)
    VALUES ('${title}', '${description}', '${due_time}', '${status}', '${user_id}')
    `;

    db.query(query, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }

        const insertedTodoId = results.insertId;
        const selectQuery = `SELECT * FROM todo WHERE id = '${insertedTodoId}'`;
        db.query(selectQuery, (selectError, selectResults) => {
            if (selectError || !selectResults) {
                callback({ "msg": "Internal server error" }, 500);
                return;
            }
            const insertedTodo = selectResults[0];
            callback({ insertedTodo, ...insertedTodo }, 200);
        });
    });
}

export function updateQueryTodos(id, title, description, due_time, status, user_id, callback) {
    const query = `UPDATE todo SET title = '${title}', description = '${description}', due_time = '${due_time}', status = '${status}', user_id = '${user_id}' WHERE id = '${id}'`
    db.query(query, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }
        if (!results) {
            callback({ "msg": 'Not found' }, 404);
            return;
        }
        const selectQuery = `SELECT * FROM todo WHERE id = '${id}'`;
        db.query(selectQuery, (selectError, selectResults) => {
            if (selectError || !selectResults) {
                callback({ "msg": "Internal server error" }, 500);
                return;
            }
            const insertedTodo = selectResults[0];
            callback({ insertedTodo, ...insertedTodo }, 200);
        });
    });
}

export function deleteQueryTodos(id, callback) {
    const query = `DELETE FROM todo WHERE id = '${id}'`;
    db.query(query, (error, results) => {
        if (error) {
            callback({ "msg": "Internal server error" }, 500);
            return;
        }

        callback({ "msg": `Successfully deleted record number: ${id}` }, 200);
    });
}