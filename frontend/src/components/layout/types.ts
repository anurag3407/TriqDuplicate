// Layout component types
export interface HeaderProps {
  className?: string;
  showNotifications?: boolean;
  showSearch?: boolean;
}

export interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}
