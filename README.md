# Query Generator

This project provides a flexible and reusable query generator based on a pre-defined schema. The schema supports relationships between tables and allows the generation of SQL queries with optional filters.

## Features

- Define schemas with columns, relationships, and formulas.
- Generate SQL queries dynamically based on the schema.
- Supports handling forward and reverse relationships.
- Omits unnecessary `JOIN` and `WHERE` clauses if not required by the query.

## Prerequisites

- Node.js (v14 or later recommended)
- TypeScript (v4 or later)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sumitnair26/query-generator
   cd query-generator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

1. Compile the TypeScript code:

   ```bash
   tsc -b
   ```

2. Run the generated JavaScript code:

   ```bash
   node dist/index.js
   ```

## File Structure

- **schema.ts**: Contains the schema definition and related interfaces.
- **queryGenerator.ts**: Contains the query generation logic.
- **index.ts**: Entry point to execute and test the query generator.

## Example

To generate a query for the `Referrer` schema with multiple columns and filters, set up the `selectColumns` and `filters` in `index.ts`:

```javascript
const schemaName = 'Referrer';
const selectColumns = [
  'Referrer ID',
  'Referrer name',
  'Referrer organization name',
  'Spam',
];

const filters = { 'user.id': 1 };

const query = generateQuery(schemaName, selectColumns, filters);
console.log(query);
```

This will generate a query with the selected columns and a `WHERE` clause:

```sql
SELECT id AS "Referrer ID", 
       COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') AS "Referrer name", 
       organization.name AS "Referrer organization name", 
       SUM(CASE WHEN "lead.intro_spam_status" = 'relation_not_validated' OR "lead.intro_spam_status" = 'no_reply' THEN 1 ELSE 0 END) AS "Spam"
FROM user
LEFT JOIN organization AS organization ON user.organization_id = organization.id
LEFT JOIN lead AS lead ON lead.referrer_id = user.id
WHERE user.id = 1
```

## Contribution

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with descriptive messages.
4. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, feel free to reach out to [sumit.nair26\@gmail.com].

