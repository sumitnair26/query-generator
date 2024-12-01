import { schemas, Schema, Column, Relation } from './schema';

export function generateQuery(schemaName:string, selectColumns:string, filters = {}) {
  // Find the schema by name
  const schema = schemas.find((s) => s.name === schemaName);
  if (!schema) {
    throw new Error(`Schema with name ${schemaName} not found.`);
  }

  const baseTable = schema.table;
  const { relations, columns } = schema;

  // Step 1: Handle SELECT Clause
  const selectedFields = selectColumns
  //@ts-ignore
    .map((colName:string) => {
      const column = columns.find((c) => c.name === colName);
      if (!column) {
        throw new Error(`Column ${colName} not found in schema ${schemaName}.`);
      }
      return `${column.formula} AS "${colName}"`;
    })
    .join(', ');

  // Step 2: Handle JOIN Clause
  //@ts-ignore
  const joinClauses:Array<string> = [];
  const requiredTables = new Set();
  
  //@ts-ignore
  selectColumns.forEach((colName) => {
    const column = columns.find((c) => c.name === colName);
    if (column) {
      column.dependentTables.forEach((table) => requiredTables.add(table));
    }
  });

  if (requiredTables.size > 0) {
    relations.forEach((relation) => {
      if (requiredTables.has(relation.table)) {
        const { type, table, alias, field } = relation;
        if (type === 'forward') {
          joinClauses.push(
            `LEFT JOIN ${table} AS ${alias} ON ${baseTable}.${field} = ${alias}.id`
          );
        } else if (type === 'reverse') {
          joinClauses.push(
            `LEFT JOIN ${table} AS ${alias} ON ${alias}.${field} = ${baseTable}.id`
          );
        }
      }
    });
  }

  // Step 3: Handle WHERE Clause
  //@ts-ignore
  const whereClauses = Object.entries(filters)
  //@ts-ignore
    .map(([key, value]) => `${key} = '${value}'`)
    .join(' AND ');

  // Step 4: Combine the Query
  const query = `
    SELECT ${selectedFields}
    FROM ${baseTable}
    ${joinClauses.length > 0 ? joinClauses.join(' ') : ''}
    ${whereClauses ? `WHERE ${whereClauses}` : ''}
  `.trim();

  return query;
}

// Example Usage
const schemaName = 'Referrer';
// const selectColumns:any = [
//   'Referrer ID',
//   'Referrer name',
//   'Referrer organization name',
//   'Spam'
// ];


const selectColumns:any = [
  'Referrer ID',
  'Referrer name',
  'Referrer organization name',
  'Spam'
]; 


//const filters = {}; // No filters
//const filters = { 'user.id': 1 };

const filters:any = {'lead.Spam': "<10"}

const query = generateQuery(schemaName, selectColumns, filters);
console.log(query);

/*
  SELECT id AS "Referrer ID"
    FROM user;

  SELECT id AS "Referrer ID", COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') AS "Referrer name", organization.name AS "Referrer organization name", SUM(CASE WHEN "lead.intro_spam_status" = 'relation_not_validated' OR "lead.intro_spam_status" = 'no_reply' THEN 1 ELSE 0 END) AS "Spam"
    FROM user
    LEFT JOIN organization AS organization ON user.organization_id = organization.id LEFT JOIN lead AS lead ON lead.referrer_id = user.id;

  SELECT id AS "Referrer ID", COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') AS "Referrer name", organization.name AS "Referrer organization name", SUM(CASE WHEN "lead.intro_spam_status" = 'relation_not_validated' OR "lead.intro_spam_status" = 'no_reply' THEN 1 ELSE 0 END) AS "Spam"
    FROM user
    LEFT JOIN organization AS organization ON user.organization_id = organization.id LEFT JOIN lead AS lead ON lead.referrer_id = user.id
    WHERE user.id = '1';

  SELECT organization.name AS "Referrer organization name", SUM(CASE WHEN "lead.intro_spam_status" = 'relation_not_validated' OR "lead.intro_spam_status" = 'no_reply' THEN 1 ELSE 0 END) AS "Spam"
    FROM user
    LEFT JOIN organization AS organization ON user.organization_id = organization.id LEFT JOIN lead AS lead ON lead.referrer_id = user.id
    WHERE user.id = '1'

*/
