import express, { Request, Response } from 'express';
import UsersRouter from './users';
import TestsRouter from './tests';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).send('jdp');
});

router.use('/user', UsersRouter);
router.use('/test', TestsRouter);

export default router;
