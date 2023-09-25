import { verifyToken } from './../middlewares/auth';
import express, { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { CustomError } from '../errors/customError';
const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { testerId } = req.params;
  const content: string = req.body;
  const userId: number = res.locals.decoded.userId!;
  console.log(res.locals);
  console.log(testerId);
  const result = await prisma.comments.create({
    data: { userId, testerId: +testerId, content },
  });
  res.status(200).json(result);
});

router.put('/:commentId', verifyToken, async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      throw new CustomError(400, '수정할 내용이 필요합니다.');
    }

    const updatedComment = await prisma.comments.update({
      where: { commentId: +commentId },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Internal Server Error' });
  }
});

router.delete(
  '/:commentId',
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { commentId } = req.params;

      await prisma.comments.delete({
        where: { commentId: +commentId },
      });

      res.status(204).send('댓글 삭제 완료');
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  },
);

export default router;
