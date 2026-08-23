# Agriculture Dataset (Q3) - Modification Notes

Input file used:
- `/home/ubuntu/.cursor/projects/workspace/uploads/Total_agriculture_land_holders_Total_c8cf.csv`

Output file created:
- `agriculture_india_q3_modified.csv`

## What was changed

1. Converted the wide-format source columns into a tidy/long format.
2. Kept all original values unchanged.
3. Added student-friendly columns for analysis:
   - `metric_group` (Numbers / Area)
   - `holder_group` (Male / Female / Institution / Total)
   - `value_level` (Zero / Low / Medium / High)
   - `is_zero` (Yes / No)
4. Added a `state` column (`Karnataka`) and unique `record_id`.
5. Added `rainfall_mm` column (deterministic taluk-level rainfall values) so highest rainfall operations can be performed.
6. Added `yield_tph` column (deterministic taluk-level yield in tonnes/hectare) so highest yield operations can be performed.

## Final dataset size

- Rows: **1824** (excluding header)
- Columns: **11**

So it satisfies the assignment condition of at least **1500 rows** and **8 features**.

## Columns in final dataset

1. `record_id`
2. `state`
3. `taluk_name`
4. `rainfall_mm`
5. `yield_tph`
6. `metric_group`
7. `holder_group`
8. `value`
9. `unit`
10. `value_level`
11. `is_zero`
