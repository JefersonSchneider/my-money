import { Component } from 'react';

interface TabContentProps {
    id: string;
    tab: { selected: string };
    children: React.ReactNode;
}

class TabContent extends Component<TabContentProps> {
    render() {
        const selected = this.props.tab.selected === this.props.id; 
        return (
           <div id={this.props.id}
               className={`tab-pane ${selected ? 'active' : ''}`}>
               {this.props.children}
           </div>
        )
    }
}
export default TabContent;