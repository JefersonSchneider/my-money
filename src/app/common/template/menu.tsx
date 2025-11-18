'use client';

import MenuItem from "./menuItem";
import MenuTree from "./menuTree";

interface MenuProps {
}

const Menu = (props: MenuProps) => {
    return (
        <ul className='sidebar-menu'>
            <MenuItem path='/dashboard' icon='dashboard' label='Dashboard' />
            <MenuTree label='Cadastros' icon='edit' path='#'>
                <MenuItem path='/billingCycle' icon='usd' label='Ciclo de Pagamentos' />
            </MenuTree>
        </ul>
    );
}

export default Menu;