import { Request, Response, Router } from 'express';

import { ITypedRequest, ITypedRequestBody } from '../interfaces/request-response';
import { IConstituent, IGetWithParams } from '../interfaces/constituents';
import { createOne, getAll, getAllBySignupTime } from '../services/constituent-service';


class ConstituentHandler {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  async getAllConstituents(req: Request, res: Response): Promise<any> {
    try {
      const constituents = await getAll();
      res.status(200).send(constituents);
    } catch (err) {
      res.status(500).send('Internal server error');
    }
  }

  async getAllConstituentsBySignupTime(req: ITypedRequest<{ signupTime: string }, { export: string }>, res: Response): Promise<any> {
    try {
      const params: IGetWithParams = { ...req.params, ...req.query };
      const constituents = await getAllBySignupTime(params);
      res.status(200).send(constituents);

    } catch (err) {
      res.status(500).send('Internal server error');
    }
  }

  async createConstituent(req: ITypedRequestBody<IConstituent>, res: Response): Promise<any> {
    try {
      const constituent = await createOne(req.body);
      res.status(200).send({msg: `Created constituent with ${constituent.email} email`});
    } catch (err) {
      res.status(500).send('Internal server error');
    }
  }

  intializeRoutes() {
    // Create a new Constituent
    this.router.post('/', this.createConstituent);

    // Get Constituents by time with optional export
    this.router.get('/:signupTime', this.getAllConstituentsBySignupTime);

    // Retrieve all Constituents
    this.router.get('/', this.getAllConstituents);
  }
}

export default new ConstituentHandler().router;