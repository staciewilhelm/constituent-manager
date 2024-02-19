import { Application } from 'express';
import constituentRoutes from './constituent-handler';

export default class Routes {
  constructor(app: Application) {
    app.use('/api/constituents', constituentRoutes);
    app.use('/api', (_, res) => {
      res.status(200).send({ msg: 'API accepting requests' });
    });
  }
}