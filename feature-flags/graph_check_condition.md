graph TD

A[Get condition key] -->|Get money| B(Exist ?)

B --> |No|C{return false}

B -->|Yes| D[get condition type]

D --> E[is contain ?]

E -->|No| F[parse value]

E -->|Yes| G[is array in json string]

G -->|No| H[is containt text]

G -->|Yes| N[is include element]

F --> K[swtich case for condition type and compare]

K --> L[is match condition]

K --> |No|C[Return false]

L --> |Yes|I[Return true]

L -->|No| C

H -->|Yes| I[Return true]

H -->|No| C

N -->|Yes| I[Return true]

N -->|No| C