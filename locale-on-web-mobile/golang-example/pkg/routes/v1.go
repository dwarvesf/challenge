package routes

import (
	"github.com/dwarvesf/go-template/pkg/config"
	v1 "github.com/dwarvesf/go-template/pkg/handlers/v1"
	"github.com/dwarvesf/go-template/pkg/middleware"
	"github.com/gin-gonic/gin"
)

// NewRoutes ...
func NewRoutes(r *gin.Engine, cfg config.Config, h *v1.Handler) *gin.Engine {

	v1 := r.Group("/api/v1")
	v1.Use(middleware.WithAuthContext(cfg))

	groupAuth := v1.Group("/auth")
	{
		groupAuth.POST("/login", h.Login)
	}

	groupCurrency := v1.Group("/currencies")
	{
		groupCurrency.GET("", h.GetCurrencyList)
	}

	groupProducts := v1.Group("/products")
	{
		groupProducts.GET("", h.GetProducts)
	}

	return r
}
