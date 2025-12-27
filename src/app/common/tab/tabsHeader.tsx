interface TabsHeaderProps {
    children: React.ReactNode
}

const TabsHeader: React.FC<TabsHeaderProps> = ({ children }) => (
  <ul className="nav nav-tabs">
    {children}
  </ul>
);

export default TabsHeader;
