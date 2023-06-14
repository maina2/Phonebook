import express from 'express';
import bodyParser from 'body-parser';
import config from './src/db/config.js';
import todoRoutes from './src/routes/todoRoutes.js';

const app = express();
//
app.use(bodyParser.json());

// my-routes
todoRoutes(app);

app.get('/', (req, res) => {
    res.send("Hello😁 Welcome todo API!");
});

app.listen(config.port, () => {
    console.log(`Server is running on ${config.url}`);
});