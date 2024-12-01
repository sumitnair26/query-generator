/* 
    * From inputs check in schema what data is required
    * Check relationship with dependentTables 
    * check formula 
    * 
*/

export interface Column {
    name: string;
    type: string;
    formula: string;
    dependentTables: Array<string>,
  }
 
  export interface Relation {
    type: "forward" | "reverse";
    table: string;
    tableType: "table" | "query"
    field: string;
    alias: string;
  }
 
  export interface Schema {
    name: string;
    table: string;
    relations: Relation[];
    columns: Column[];
  }
 
  export const schemas: Array<Schema> = [{
    name: "Referrer",
    table: "user",
    relations: [
      {
        type: "forward",
        table: "organization",
        tableType: "table",
        field: "organization_id",
        alias: "organization",
      },
      {
        type: "reverse",
        table: "lead",
        tableType: "table",
        field: "referrer_id",
        alias: "lead",
      },
    ],
    columns: [
      {
        name: "Referrer ID",
        type: "Number - Value",
        dependentTables: [],
        formula: "id",
      },
      {
        name: "Referrer name",
        type: "Object",
        dependentTables: [],
        formula: "COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')",
      },
      {
        name: "Referrer organization name",
        type: "Object",
        dependentTables: ['organization'],
        formula: "organization.name",
      },
      {
        name: "Spam",
        type: "Calculate (1,000)",
        dependentTables: ['lead'],
        formula: `SUM(CASE WHEN "lead.intro_spam_status" = 'relation_not_validated' OR "lead.intro_spam_status" = 'no_reply' THEN 1 ELSE 0 END)`,
      },
    ],
  }];
 
 