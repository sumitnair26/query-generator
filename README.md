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
   git clone https://github.com/your-username/query-generator.git
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

To generate a query for the `Referrer` schema with the column `Referrer ID`, simply adjust the `selectColumns` array in `index.ts`:

```javascript
const schemaName = 'Referrer';
const selectColumns = ['Referrer ID'];
const filters = {};

const query = generateQuery(schemaName, selectColumns, filters);
console.log(query);
```

This will generate a simple query without any joins or filters:

```sql
SELECT id AS "Referrer ID" FROM user
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

