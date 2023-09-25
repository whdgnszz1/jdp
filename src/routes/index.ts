import express, { Request, Response } from 'express';
import UsersRouter from './users';
import TestsRouter from './tests';
import UtilRouter from './utils';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).send('jdp');
});

router.use('/user', UsersRouter);
router.use('/test', TestsRouter);
router.use('/', UtilRouter);

export default router;
