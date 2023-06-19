import * as dotenv from 'dotenv';
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import user from './routes/user/user.js';
import auth from './routes/auth/auth.js'
import todo from './routes/todos/todos.js';
import notFound from './middleware/notFound.js';

const app = express();
const port = 3000;

dotenv.config();
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('GET request to the homepage')
});

//Routes
app.use(auth);
app.use(user);
app.use(todo);

//notFoundRoutes
app.use(notFound);

app.listen(port, () => {
    console.log(`Server launched with address http://localhost:${port}`);
});
