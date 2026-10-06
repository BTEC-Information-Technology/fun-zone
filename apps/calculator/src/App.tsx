import { useTranslation } from 'react-i18next';
import { AppShell } from '@funzone/ui';
import { Calculator } from './components/Calculator';

export default function App() {
  const { t } = useTranslation();
  const help = { title: t('help.title'), items: t('help.items', { returnObjects: true }) as string[] };
  return (
    <AppShell appName="Calculator" accent="text-cyan-300" help={help}>
      <Calculator />
    </AppShell>
  );
}
