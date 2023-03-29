## Golang i18next integration

Code Example: [Golang](./golang-example/README.md)

```bash
## Folder structure
├── cmd
│   └── server
├── data
│   ├── migrations
│   └── seed
├── locales
└── pkg
    ├── config
    ├── consts
    ├── entities
    ├── handlers
    │   └── v1
    ├── middleware
    ├── model
    ├── monitoring
    ├── repo
    ├── routes
    └── util
```

### Adding i18next

```go
// main.go or route setup file
// 1. install gin middleware
// go get -v github.com/gin-contrib/i18n

// 2. install yaml parser:
// go get -v gopkg.in/yaml.v3

import (
	"other package"
	"gopkg.in/yaml.v3"
	ginI18n "github.com/gin-contrib/i18n"
)

// initial i18n
r.Use(ginI18n.Localize(ginI18n.WithBundle(&ginI18n.BundleCfg{
		RootPath:         "./locales",
		AcceptLanguage:   []language.Tag{language.Vietnamese, language.English},
		DefaultLanguage:  language.English,
		// content parser, you can replace with `json.Unmarshal` or other parsers
		// if you want
		UnmarshalFunc:    yaml.Unmarshal,
		// the file extension name
		FormatBundleFile: "yaml",
	})))

```

### Define message code and use it

```go
// handler/v1/errors.go

package v1

import "errors"

// define error code so we can use it in i18n
var (
	errUnableToParseBody      = errors.New("unable_to_parse_request_body")
	errEmailIsInvalid         = errors.New("email_invalid")
	errInvalidEmailOrPassword = errors.New("invalid_email_or_password")
)

// ---------------------------------------------------------- //
// handler/v1/auth.go
package v1

import (
	"net/http"
	"net/mail"

	"github.com/dwarvesf/go-template/pkg/monitoring"
	ginI18n "github.com/gin-contrib/i18n"
	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
)

type LoginRequestBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login login user with email and pwd this method also set cookie
func (h *Handler) Login(c *gin.Context) {
	m := monitoring.FromContext(c.Request.Context())

	var body LoginRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		m.Errorf(err, "[handler.Login] ShouldBindJSON(&body)")
		c.JSON(http.StatusBadRequest, response{
			Error: ginI18n.MustGetMessage(errUnableToParseBody.Error())})
		return
	}

	if body.Email == "" || body.Password == "" {
		c.JSON(http.StatusBadRequest, response{
			Error: ginI18n.MustGetMessage(errInvalidEmailOrPassword.Error())})
		return
	}

	if _, err := mail.ParseAddress(body.Email); err != nil {
		c.JSON(http.StatusBadRequest, response{
			Error: ginI18n.MustGetMessage(&i18n.LocalizeConfig{
				MessageID: errEmailIsInvalid.Error(),
				TemplateData: map[string]string{
					"email": body.Email,
				},
			})})
		return
	}

c.JSON(http.StatusOK, response{
		Data: ginI18n.MustGetMessage(&i18n.LocalizeConfig{
			MessageID: "ok",
		}),
	})
}
```

### Locales folder example

```yaml
# file: locales/en.yaml
unable_to_parse_request_body: unable to parse request body
email_invalid: your "{{ .email }}" is invalid
invalid_email_or_password: email or password is invalid

# file: locales/vi.yaml
unable_to_parse_request_body: không thể xử lý nội dung của gói tin
email_invalid: định dạng email của bạn "{{ .email }}" ko hợp lệ
invalid_email_or_password: sai email hoặc mật khẩu
```
