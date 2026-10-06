import { useTranslation } from 'react-i18next';
import { AppShell } from '@funzone/ui';
import { MemoryGame } from './components/MemoryGame';

export default function App() {
  const { t } = useTranslation();
  const help = { title: t('help.title'), items: t('help.items', { returnObjects: true }) as string[] };
  return (
    <AppShell appName="Memory" accent="text-sky-300" help={help}>
      <MemoryGame />
    </AppShell>
  );
}
