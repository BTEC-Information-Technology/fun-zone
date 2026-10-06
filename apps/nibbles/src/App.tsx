import { useState } from 'react';
import { AppShell } from '@funzone/ui';
import { AppBar, type Page } from './components/AppBar';
import { GameScreen } from './components/GameScreen';
import { HelpPage } from './pages/HelpPage';

export default function App() {
  const [page, setPage] = useState<Page>('play');

  return (
    <AppShell appName="Nibbles" accent="text-green-400" header={<AppBar page={page} onNavigate={setPage} />}>
      {page === 'play' ? <GameScreen /> : <HelpPage />}
    </AppShell>
  );
}
