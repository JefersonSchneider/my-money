import Link from 'next/link';

interface MenuItemProps {
    path: string;
    icon: string;
    label: string;
}

const MenuItem = (props: MenuItemProps) => (
    <li> 
        <Link href={props.path}>
            <i className={`fa fa-${props.icon}`}></i> <span>{props.label}</span>
        </Link>
    </li>
);

export default MenuItem;