import { useTranslation } from 'react-i18next';
import { AppShell } from '@funzone/ui';
import { SudokuGame } from './components/SudokuGame';

export default function App() {
  const { t } = useTranslation();
  const help = { title: t('help.title'), items: t('help.items', { returnObjects: true }) as string[] };
  return (
    <AppShell appName="Sudoku" accent="text-emerald-300" help={help}>
      <SudokuGame />
    </AppShell>
  );
}
