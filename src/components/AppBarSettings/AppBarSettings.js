

import kind from '@enact/core/kind';
import ContextualPopupDecorator from '@enact/sandstone/ContextualPopupDecorator';
import Heading from '@enact/sandstone/Heading';

import { useCallback, useState } from 'react';


import css from './AppBarSettings.module.less';
import RadioItem from '@enact/sandstone/RadioItem';
import settings from '../../../assets/settings.png';
import Image from '@enact/sandstone/Image';
import Group from '@enact/ui/Group';
import Button from '@enact/sandstone/Button';
import { useDispatch, useSelector } from 'react-redux';
import { changeAppBarView, changeAppBarViewAlign } from '../../actions/registerKind';
import Scrim from '../Scrim/Scrim';
import { SHOW_APP } from '../../actions/actionNames';
const MenuIconButton = kind({
    name: 'SettingsIcon',
    render: (props) => {
        return <Image src={settings} {...props} className={css.icon} />
    }
});

const MenuPopupButton = ContextualPopupDecorator(MenuIconButton);

const AppBarSettings = () => {
    const [isOpened, setIsOpened] = useState(false);
    const appBarShow = useSelector(state => state.appBarShow);
    const appBarAlign = useSelector(state => state.appBarAlign);
    const dispatch = useDispatch();
    const closeMenu = useCallback(() => {
        setIsOpened(false);
    }, []);
    const menuClick = useCallback((event) => {
        event.stopPropagation()
    }, [])
    const onSelectAppBarView = useCallback((value) => {
        const appShow = value.data === 'Visible';
        dispatch(changeAppBarView(appShow))
        if(!appShow){
            setIsOpened(false)
            dispatch({
				type: SHOW_APP,
				payload: false
			});
        }
    }, [dispatch])
    const onSelectAlign = useCallback((value) => {
        setIsOpened(false)
        dispatch(changeAppBarViewAlign(value.data))
    }, [dispatch])
    const renderPopup = useCallback(() => (
        <div onClick={menuClick}>
            <div className={css.menuContainer} >
                <div className={css.closeIconCtn}>
                    <Heading size='small' className={css.header}>App Bar Options Settings</Heading>
                    <Button className={css.closeIconCtnIcon} backgroundOpacity="transparent"
                        size="small"
                        icon="closex" onClick={closeMenu} />
                </div>
                <p>App Bar View</p>
                <Group
                    childComponent={RadioItem}
                    itemProps={{ inline: true, className: css.inlineGroupItem }}
                    select="radio"
                    selectedProp="selected"
                    defaultSelected={appBarShow ? 0 : 1}
                    onSelect={onSelectAppBarView}
                    className={css.groupcontainer}
                >
                    {[
                        'Visible',
                        'Hidden'
                    ]}
                </Group>
                <p>Aligh Select</p>
                <Group
                    childComponent={RadioItem}
                    itemProps={{ inline: true, className: css.inlineGroupItem }}
                    select="radio"
                    selectedProp="selected"
                    defaultSelected={appBarAlign === 'left' ? 0 : 1}
                    onSelect={onSelectAlign}
                    className={css.groupcontainer}
                >
                    {[
                        'left',
                        'right'
                    ]}
                </Group>
            </div>
            <Scrim closeMenu={closeMenu}/>
        </div>
    ), [closeMenu,menuClick,appBarAlign, appBarShow,onSelectAlign,onSelectAppBarView]);

    const toggleMenu = useCallback(() => {
        setIsOpened(true)
    }, []);


    return (
        <MenuPopupButton
            onClick={toggleMenu}
            onClose={closeMenu}
            open={isOpened}
            popupComponent={renderPopup}
            size="samll"
            direction="above center"
            noAutoDismiss={false}
        />
    );
}

export default AppBarSettings;
