
### Problem

- Get all entries to have `win rate` from **60%** to **80%** from backtest result table (table has more than 500M records) and `order by rr` (reward & risk) desc

### Backtest result table

- Database type: Postgres
- Data type: structure and fixed value over time
- Table structure field
    - entry: backtest entry level
    - target: backtest target level
    - stoploss: backtest stop loss level
    - price structure id: price structure to get the result
    - win: 1 is win and 0 is not win
    - lose: 1 is lose and 0 is not lose
    - na: 1 is not available result and 0 is can lose or win
    - source: result with source
- Partition by entry

| entry | target | stoploss | price_structure_id | win | lose | na | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | 99 | 1 | 1 | 0 | 0 | 1 |
| 2 | 0 | 99 | 1 | 0 | 1 | 0 | 1 |
| 3 | 0 | 99 | 1 | 0 | 0 | 1 | 1 |

### With a normal query to do everything get a report

```jsx
SELECT
  target,
  entry,
  stoploss,
  rr,
  cast(round(cast(cast(sum(win) * 100 as float) / cast(count(price_structure_id) as float) as numeric), 2) as float) AS win_percent,
  cast(round(cast(cast(sum(lose) * 100 as float) / cast(count(price_structure_id) as float) as numeric), 2) as float) AS lose_percent,
  cast(round(cast(cast(sum(na) * 100 as float) / cast(count(price_structure_id) as float) as numeric), 2) as float) AS na_percent,
  sum(win) AS win_count,
  sum(lose) AS lose_count,
  sum(na) AS na_count,
  count(price_structure_id) AS price_structure_count
FROM
  backtest_trade_results
GROUP BY
  entry,
  target,
  stoploss,
  rr
HAVING 
	(cast(round(cast(cast(sum(win) * 100 as float) / cast(count(price_structure_id) as float) as numeric), 2) as float)) >= 60 
	AND (cast(round(cast(cast(sum(win) * 100 as float) / cast(count(price_structure_id) as float) as numeric), 2) as float)) <= 80
WITH DATA
ORDER BY rr DESC
```

with this normal query, you will get a timeout error, you will have timeout also when trying to create VIEW for the cache

⇒ Can’t do this solution in big data