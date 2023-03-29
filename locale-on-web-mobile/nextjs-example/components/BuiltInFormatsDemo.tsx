import { useTranslation } from 'next-i18next';

const BuiltInFormatsDemo = () => {
  const { t } = useTranslation('built-in-demo');

  return (
    <div>
      <p>
        {/* "number": "Number: {{val, number}}", */}
        {t('number', {
          val: 12345.6789,
        })}
      </p>
      <p>
        {/* "currency": "Currency: {{val, currency}}", */}
        {t('currency', {
          val: 12345.6789,
          style: 'currency',
          currency: 'VND', // Unit from server side
        })}
      </p>

      <p>
        {/* "dateTime": "Date/Time: {{val, datetime}}", */}
        {t('dateTime', {
          val: new Date()
        })}
      </p>

      <p>
        {/* "relativeTime": "Relative Time: {{val, relativetime}}", */}
        {t('relativeTime', {
          val: 12,
          style: 'long',
        })}
      </p>

      <p>
        {/* "list": "List: {{val, list}}", */}
        {t('list', {
          // https://www.i18next.com/translation-function/objects-and-arrays#objects
          // Check the link for more details on `returnObjects`
          val: t('weekdays', { returnObjects: true }),
        })}
      </p>
    </div>
  );
};

export default BuiltInFormatsDemo;
