import React from 'react';
import { getClientWidth } from '../../util/util';
import css from './Carousel.module.less';
import PageIndicator from './PageIndicator';
class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slide: 0,
            size: props.size
        }
        this.swipeElement = React.createRef();
        this.xDown = null;
        this.yDown = null;
    }

    componentDidMount() {
        this.swipeElement.current.addEventListener('touchstart', this.handleTouchStart);
        this.swipeElement.current.addEventListener('touchmove', this.handleTouchMove);
        // this.swipeElement.current.addEventListener('mousedown', this.handleTouchStart);
        // this.swipeElement.current.addEventListener('mousemove', this.handleTouchMove);
    }
    componentWillUnmount() {
        this.swipeElement.current.removeEventListener('touchstart', this.handleTouchStart);
        this.swipeElement.current.removeEventListener('touchmove', this.handleTouchMove);
        // this.swipeElement.current.removeEventListener('mousedown', this.handleTouchStart);
        // this.swipeElement.current.removeEventListener('mousemove', this.handleTouchMove);
    }


    getTouches = (evt) => {
        return evt.touches || [{ clientX: evt.clientX, clientY: evt.clientY }]
    }

    handleTouchStart = (evt) => {
        const firstTouch = this.getTouches(evt)[0];
        this.xDown = firstTouch.clientX;
        this.yDown = firstTouch.clientY;
    };

    handleTouchMove = (evt) => {
        if (!this.xDown || !this.yDown) {
            return;
        }
        const xUp = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const yUp = evt.touches ? evt.touches[0].clientY : evt.clientY;

        const xDiff = this.xDown - xUp;
        const yDiff = this.yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {
                /* right swipe */
                this.increment()
            } else {
                /* left swipe */
                this.decrement()
            }
        }
        /* reset values */
        this.xDown = null;
        this.yDown = null;
    };
    increment = () => {
        if (this.state.slide < this.props.children.length - 1) {
            this.setState(previousState => ({
                slide: previousState.slide + 1,
                animation: true
            }));
        }

    }
    decrement = () => {
        if (this.state.slide > 0) {
            this.setState(previousState => ({
                slide: previousState.slide - 1,
                animation: true
            }));
        }
    }
    onPageSelectorHandler = (ev) => {
        this.setState({ slide: parseInt(ev.currentTarget.getAttribute('data-index')) })
    }
    render() {
        const { slide, animation } = this.state;
        const carousel_wrapper = animation ? css.carousel_wrapper : css.carousel_wrapper_noAnimtion
        return (
            <>
                <div className={css.carousel_container}>
                    <div className={carousel_wrapper} style={{ 'left': '-' + (slide * getClientWidth()) + 'px' }}>
                        <div className={css.carousel_swipble} ref={this.swipeElement}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <PageIndicator items={Array.from(this.props.children, (element, index) => index)} selectedIndex={slide} onPageSelector={this.onPageSelectorHandler} />
            </>
        )
    }
    static getDerivedStateFromProps(props, state) {
        if (props.size !== state.size) {
            return { slide: 0, animation: false, size: props.size };
        }
        return null;
    }

}

export default Carousel;