import TestsRepository from '../repositories/tests';
import prisma from '../utils/prisma';

class TestsService {
  constructor(private readonly testsRepository: TestsRepository) {}
  updateTest = async (
    testerId: number,
    updateData: { title: string; content: string; image: string },
  ) => {
    try {
      const updatedTest = await prisma.testers.update({
        where: { testerId: testerId },
        data: {
          title: updateData.title,
          content: updateData.content,
          image: updateData.image,
        },
      });

      if (!updatedTest) {
        throw new Error('Test not found or update failed');
      }

      return updatedTest;
    } catch (error) {
      console.error(error);
      throw new Error('Could not update the test');
    }
  };

  deleteTest = async (testerId: number) => {
    try {
      const deletedTest = await prisma.testers.delete({
        where: { testerId: testerId },
      });

      if (!deletedTest) {
        throw new Error('Test not found or delete failed');
      }

      return deletedTest;
    } catch (error) {
      console.error(error);
      throw new Error('Could not delete the test');
    }
  };
}

export default TestsService;
