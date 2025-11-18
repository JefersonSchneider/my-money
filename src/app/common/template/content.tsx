interface contentProps {
    children: React.ReactNode
}
const Content = (props: contentProps) => {
    return (
        <section className='content'>{props.children}</section>
    )
}

export default Content;
