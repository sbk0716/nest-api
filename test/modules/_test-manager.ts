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

// @todo
// Now(2020/08/06), values function ignore primary key parameter.
// So update after insert.
// if typeorm permit set primary key with insert or update, use values function.
export const generateTestData = async (testDataSet: testDataSetType) => {
  const connection = await getConnection();

  for (const table of Object.keys(testDataSet)) {
    const tableMeta = connection.getMetadata(Entity[table]);

    for (const data of testDataSet[table]) {
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
        .query(
          `UPDATE ${tableMeta.tablePath} SET id = ${data.id} WHERE id = ${id};`,
        );
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
  // @todo
  // https://github.com/typeorm/typeorm/issues/2978
  // if we can truncate with cascade, use clear method.
  for (const table of tableList) {
    const tableMeta = connection.getMetadata(Entity[table]);

    await connection
      .getRepository(Entity[table])
      .query(`TRUNCATE ${tableMeta.tablePath} CASCADE;`);
  }
};
