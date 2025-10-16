'use client';

import { useEffect } from 'react';
import MenuItem from "./menuItem";
import MenuTree from "./menuTree";

interface MenuProps {
}

const Menu = (props: MenuProps) => {
    useEffect(() => {
        console.log('📋 Menu MOUNTED');
    }, []);

    console.log('🔄 Menu RENDER');

    return (
        <ul className='sidebar-menu'>
            <MenuItem path='/' icon='dashboard' label='Dashboard' />
            <MenuTree label='Cadastros' icon='edit' path='#'>
                <MenuItem path='/billingCycles' icon='usd' label='Ciclo de Pagamentos' />
            </MenuTree>
        </ul>
    );
}

export default Menu;