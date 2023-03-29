## Database design solution fro multi-languages app

### Solution 1: Column base approach

In this approach, each column of the table will have an alternative column for transactions.

For example:

| id  | title | title_vi | title_fr |
| --- | ----- | -------- | -------- |
| 1   | apple | táo      | pomme    |

How to query

```sql
-- we wanted to use vi translation
SELECT
	COALESCE(title_vi, title) AS title
FROM
	"table_transated"
```

**Pros**

- Simple, fast, easy to implement, small data size

**Cons**

- Not scaleable number of columns are number of supported languages
- Adding new language require to update new schema
- Complex query condition for select language

### Solution 2: Column JSON-based approach

In this approach, we use a single-column `translation` to store all translation values for other columns of the table by language. The value of the column is an object which the is data shape

```json
{
	"vi": { -- language key
		"title": "táo", -- translated column
		"description": "trái táo" -- translated column
	},
	"en": {
		"title": "apple",
		"description": "apple"
	}
}
```

| id  | title | description | translations                                       |
| --- | ----- | ----------- | -------------------------------------------------- |
| 1   | apple | apple       | {"vi": {"title": "táo","description": "trái táo"}} |

**How to query**

```sql
-- return translation in translation column
-- we wanted to return all translations
SELECT
	id,
	title,
	translations
FROM
	"table";

-- we only want to return a specific language
SELECT
	id,
	title,
	translations -> "vi" AS translation
FROM
	"table";

-- omit the translation field
SELECT
	id,
	translations -> 'vi' -> 'title' AS title,
	translations -> 'vi' -> 'description' AS description
FROM
	"table";
```

**Pros**

- Same as the column base but reduced the number of columns

**Cons**

- complex logic and it’s hard to manage translations
- add new language does not require a schema change
- slow query due to reading looping JSON array/object

### Solution 3: Translation table approach

All texts should have a translation in each supported language so we need to store, we'll keep translation in separated schema

TextContextTable

| id  | title  | description |
| --- | ------ | ----------- |
| 1   | apple  | from US     |
| 2   | orange | sour        |

TranslationsTable

| id  | lang | trans_key | trans_value |
| --- | ---- | --------- | ----------- |
| 1   | en   | apple     | apple       |
| 2   | vi   | apple     | táo         |
| 3   | en   | from US   | from US     |

**How to query**

```sql
SELECT
	title_trans.trans_value AS "title",
	description_trans.trans_value AS "description",
FROM
	"table_a"
	LEFT JOIN "translations" AS title_trans ON "table_a"."title" = description_trans.trans_key
		AND lang = 'vi'
	LEFT JOIN "translations" AS description_trans ON "table_a"."title" = description_trans.trans_key
		AND lang = 'vi'
```

**Pros**

- Scalable
- Adding new language doesn’t require a schema change

**Cons**

- Duplicate contents hard to manage
- Slow query due to joining
