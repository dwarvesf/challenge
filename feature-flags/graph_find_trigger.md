graph TD

A[Input condition array] -->|userid, age, gender| B(Loop in array and get true condition)

B --> C[List true condition ids]

C -->|match with condition ids in triggers_conditions table| D[All unique trigger ids]

D -->|Loop all trigger ids| E[Triggers]

E -->|Loop all filtered trigger ids| F[Unique feature flag ids]