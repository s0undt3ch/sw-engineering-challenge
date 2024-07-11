import { Request, Response } from 'express';
import { getBloqs } from './models/bloqs';
import { getLockers } from './models/lockers';
import { getRents } from './models/rents';


export const getAllBloqs = (req: Request, res: Response) => {
 res.json({
   message: getBloqs(),
 });
};


export const getAllLockers = (req: Request, res: Response) => {
 res.json({
   message: getLockers(),
 });
};


export const getAllRents = (req: Request, res: Response) => {
 res.json({
   message: getRents(),
 });
};
