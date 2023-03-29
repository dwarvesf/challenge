package v1

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Currency struct {
	ID           int64   `json:"id,omitempty"`
	Name         string  `json:"name,omitempty"`
	Symbol       string  `json:"symbol,omitempty"`
	Code         string  `json:"code,omitempty"`
	ExchangeRate float64 `json:"exchange_rate,omitempty"`
	Precision    int     `json:"precision,omitempty"`
}

// GetCurrencyList get lít of supported currency and exchange rate
func (h *Handler) GetCurrencyList(c *gin.Context) {

	data := []Currency{
		{
			ID:           1,
			Name:         "US Dollar",
			Symbol:       "$",
			Code:         "USD",
			ExchangeRate: 1,
			Precision:    2,
		},
		{
			ID:           2,
			Name:         "Vietnamese Dong",
			Symbol:       "đ",
			Code:         "VND",
			ExchangeRate: 23500,
			Precision:    0,
		},
	}

	c.JSON(http.StatusBadRequest, response{
		Data: data,
	})
}
