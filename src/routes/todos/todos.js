import express from "express";
import authenticateToken from "../../middleware/auth.js";
import {getQueryTodos, getQueryTodosId, postQueryTodos, updateQueryTodos, deleteQueryTodos} from "./todos.query.js";
const todo = express.Router();

todo.get('/todos', authenticateToken,(req, res) => {
    getQueryTodos((response, statusCode) => {
        if (response.error) {
            res.status(statusCode).json({ "msg": response.error });
            return;
        }

        const todo = response.todo
        res.json(todo);
    });
});

todo.get('/todos/:id', authenticateToken,(req, res) => {
    const todosId = req.params.id.replace(':', '');
    getQueryTodosId(todosId, (response, statusCode) => {
        if (response.error) {
            res.status(statusCode).json({ "msg": response.error });
            return;
        }

        const todo = response.todo
        res.json(todo);
    });
});

todo.post('/todos', (req, res) => {
    const { title, description, due_time, status, user_id } = req.body;

    if (!title || !description || !due_time || !status || !user_id) {
        res.status(400).json({ "msg": "Bad parameters" });
        return;
    }

    postQueryTodos(title, description, due_time, status, user_id, (response, statusCode) => {
        if (response.error) {
            res.status(statusCode).json({ "msg": response.error });
            return;
        }

        const todo = {
            id: response.id,
            title: response.title,
            description: response.description,
            created_at: response.created_at,
            due_time: response.due_time,
            status: response.status,
            user_id: response.user_id,
        };
        res.json(todo);
    });
});

todo.put('/todos/:id', authenticateToken, (req, res) => {
    const id = req.params.id.replace(':', '');
    const { title, description, due_time, status, user_id } = req.body;
    if (!title || !description || !due_time || !status || !user_id || !id) {
        res.status(400).json({ "msg": "Bad parameters" });
        return;
    }
    updateQueryTodos(id, title, description, due_time, status, user_id, (response, statusCode) => {
        if (response.error) {
            res.status(statusCode).json({ "msg": response.error });
            return;
        }

        const todo = {
            id: response.id,
            title: response.title,
            description: response.description,
            created_at: response.created_at,
            due_time: response.due_time,
            status: response.status,
            user_id: response.user_id,
        };
        res.json(todo);
    });
});

todo.delete('/todos/:id', authenticateToken, (req, res) => {
    const id = req.params.id.replace(':', '');

    if (!id) {
        res.status(400).json({ "msg": "Bad parameters" });
        return;
    }

    deleteQueryTodos(id, (response, statusCode) => {
        if (response.error) {
            res.status(statusCode).json({ "msg": response.error });
            return;
        }

        res.json(response);
    });
});
export default todo;