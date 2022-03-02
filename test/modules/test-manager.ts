import { getConnection } from 'typeorm';
import { User } from '../../src/users/entities/user.entity';
import { InsertResult } from 'typeorm';

/**
 * @todo
 * If you want to test a new target entity,
 * you need to add the target entity to this variable.
 */
const Entities = {
  // table_name: EntityClassName
  user_table: User,
};

type testDataSetType = {
  [key: string]: Array<{ [key: string]: any }>;
};

export const generateTestData = async (testDataSet: testDataSetType) => {
  const connection = await getConnection();

  for (const tableName of Object.keys(testDataSet)) {
    for (const data of testDataSet[tableName]) {
      const targetEntity = Entities[tableName];
      console.info('targetEntity=', targetEntity);
      const tableMeta = connection.getMetadata(targetEntity);
      console.info(tableMeta.tablePath);

      try {
        // Insert a test record
        const testRecordInsertResult: InsertResult = await connection
          .createQueryBuilder()
          .insert()
          .into(targetEntity)
          .values({ ...data })
          .execute();
        // Get the ID of the inserted test record.
        const {
          identifiers: [{ id }],
        } = testRecordInsertResult;
        console.info('testRecordInsertResult=', testRecordInsertResult);

        const idUpdateQuery = `UPDATE ${tableMeta.tablePath} SET id = '${data.id}' WHERE id = '${id}';`;
        console.info('idUpdateQuery=', idUpdateQuery);

        // Update the ID with the ID of the inserted test record.
        await connection.getRepository(targetEntity).query(idUpdateQuery);
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

  for (const tableName of tableList) {
    const targetEntity = Entities[tableName];
    console.info('targetEntity=', targetEntity);
    const tableMeta = connection.getMetadata(targetEntity);
    console.info(tableMeta.tablePath);
    const truncateQuery = `TRUNCATE ${tableMeta.tablePath} CASCADE;`;
    console.info('truncateQuery=', truncateQuery);
    try {
      // Delete all rows from the target table.
      await connection.getRepository(targetEntity).query(truncateQuery);
    } catch (error) {
      console.error(error);
    }
  }
};
