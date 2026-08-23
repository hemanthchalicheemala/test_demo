# COVID-19 Indian-Style Dataset Notes

Dataset file: `covid19_india_patient_dataset.csv`

This dataset is designed for your Experiment-3 style tasks:

- Contains both numeric and character columns for vector operations
- Uses Indian patient names, states, and districts
- Includes fever values where many entries are above 97°F
- Includes children (`age < 18`) and elderly (`age >= 60`) records
- Does not include a final COVID decision column by default (so you can create it)

## Column summary

- `patient_id` - Unique patient code
- `patient_name` - Indian-style patient name
- `age` - Age in years
- `gender` - Gender category
- `state` - Indian state
- `district` - Indian district/city
- `occupation` - Occupation/category
- `fever_f` - Body temperature in Fahrenheit
- `cough` - Yes/No
- `sore_throat` - Yes/No
- `spo2` - Oxygen saturation percentage
- `travel_history` - None / Domestic / International
- `vaccination_doses` - Number of vaccine doses
- `comorbidity` - Health condition or None

## Suggested decision rule (example)

You can create a new `covid_status` column as:

- `Positive` if `fever_f >= 100` and (`cough == "Yes"` or `sore_throat == "Yes"`) and `spo2 <= 95`
- Otherwise `Negative`

This rule will help you complete:

- High fever labeling (`fever_f > 97`)
- Child COVID positive name extraction
- Elderly COVID negative name extraction
- Appending new rows after last record
