import express from "express";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import bcrypt from "bcrypt";
import db from "../../config/db.js"
const auth = express.Router();
dotenv.config();

const jwtSecret = process.env.SECRET_TOKEN;

auth.post('/register', (req, res) => {
    const { email, password, name, firstname } = req.body;

    if (!email || !password || !name || !firstname) {
        res.status(400).json({ error: 'Bad parameters' });
        return;
    }

    bcrypt.hash(password, 10, (err, hash) => {
        const query = `INSERT INTO user (email, password, name, firstname) VALUES ('${email}', '${hash}', '${name}', '${firstname}')`;
        db.query(query, (error, results) => {
            if (error) {
                res.status(500).json ({ "msg": "Account already exists" });
                return;
            }
            const token = jwt.sign({ userId: results.insertId }, jwtSecret, { expiresIn: '24h' });
            res.json({ token });
        });
    });
});

auth.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT id, password FROM user WHERE email = '${email}'`;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
            res.status(500).json({ error: 'Error executing query' });
            return;
        }

        if (!results) {
            res.status(404).json({ error: 'Not found' });
            return;
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                res.status(500).json({ error: 'Error comparing passwords' });
                return;
            }

            if (!match) {
                res.status(500).json({ "msg": 'Invalid credentials' });
                return;
            }

            const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24h' });

            res.setHeader('Authorization', `WORD ${token}`);
            res.json({ token });
        });
    });
});

export default auth;
