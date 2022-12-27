## Statements

As a product owner I want to expand my app to multiple users across the globes so that I can have more revenue returned

## Requirements

- The app need to support **multiple languages**.
- Adding translations should be easy
- Supports LTR and RTL text
- Data also should be translated
- The app needs to support multiple currencies
  - Multiple currency symbols
  - Multiple currency format
  - Dynamic conversion rate
- Multiple timezones, multiple timezone formats, DST support
- Integration & API
  - Api support locale by path or query param

## Tech stack

- Frontend: NextJS, React Native with `i18next` integration and Continuous Translation for a non-developer translators
- Backend: GoLang, NodeJS with `i18next` integration

### Example:

- [Golang + i18next](./golang-example/README.md)
- [NextJS + i18next](./nextjs-example/README.md)
- [ReactNative + i18next](./rn-example/README.md)
- [Continuous Translation](./continuous-translation.md)
