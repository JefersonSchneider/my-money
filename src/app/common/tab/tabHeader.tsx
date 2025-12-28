import { Component } from 'react';

interface TabHeaderProps {
    icon: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

class TabHeader extends Component<TabHeaderProps> {
    handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
        return (
            <li className={`nav-item ${this.props.isActive ? 'active' : ''}`}>
                <a href="#"
                    onClick={this.handleClick}
                >
                    <i className={`fa fa-${this.props.icon}`}></i>{this.props.label}
                </a>
            </li>
        )
    }
}
export default TabHeader;