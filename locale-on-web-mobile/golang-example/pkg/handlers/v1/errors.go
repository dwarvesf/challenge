package v1

import "errors"

var (
	errUnableToParseBody      = errors.New("unable_to_parse_request_body")
	errEmailIsInvalid         = errors.New("email_invalid")
	errInvalidEmailOrPassword = errors.New("invalid_email_or_password")
)
