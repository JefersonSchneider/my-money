interface TabsContentProps {
    children: React.ReactNode
}

const TabsContent: React.FC<TabsContentProps> = ({ children }) => (
  <div className="tab-content">
    {children}
  </div>
);

export default TabsContent;
