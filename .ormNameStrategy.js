const DefaultNamingStrategy = require('typeorm').DefaultNamingStrategy;
const snakeCase = require('typeorm/util/StringUtils').snakeCase;
const pluralize = require('pluralize');

module.exports = class TypeOrmNamingStrategy extends DefaultNamingStrategy {
  tableName = (className, customName) => customName || pluralize(snakeCase(className));

  columnName = (propertyName, customName, embeddedPrefixes) =>
    snakeCase(embeddedPrefixes.join('_')) + (customName || snakeCase(propertyName));

  relationName = (propertyName) => snakeCase(propertyName);

  joinColumnName = (relationName, referencedColumnName) =>
    snakeCase(pluralize.singular(relationName) + '_' + referencedColumnName);

  joinTableName = (firstTableName, secondTableName, firstPropertyName, secondPropertyName) =>
    snakeCase(firstTableName + '_' + secondTableName);

  joinTableColumnName = (tableName, propertyName, columnName) =>
    snakeCase(pluralize.singular(tableName) + '_' + (columnName || propertyName));

  classTableInheritanceParentColumnName = (parentTableName, parentTableIdPropertyName) =>
    snakeCase(pluralize.singular(parentTableName) + '_' + parentTableIdPropertyName);
};
