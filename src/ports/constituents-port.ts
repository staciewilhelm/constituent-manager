import { addConstituent, getConstituentsWithParams } from '../adapters/repository-constituents';
import { IConstituent, IGetWithParams } from '../interfaces/constituents';


export const getConstituents = async (params: IGetWithParams): Promise<any> => {
  return await getConstituentsWithParams(params);
}

export const createConstituent = async (newData: IConstituent): Promise<IConstituent> => {
  return await addConstituent(newData);
}