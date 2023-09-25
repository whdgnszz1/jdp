import { Request, Response } from 'express';
import { TestInput } from '../dtos/tests';
import asyncHandler from '../lib/asyncHandler';
import TestsService from '../services/tests';
import prisma from '../utils/prisma';

class TestsController {
  constructor(private readonly testsService: TestsService) {}

  createTest = asyncHandler(async (req: Request, res: Response) => {
    const testInput: TestInput = req.body;
    const userId: number = res.locals.decoded.userId!;
    try {
      const newTest = await prisma.testers.create({
        data: {
          userId,
          title: testInput.title,
          content: testInput.content,
          image: testInput.image,
          category: testInput.category,
          Questions: {
            create: testInput.questions.map((q) => ({
              title: q.title,
              image: q.image,
              Choices: {
                create: q.Choices ? q.Choices.create : [],
              },
            })),
          },
        },
      });

      res.status(201).json({ success: true, data: newTest });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', error });
    }
  });

  getAllTests = async (req: Request, res: Response) => {
    try {
      const tests = await prisma.testers.findMany({
        include: {
          user: true,
        },
      });

      // const result = tests.map((test) => ({
      //   username: test.user.username,
      //   title: test.title,
      //   image: test.image,
      //   category: test.category,
      //   views: test.views,
      //   likes: test.likes,
      // }));

      res.status(200).json(tests);
    } catch (error) {
      console.error(error);
      throw new Error('Could not fetch tests');
    }
  };

  getOneTest = async (req: Request, res: Response) => {
    try {
      const testerId = +req.params.testerId;
      const test = await prisma.testers.findUnique({
        where: {
          testerId: testerId,
        },
        include: {
          user: true,
          Questions: true,
          Likes: true,
          Results: true,
          Thumbnails: true,
          Comments: true,
        },
      });

      if (!test) {
        throw new Error('Test not found');
      }

      const result = {
        username: test.user.username,
        title: test.title,
        content: test.content,
        category: test.category,
        image: test.image,
        views: test.views,
        likes: test.likes,
        comments: test.Comments.map((comment) => ({
          comment: comment.content,
        })),
      };

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      throw new Error('Could not fetch the test');
    }
  };

  updateTest = asyncHandler(async (req: Request, res: Response) => {
    const testerId: number = parseInt(req.params.id, 10);
    const updateData = req.body;

    try {
      const updatedTest = await this.testsService.updateTest(
        testerId,
        updateData,
      );
      console.log(updatedTest);
      res.status(200).json({ message: '테스트 수정 완료' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', error });
    }
  });

  deleteTest = asyncHandler(async (req: Request, res: Response) => {
    const testerId: number = parseInt(req.params.id, 10);

    try {
      const deletedTest = await this.testsService.deleteTest(testerId);
      console.log(deletedTest);
      res.status(200).json({ message: '테스트 삭제 완료' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', error });
    }
  });
}

export default TestsController;
