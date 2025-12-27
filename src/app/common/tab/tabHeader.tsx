import { Component } from 'react';

interface TabHeaderProps {
    target: string;
    icon: string;
    label: string;
}

class TabHeader extends Component<TabHeaderProps> {
    render() {
        return (
            <li className="nav-item">
                <a href="#"
                    data-toggle="tab"
                    data-target={this.props.target}
                >
                    <i className={`fa fa-${this.props.icon}`}></i>{this.props.label}
                </a>
            </li>
        )
    }
}
export default TabHeader;