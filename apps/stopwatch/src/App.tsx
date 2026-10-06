import { useTranslation } from 'react-i18next';
import { AppShell } from '@funzone/ui';
import { TimeTool } from './components/TimeTool';

export default function App() {
  const { t } = useTranslation();
  const help = { title: t('help.title'), items: t('help.items', { returnObjects: true }) as string[] };
  return (
    <AppShell appName="Stopwatch" accent="text-orange-300" help={help}>
      <TimeTool />
    </AppShell>
  );
}
