package util

import (
	"golang.org/x/text/currency"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

func FormatCurrency(amount float64, currencyCode string, langCode language.Tag) (string, error) {
	p := message.NewPrinter(language.English)
	unit, err := currency.ParseISO(currencyCode)
	if err != nil {
		return "", err
	}

	return p.Sprintf("%d", currency.Symbol(unit.Amount(amount))), nil
}
