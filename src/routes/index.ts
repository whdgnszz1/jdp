import { verifyToken } from './../middlewares/auth';
import express, { Request, Response } from 'express';
import UsersRouter from './users';
import TestsRouter from './tests';
import UtilRouter from './utils';
import CommentsRouter from './comments';
import asyncHandler from '../lib/asyncHandler';
import prisma from '../utils/prisma';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).send('jdp');
});

router.use('/:testerId/comment', CommentsRouter);
router.use('/user', UsersRouter);
router.use('/test', TestsRouter);
router.use('/', UtilRouter);

// 테스트 참가
router.post(
  '/participate/:testerId',
  verifyToken,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(400).send('유저 정보가 존재하지 않습니다.');
    }
    const { score } = req.body;
    const userId: number = res.locals.decoded.userId!;
    const { testerId } = req.params;
    await prisma.results.create({
      data: {
        score,
        userId,
        testerId: +testerId,
      },
    });
  }),
);

export default router;
