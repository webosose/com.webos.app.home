import css from './Carousel.module.less';
const PageIndicator = ({ items, selectedIndex, onPageSelector }) => {

    return (
        <div className={css.pageIndicator_container}>
            {items.map((value, index) => {
                return <span key={index} className={index === selectedIndex ? css.pageselected : css.pageIndicator} data-index={index} onClick={onPageSelector} />
            })}
        </div>
    )
}

export default PageIndicator;