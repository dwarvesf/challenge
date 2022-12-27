package middleware

import (
	"github.com/gin-gonic/gin"
)

func WithLangKey() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		lang := ctx.Request.Header.Get("Accept-Language")
		if lang == "" {
			lang = ctx.Request.URL.Query().Get("lang")
		}
		if lang == "" {
			lang = "en"
		}

		ctx.Set("lang", lang)

		ctx.Next()
	}
}
