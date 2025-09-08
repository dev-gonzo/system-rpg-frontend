export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'COMMON.MENU.DASHBOARD', icon: 'mdi-home', route: '/' },
  { label: 'COMMON.MENU.GAME_GROUP', icon: 'mdi-table-furniture', route: '/game-group' },
  { label: 'COMMON.MENU.USUARIOS', icon: 'mdi-account', route: '/users' },
  { label: 'COMMON.MENU.ARQUIVOS', icon: 'mdi-folder', route: '/arquivos' },
  { label: 'COMMON.MENU.PROJETOS', icon: 'mdi-clipboard-text', route: '/projetos' },
];