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
