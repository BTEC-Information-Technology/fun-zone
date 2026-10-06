import { useTranslation } from 'react-i18next';
import { AppShell } from '@funzone/ui';
import { Board } from './components/Board';

export default function App() {
  const { t } = useTranslation();
  const help = { title: t('help.title'), items: t('help.items', { returnObjects: true }) as string[] };
  return (
    <AppShell appName="2048" accent="text-amber-400" help={help}>
      <Board />
    </AppShell>
  );
}
