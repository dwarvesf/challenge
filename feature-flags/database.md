//// -- LEVEL 1
//// -- Schemas, Tables and References

// Creating tables
// Manage feature flag by user role / user group



//----------------------------------------------//

// Enum for 'flag status' table below
Enum feature_flags.flag_status {
  disable
  enable
}

Table feature_flags.flags as F {
  id uuid
  name varchar [not null, unique]
  key varchar [not null, unique]
  status feature_flags.flag_status
  applied_at datetime [note: 'When this permission will be applied']
  expired_at datetime [note: 'When this permission will be disabled']
  description varchar
  created_at datetime [default: `now()`]
  updated_at datetime [default: `now()`]
}

Enum feature_flags.variable_types {
  string
  number
  array
  object
}

Table feature_flags.variables as V {
  id uuid
  name varchar [not null, unique]
  key varchar [not null, unique]
  description text
  variable_types feature_flags.variable_types
}

// Enum for 'condition types' table below
Enum feature_flags.condition_types {
  equals
  contains
  starts_with
  ends_with
  matches_regex
  matches_regex_ignore_case
  does_not_equal
  does_not_contain
  does_not_start_with
  does_not_end_with
  does_not_matches_regex
  does_not_matches_regex_ignore_case
  less_than
  less_than_or_equal_to
  greater_than
  greater_than_or_equal_to
}

Table feature_flags.conditions as C {
  id uuid
  name varchar [not null, unique]
  variable_id uuid  [ref: > V.id]
  description text
  condition_type feature_flags.condition_types
  value varchar [note: 'This can be plain text or json string array']
}


Table feature_flags.triggers as T {
  id uuid
  name varchar [not null, unique]
  description text
}

// Trigger will be active when ALL CONDITIONS are true
Table feature_flags.triggers_contiditions {
  trigger_id uuid  [ref: > T.id]
  condition_id uuid  [ref: > C.id]
}


// Flag will be enable when one of triggers is active
Table feature_flags.flags_triggers {
  feature_flag_id uuid  [ref: > F.id] // inline relationship (many-to-many)
  trigger_id uuid  [ref: > T.id]
}