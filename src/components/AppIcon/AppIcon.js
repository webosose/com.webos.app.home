

import kind from '@enact/core/kind';
import ContextualPopupDecorator from '@enact/sandstone/ContextualPopupDecorator';
import Heading from '@enact/sandstone/Heading';
import Switch from '@enact/sandstone/Switch';
import { useCallback, useState } from 'react';


import css from './AppIcon.module.less';

import Image from '@enact/sandstone/Image';

import { useDispatch, useSelector } from 'react-redux';
import { addAppName, deleteAppName } from '../../actions/registerKind';
import launchAction from '../../actions/launchAction';
import { DELETE_APP, SHOW_ALERT } from '../../actions/actionNames';
import Button from '@enact/sandstone/Button';
import closeAppAction from '../../actions/closeAppAction';
import Scrim from '../Scrim/Scrim';
const IconButton = kind({
    name: 'AppIcon',
    render: (props) => {
        const { source, runningapps, id, edit, onClick, defaultapp } = props;
        delete props.onClick
        return <div  {...props} className={source === 'launchpad' ? css.icon_cnt : css.icon_cnt_s}>
            <Image src={props.src} onClick={onClick} className={source === 'launchpad' ? css.icon : css.icon_small} />
            {source === 'launchpad' ? <Heading marqueeOn='hover' css={css} className={css.title}>{props.title}</Heading> : ''}
            {edit && !defaultapp ? <span className={css.edit} onClick={onClick}>-</span> : ''}
            {source !== 'launchpad' && runningapps.indexOf(id) > -1 ? <span className={css.running} /> : ''}
        </div>

    }
});

const MenuPopupButton = ContextualPopupDecorator(IconButton);

const AppIcon = ({ src, title, edit, id, source, running, defaultapp, removable }) => {
    const [isOpened, setIsOpened] = useState(false);
    const runningApps = useSelector(state => state.runningApps);
    const dispatch = useDispatch();
    const appNames = useSelector(state => state.appNames);
    const closeMenu = useCallback(() => {
        setIsOpened(false)
    }, []);
    const menuClick = useCallback((event) => {
        event.stopPropagation()
    }, [])
    const deleteAppHandler = useCallback((value) => {
        if (value.selected) {
            closeMenu();
            dispatch(deleteAppName(id));
        }
    }, [dispatch, id, closeMenu])
    const addAppHandler = useCallback((value) => {
        if (value.selected) {
            closeMenu();
            dispatch(addAppName(id));
        }
    }, [dispatch, closeMenu, id]);
    const closeApp = useCallback(() => {
        dispatch(closeAppAction(id));
    },[dispatch,id])
    const deleteApp = useCallback((value) => {
        if (value.selected) {
            closeMenu();
            dispatch(({
                type: SHOW_ALERT,
                payload: {
                    id,
                    title,
                    type: DELETE_APP,
                    message: 'Are you sure you want to delete this app ?'
                }
            }));
        }
    }, [dispatch, id, closeMenu, title]);
    const renderItmes = useCallback(() => {
        let item = <div className={css.switchItemcontainer}>
            <Switch className={css.radio} onToggle={deleteAppHandler} />
            <p className={css.label}>Delete(App Bar)</p>
        </div>
        if (source === 'launchpad') {
            // if (appNames.length >= 8 && appNames.indexOf(id) <= -1) {
            //     item = <div className={css.switchItemcontainer}>
            //         <p className={css.label}>Max Limit reached</p>
            //     </div>
            // } else
             if (appNames.indexOf(id) <= -1) {
                item = <div className={css.switchItemcontainer}>
                    <Switch className={css.radio} onToggle={addAppHandler} />
                    <p className={css.label}>Add to App Bar</p>
                </div>
            }
        } else if (running) {
            item = <div className={css.switchItemcontainer}>
                <Switch className={css.radio} onToggle={addAppHandler} />
                <p className={css.label}>Add to App Bar</p>
            </div>
        }
        return item;
    }, [appNames, addAppHandler, deleteAppHandler, id, running, source])
    const renderPopup = useCallback(() => (
        <div onClick={menuClick}>
            <div className={css.menuContainer} >
                <div className={css.closeIconCtn}>
                    <Heading size='small' className={css.popuptitle} >{title}</Heading>
                    <Button className={css.closeIconCtnIcon} backgroundOpacity="transparent"
                        size="small"
                        icon="closex" onClick={closeMenu} />
                </div>
                {renderItmes()}
                {removable ? <div className={css.switchItemcontainer}>
                    <Switch className={css.radio} onToggle={deleteApp} />
                    <p className={css.label}>Delete App</p>
                </div> : ''}
                {running ? <div className={css.switchItemcontainer}>
                    <Switch className={css.radio} onToggle={closeApp} />
                    <p className={css.label}>Close App</p>
                </div> : ''}
            </div>
            <Scrim closeMenu={closeMenu}/>
        </div>
    ), [deleteApp,closeApp, menuClick, removable, renderItmes, title,closeMenu,running]);
    const clickMenu = useCallback((event) => {
        event.stopPropagation()
        if (edit && !defaultapp) {
            setIsOpened(true)
        } else {
            dispatch(launchAction(id));
        }

    }, [edit, dispatch, id,defaultapp]);
    return (
        <MenuPopupButton
            onClick={clickMenu}
            // onToggle={}
            onClose={closeMenu}
            open={isOpened}
            title={title || id}
            id={id}
            src={src}
            edit={edit ? 1 : 0}
            source={source}
            defaultapp={defaultapp ? 1 : 0}
            runningapps={runningApps}
            popupComponent={renderPopup}
            noAutoDismiss={false}
            size="samll"
            popupClassName={css.test}
        />
    );
}

export default AppIcon;
