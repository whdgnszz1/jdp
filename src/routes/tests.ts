import express from 'express';
import TestsController from '../controllers/tests';
import { verifyToken } from '../middlewares/auth';
import TestsRepository from '../repositories/tests';
import TestsService from '../services/tests';
const router = express.Router();

const testsRepository = new TestsRepository();
const testsService = new TestsService(testsRepository);
const testsController = new TestsController(testsService);

// 테스트 생성
router.post('/testMake', verifyToken, testsController.createTest);

// 전체 테스트 조회
router.get('/', testsController.getAllTests);

// 단일 테스트 조회
router.get('/:testerId', testsController.getOneTest);

// 테스트 수정
router.put('/:testerId', verifyToken, testsController.updateTest);

// 테스트 삭제
router.delete('/:testerId', verifyToken, testsController.deleteTest);

export default router;
