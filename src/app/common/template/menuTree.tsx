'use client';

import { useEffect } from 'react';

interface MenuTreeProps {
    path: string;
    icon: string;
    label: string;
    children: React.ReactNode;
}

const MenuTree = (props: MenuTreeProps) => {
    useEffect(() => {
        console.log('🔍 MenuTree MOUNTED:', {
            label: props.label,
            icon: props.icon,
            path: props.path,
            hasChildren: !!props.children,
            childrenType: typeof props.children,
            children: props.children
        });
    }, [props.label, props.icon, props.path, props.children]);

    console.log('🔄 MenuTree RENDER:', props.label);

    return (
        <li className='treeview'> 
            <a href={props.path}> 
                <i className={`fa fa-${props.icon}`}></i> 
                <span>{props.label}</span>
                <i className='fa fa-angle-left pull-right'></i>
            </a>
            <ul className='treeview-menu'> 
                {props.children}
            </ul>
        </li>
    );
};

export default MenuTree;