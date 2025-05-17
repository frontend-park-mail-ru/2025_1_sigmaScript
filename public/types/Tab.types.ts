export type TabData = {
  id: string;
  label: string;
  onClick?: (tabId: string) => void;
};

export type TabsData = {
  id: string;
  tabsData: TabData[];
  onTabChange?: (tabId: string) => void;
};
