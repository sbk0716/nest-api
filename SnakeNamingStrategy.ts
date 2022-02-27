/**
 * typeorm-naming-strategies
 * {@link https://github.com/tonivj5/typeorm-naming-strategies/blob/master/src/snake-naming.strategy.ts}
 */
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils.js';

export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  /**
   * tableName
   * @param className 
   * @param customName 
   * @returns 
   */
  tableName(className: string, customName: string): string {
    return customName ? customName : snakeCase(className);
  }

  /**
   * columnName
   * @param propertyName 
   * @param customName 
   * @param embeddedPrefixes 
   * @returns 
   */
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.concat('').join('_')) +
      (customName ? customName : snakeCase(propertyName))
    );
  }
  /**
   * relationName
   * @param propertyName 
   * @returns 
   */
  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  /**
   * joinColumnName
   * @param relationName 
   * @param referencedColumnName 
   * @returns 
   */
  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  /**
   * joinTableName
   * @param firstTableName 
   * @param secondTableName 
   * @param firstPropertyName 
   * @param secondPropertyName 
   * @returns 
   */
  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ): string {
    return snakeCase(
      firstTableName +
        '_' +
        firstPropertyName.replace(/\./gi, '_') +
        '_' +
        secondTableName,
    );
  }

  /**
   * joinTableColumnName
   * @param tableName 
   * @param propertyName 
   * @param columnName 
   * @returns 
   */
  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(
      tableName + '_' + (columnName ? columnName : propertyName),
    );
  }

  /**
   * classTableInheritanceParentColumnName
   * @param parentTableName 
   * @param parentTableIdPropertyName 
   * @returns 
   */
  classTableInheritanceParentColumnName(
    parentTableName: any,
    parentTableIdPropertyName: any,
  ): string {
    return snakeCase(parentTableName + '_' + parentTableIdPropertyName);
  }

  /**
   * eagerJoinRelationAlias
   * @param alias 
   * @param propertyPath 
   * @returns 
   */
  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    return alias + '__' + propertyPath.replace('.', '_');
  }
}