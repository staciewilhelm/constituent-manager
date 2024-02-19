import dayjs from 'dayjs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { unparse } from 'papaparse';

import { createConstituent, getConstituents } from '../ports/constituents-port';
import { IConstituent, IGetWithParams } from '../interfaces/constituents';


const writeCSV = async (constituents: any[]): Promise<any> => {
  const todayDate = dayjs(new Date()).toISOString();
  const newFileName = `constituents-export-${todayDate}.csv`;
  const newFilePath = path.resolve(__dirname, `../../files/${newFileName}`);
  const csvData = unparse(constituents, { header: true });

  await writeFile(newFilePath, csvData);
};

export const createOne = async (newConstituent: IConstituent): Promise<IConstituent> => {
  let created: IConstituent;
  try {
    created = await createConstituent(newConstituent);
    return created;
  } catch (err) {
    console.warn(`Unable to create constituent: ${err}`);
    return {} as IConstituent;
  }
}

export const getAll = async (): Promise<IConstituent[]> => {
  let constituents: IConstituent[] = [];
  try {
    constituents = await getConstituents({});
    return constituents;
  } catch (err) {
    console.warn(`Unable to get all constituents: ${err}`);
    return constituents;
  }
}

export const getAllBySignupTime = async (params: IGetWithParams): Promise<IConstituent[]> => {
  const { signupTime, export: isExport } = params;
  let constituents: IConstituent[] = [];

  try {
    if (!signupTime) {
      console.error('SignupTime is required');
      return constituents;
    }

    constituents = await getConstituents({ signupTime });
    if (isExport) {
      return await writeCSV(constituents);
    } else {
      return constituents;
    }
  } catch (err) {
    console.warn(`Unable to get constituents by signup time: ${err}`);
    return constituents;
  }
}