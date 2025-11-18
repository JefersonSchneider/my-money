interface contentHeaderProps {
    title: string,
    small?: string
}
const ContentHeader = (props: contentHeaderProps) => {
    return (
        <section className='content-header'>
            <h1>{props.title} <small>{props.small}</small></h1>
        </section>
    )
}

export default ContentHeader;
