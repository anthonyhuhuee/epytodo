import express from "express";
import authenticateToken from "../../middleware/auth.js";
import {getQueryUser, getQueryUserTodos, getQueryUserByEmail, getQueryUserById, updateQueryUser, deleteQueryUser} from "./user.query.js";
const user = express.Router();

user.get('/user', authenticateToken,(req, res) => {
    const userId = req.user;

    getQueryUser(userId, (response, statusCode) => {
        if (response.error) {
            res.status(statusCode).json({ "msg": response.error });
            return;
        }

        const user = response.user
        res.json(user);
    });
});

user.get('/user/todos', authenticateToken,(req, res) => {
    const userId = req.user;

    getQueryUserTodos(userId, (response, statusCode) => {
        if (response.error) {
            res.status(statusCode).json({ "msg": response.error });
            return;
        }

        const user = response.user
        res.json(user);
    });
});

user.get('/users/:idOrEmail', authenticateToken, (req, res) => {
    const idOrEmail = req.params.idOrEmail;
    if (!idOrEmail) {
        res.status(400).json({ "msg": "Bad parameters" });
        return;
    }

    if (idOrEmail.includes('@')) {
        const email = idOrEmail.replace(':', '');;
        getQueryUserByEmail(email, (response, statusCode) => {
            if (response.error) {
                res.status(statusCode).json({ "msg": response.error });
                return;
            }

            const user = response.user;
            res.json(user);
        });
    } else {
        const id = idOrEmail.replace(':', '');
        getQueryUserById(id, (response, statusCode) => {
            if (response.error) {
                res.status(statusCode).json({ "msg": response.error });
                return;
            }

            const user = response.user;
            res.json(user);
        });
    }
});

user.put('/users/:id', authenticateToken, (req, res) => {
    const id = req.params.id.replace(':', '');
    const { email, password, name, firstname } = req.body;
    if (!email || !password || !name || !firstname || !id) {
        res.status(400).json({ "msg": "Bad parameters" });
        return;
    }
    updateQueryUser(id, email, password, name, firstname, (response, statusCode) => {
        if (response.error) {
            res.status(statusCode).json({ "msg": response.error });
            return;
        }

        const user = {
            id: response.id,
            email: response.email,
            password: response.hash,
            created_at: response.created_at,
            name: response.name,
            firstname: response.firstname
        };
        res.json(user);
    });
});

user.delete('/users/:id', authenticateToken, (req, res) => {
    const id = req.params.id.replace(':', '');

    if (!id) {
        res.status(400).json({ "msg": "Bad parameters" });
        return;
    }

    deleteQueryUser(id, (response, statusCode) => {
        if (response.error) {
            res.status(statusCode).json({ "msg": response.error });
            return;
        }

        res.json(response);
    });
});

export default user;