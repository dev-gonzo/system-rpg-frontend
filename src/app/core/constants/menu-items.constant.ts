export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'COMMON.MENU.DASHBOARD', icon: 'home', route: '/' },
  { label: 'COMMON.MENU.USUARIOS', icon: 'person', route: '/users' },
  { label: 'COMMON.MENU.ARQUIVOS', icon: 'folder', route: '/arquivos' },
  { label: 'COMMON.MENU.PROJETOS', icon: 'assignment', route: '/projetos' },
];