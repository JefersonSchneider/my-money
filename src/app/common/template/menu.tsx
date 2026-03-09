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
                <MenuItem path='/receitas' icon='plus-circle' label='Receitas' />
                <MenuItem path='/despesas' icon='minus-circle' label='Despesas' />
            </MenuTree>
        </ul>
    );
}

export default Menu;