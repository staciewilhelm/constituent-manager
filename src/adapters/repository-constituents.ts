import dayjs from 'dayjs';
import dotenv from 'dotenv';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { ParseResult, parse, unparse } from 'papaparse';

import { IConstituent, IGetWithParams } from '../interfaces/constituents';


dotenv.config();

const loadData = async (): Promise<ParseResult<any>> => {
  const fileName = process.env.DATASTORE_FILENAME || 'constituent-sample.csv';
  const filePath = path.resolve(__dirname, `../../files/${fileName}`);
  const csvFile = fs.readFileSync(filePath, 'utf8');
  return parse(csvFile, {
    header: true,
    dynamicTyping: true,
  });
}

const saveData = async (data: IConstituent): Promise<void> => {
  const fileName = process.env.DATASTORE_FILENAME || 'constituent-sample.csv';
  const filePath = path.resolve(__dirname, `../../files/${fileName}`);

  const appendFile = fs.createWriteStream(filePath, { flags: 'a' });
  const dataToWrite = Object.values(data).join(',');

  appendFile.write(`${dataToWrite}\n`);
  appendFile.end();
}

const updateData = async (constituents: any[]): Promise<any> => {
  const fileName = process.env.DATASTORE_FILENAME || 'constituent-sample.csv';
  const filePath = path.resolve(__dirname, `../../files/${fileName}`);
  const csvData = unparse(constituents, { header: true });

  await writeFile(filePath, csvData);
}

export const getConstituentsWithParams = async (params: IGetWithParams): Promise<IConstituent[]> => {
  const { signupTime } = params;
  let constituents: IConstituent[] = [];
  try {
    const results = await loadData();
    if (!results.data.length) {
      return constituents;
    }

    if (signupTime) {
      constituents = results.data.filter((c: IConstituent) => dayjs(c.signup) <= dayjs(signupTime));
    } else {
      results.data.forEach((row: IConstituent) => constituents.push(row));
    }

    console.log(`Found ${constituents.length} results`);

  } catch (err) {
    console.error(`Error returning constituents: ${err}`);
  }
  return constituents;
}

export const addConstituent = async (newData: IConstituent): Promise<IConstituent> => {
  try {
    const results = await loadData();

    const existingConstituent = results.data.find(
      (c: IConstituent) => c.email === newData.email
    );

    if (existingConstituent) {
      console.log(`Constituent record with email ${existingConstituent.email} already exists. Merging.`);

      const updatedData = results.data.map((c: IConstituent) => {
        if (c.email === newData.email) {
          c.address = newData.address;
          c.name = newData.name;
          return c;
        } else {
          return c;
        }
      })

      await updateData(updatedData);
      return newData;
    } else {
      newData.signup = dayjs(new Date()).toISOString();
      await saveData(newData);
      return newData;
    }
  } catch (err) {
    console.error(`Error returning constituents: ${err}`);
  }

  return {} as IConstituent;
}
