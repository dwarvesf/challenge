package v1

import (
	"net/http"

	"github.com/dwarvesf/go-template/pkg/util"
	"github.com/gin-gonic/gin"
	"golang.org/x/text/language"
)

type Product struct {
	ID               int64 `json:"id"`
	Title            string
	CurrencySymbol   string
	Currency         string
	ConversationRate Currency
	Price            float64
	FormattedPrice   string
}

// GetProducts login user with email and pwd this method also set cookie
func (h *Handler) GetProducts(c *gin.Context) {
	// for display the currency
	lang := c.Request.Header.Get("Accept-Language")
	if lang == "" {
		lang = "en-US"
	}
	lng, _ := language.Parse(lang)

	// currencyCode := c.Request.Header.Get("X-Currency-Code")
	// get currency base on selected currency code
	currency := Currency{
		Symbol:       "đ",
		Code:         "VND",
		ExchangeRate: 23500,
		Precision:    0,
	}

	data := []Product{
		{
			ID:               1,
			Title:            "Apple",
			Price:            3.99,
			CurrencySymbol:   "$",
			Currency:         "USD",
			ConversationRate: currency,
		},
		{
			ID:               2,
			Title:            "Orange",
			Price:            3.99,
			CurrencySymbol:   "$",
			Currency:         "USD",
			ConversationRate: currency,
		},
	}

	for idx := range data {
		data[idx].FormattedPrice, _ = util.FormatCurrency(data[idx].Price*currency.ExchangeRate, currency.Code, lng)
	}

	c.JSON(http.StatusBadRequest, response{
		Data: data,
	})
}
