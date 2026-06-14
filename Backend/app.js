import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'CityPolymerBD API is running' });
});

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;
