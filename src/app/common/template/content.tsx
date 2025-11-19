interface contentProps {
    children: React.ReactNode
}
const Content = (props: contentProps) => {
    return (
        <section className='content'>{props.children}</section>
    )
}
//teste
export default Content;
