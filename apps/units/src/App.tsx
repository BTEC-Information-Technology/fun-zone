import { useTranslation } from 'react-i18next';
import { AppShell } from '@funzone/ui';
import { Converter } from './components/Converter';

export default function App() {
  const { t } = useTranslation();
  const help = { title: t('help.title'), items: t('help.items', { returnObjects: true }) as string[] };
  return (
    <AppShell appName="Unit Converter" accent="text-teal-300" help={help}>
      <Converter />
    </AppShell>
  );
}
