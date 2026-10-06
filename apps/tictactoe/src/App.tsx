import { useTranslation } from 'react-i18next';
import { AppShell } from '@funzone/ui';
import { Game } from './components/Game';

export default function App() {
  const { t } = useTranslation();
  const help = { title: t('help.title'), items: t('help.items', { returnObjects: true }) as string[] };
  return (
    <AppShell appName="Tic-Tac-Toe" accent="text-violet-300" help={help}>
      <Game />
    </AppShell>
  );
}
