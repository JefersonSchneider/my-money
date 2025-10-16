import Menu from "./menu";


interface sideBarProps {

}

const SideBar = (props: sideBarProps) => (
    <aside className='main-sidebar'>
        <section className='sidebar'>
            <Menu/>
        </section>
    </aside>
)

export default SideBar;