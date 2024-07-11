import express from 'express';
import { getAllBloqs, getAllLockers, getAllRents } from './controller';


export const router = express.Router();


router.get('/bloqs', getAllBloqs);
router.get('/lockers', getAllLockers);
router.get('/rents', getAllRents);
