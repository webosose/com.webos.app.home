import kind from '@enact/core/kind';
import ContextualPopupDecorator from '@enact/sandstone/ContextualPopupDecorator';
import Heading from '@enact/sandstone/Heading';

import {useCallback, useState } from 'react';
import css from './AppSorting.module.less';
import Icon from '@enact/sandstone/Icon';
import Item from '@enact/sandstone/Item';
import Button from '@enact/sandstone/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addSortType } from '../../actions/registerKind';
import Scrim from '../Scrim/Scrim';
const SortIcon = kind({
    name: 'SortIcon',
    render: (props) => (
        <Icon
            {...props}>verticalellipsis</Icon>
    )
});

const MenuPopupButton = ContextualPopupDecorator(SortIcon);
const AppSorting = () => {
    const [isOpened, setIsOpened] = useState(false);
    const sortType = useSelector(state => state.sortType);
    const dispatch = useDispatch();
    const menuClick = useCallback((event) => {
        event.stopPropagation()
    }, [])
    const onAsendingOrderHandler = useCallback(() => {
        dispatch(addSortType('a_to_z'));
        setIsOpened(false)
    }, [dispatch])
    const onDsendingOrderHandler = useCallback(() => {
        dispatch(addSortType('z_to_a'));
        setIsOpened(false)
    }, [dispatch])
    const closeMenu = useCallback(() => {
        setIsOpened(false)
    }, []);
    const renderPopup = useCallback(() => (
        <div onClick={menuClick}>
            <div className={css.menuContainer} >
                <div className={css.closeIconCtn}>
                <Heading size='small' className={css.header}>App Sorting</Heading>
                    <Button className={css.closeIconCtnIcon} backgroundOpacity="transparent"
                        size="large"
                        icon="closex" onClick={closeMenu} />
                </div>
                <Item className={sortType === 'a_to_z' ? css.selected :''} onClick={onAsendingOrderHandler}>Alphabetical[A.Z]</Item>
                <Item className={sortType === 'z_to_a' ? css.selected :''} onClick={onDsendingOrderHandler}>Alphabetical[Z.A]</Item>
            </div>
            <Scrim closeMenu={closeMenu}/>
        </div>
    ), [menuClick,sortType,onAsendingOrderHandler,onDsendingOrderHandler,closeMenu]);

    const toggleMenu = useCallback((event) => {
        event.stopPropagation()
        setIsOpened(true)
    }, []);


    return (
        <MenuPopupButton
            onClick={toggleMenu}
            onClose={closeMenu}
            open={isOpened}
            popupComponent={renderPopup}
            direction="above center"
        />
    );
}

export default AppSorting;
