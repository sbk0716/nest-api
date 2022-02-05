import { getConnection } from 'typeorm';
import { User } from '../../src/users/entities/user.entity';

const Entity = {
  user: User,
};

type testDataSetType = {
  [key: string]: {
    [key: string]: any;
  }[];
};

export const generateTestData = async (testDataSet: testDataSetType) => {
  const connection = await getConnection();

  for (const table of Object.keys(testDataSet)) {
    for (const data of testDataSet[table]) {
      try {
        const {
          identifiers: [{ id }],
        } = await connection
          .createQueryBuilder()
          .insert()
          .into(Entity[table])
          .values({ ...data })
          .execute();

        await connection
          .getRepository(Entity[table])
          .update(id, { id: data.id });
      } catch (error) {
        console.error(error);
      }
    }
  }
};

export const truncateTestData = async (
  testDataSet: testDataSetType | string[],
) => {
  const connection = await getConnection();
  const tableList = Array.isArray(testDataSet)
    ? testDataSet
    : Object.keys(testDataSet);
  for (const table of tableList) {
    await connection.getRepository(Entity[table]).clear();
  }
};
