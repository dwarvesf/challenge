## Database design solution fro multi-currency app

Recommended schema

**currency table**
We store supported and lated exchange rate in this table.

- `code` is 3 letter represent the currency name in short form, this code must follow ISO 4127
- `exchange_rate` rate is the rate where 1 `SystemCurrency` exchange to target currency. Data type should be `int8 | bigint` or `numeric` should not store as `float4 or float8`
- `precision` indicate how many number after decimal point currency that support

| id  | name             | symbol | code | exchange_rate | precision | updated_at | created_at |
| --- | ---------------- | ------ | ---- | ------------- | --------- | ---------- | ---------- |
| 1   | US Dollar        | $      | USD  | 1             | 2         |            |            |
| 2   | Vietnamese Dong  | đ      | VND  | 23000         | 0         |            |            |
| 3   | Singapore Dollar | $S     | SGD  | 1.36          | 2         |            |            |

### currency_rates

| id  | currency_id | code | value | created_at |
| --- | ----------- | ---- | ----- | ---------- |
| 1   | 2           | VND  | 23500 |            |
| 2   | 2           | VND  | 23000 |            |

Ref: [https://learn.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/currency](https://learn.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/currency)

#### Price table

- we store price/currency value in default currency in this example is USD

| id  | title            | price | currency_code |     |
| --- | ---------------- | ----- | ------------- | --- |
| 1   | product / item a | 3.99  | USD           |     |
|     |                  |       |               |     |

#### Backend response data

`conversion_rate` is populate and calculated base in the backend

`formated_price` is the price formatted base on `currency_code` and `lang` passed in the request

```json
{
	"price": 3.99,
	"currency": "USD",
	"symbol": "$",
	"conversion_rate": {
			"currency": "VND",
			"symbol": "đ",
			"exchange_rate": 23000
	}
	"formated_price": "91,770đ"
}
```

- Dedicated api to return all currency and lasted exchange rate

```json
[
	{
		"id": "string | number",
		"name": "string"
		"symbol": "string",
		"code": "string",
		"exchange_rate": number,
		"precision": number
	}
]
```
