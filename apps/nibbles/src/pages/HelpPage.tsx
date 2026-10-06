import { useTranslation } from 'react-i18next';

export function HelpPage() {
  const { t } = useTranslation();
  const rules = t('help.rules', { returnObjects: true }) as string[];

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-4 text-2xl font-semibold text-green-400">{t('help.title')}</h2>
      <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-neutral-200">
        {rules.map((r, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-green-500">•</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
