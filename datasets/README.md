## Generated datasets for Experiment-4

### 1) Diabetes early-warning (Logistic Regression)
- File: `diabetes_risk_dataset.csv`
- Columns:
  - `Patient_ID`
  - `Age`
  - `BMI`
  - `BloodPressure`
  - `Glucose`
  - `Insulin`
  - `Pregnancies`
  - `Outcome` (0 = not at risk, 1 = at risk)

#### Generalized version (recommended for model evaluation)
- File: `diabetes_risk_dataset_generalized.csv`
- Rows: 600
- Same columns as above
- Built with overlapping class patterns and random noise, so it is less likely to produce unrealistically perfect ROC-AUC.
- For proper evaluation, always compute ROC-AUC on a held-out test split, not on the same data used to train.

### 2) Road transport records (ID3 Decision Tree)
- File: `road_transport_records.csv`
- Rows: 50
- Columns:
  - `Road_ID`
  - `Length` (`Short`, `Medium`, `Long`)
  - `Numberof_Bends` (`Low`, `Moderate`, `High`)
  - `Trafficvolume` (`Low`, `Medium`, `High`)
  - `AccidentRisk` (`Low`, `Medium`, `High`)

#### Generalized version (recommended for model evaluation)
- File: `road_transport_records_generalized.csv`
- Rows: 600
- Same columns as above
- Built with class overlap and random label noise, so ID3 models are less likely to overfit and report unrealistically perfect performance.
