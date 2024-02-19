import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';

import Routes from './handlers';

dotenv.config();

const PORT: number = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 8080;

class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: 'http://localhost:8081'
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
}

const app: Application = express();
const server: Server = new Server(app);

app
  .listen(PORT, 'localhost', () => {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Error: address already in use');
    } else {
      console.log(err);
    }
  });