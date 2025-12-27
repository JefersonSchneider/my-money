interface TabsProps {
    children: React.ReactNode
}

const Tabs: React.FC<TabsProps> = ({ children }) => (
  <div className="nav-tabs-custom">
    {children}
  </div>
);

export default Tabs;
