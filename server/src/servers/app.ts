import express, { Request, Response } from 'express';
import router from '../routes';
import database from '../database';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
// app.use(database);

app.get('/', (req: Request, res: Response) => {
  return res.send('Hello World!');
});

// app.post('/api/data', (req: Request, res: Response) => {
//     const { data } = req.body;
//     console.log('Received data:', data);
//     res.send('Data received successfully!');
// });

export default app;
