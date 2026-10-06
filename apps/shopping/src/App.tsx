import { useTranslation } from 'react-i18next';
import { AppShell } from '@funzone/ui';
import { ShoppingList } from './components/ShoppingList';

export default function App() {
  const { t } = useTranslation();
  const help = { title: t('help.title'), items: t('help.items', { returnObjects: true }) as string[] };
  return (
    <AppShell appName="Shopping Assistant" accent="text-lime-300" help={help}>
      <ShoppingList />
    </AppShell>
  );
}
