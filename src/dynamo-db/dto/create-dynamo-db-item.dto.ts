export class CreateDynamoDbItemDto {
  item: Record<string, any>;

  tableName: string;
}
