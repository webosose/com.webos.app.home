

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
import { CLEAR_APPBAR_EDIT, DELETE_APP, MAX_APPADD_LIMIT, SHOW_ALERT, SHOW_FEEDBACK } from '../../actions/actionNames';
import closeAppAction from '../../actions/closeAppAction';
import Scrim from '../Scrim/Scrim';

const renderIcon = (props) => {
    const { source, runningapps, id, edit, onClick, defaultapp, newlyAdded } = props;
    if (edit && source === 'launchpad') {
        return !defaultapp ? <span className={css.edit} onClick={onClick}>+</span> : ''
    } else if (edit && source !== 'launchpad') {
        if(defaultapp && runningapps.indexOf(id) > -1){
            return <span className={css.edit + " " + css.edit_s} onClick={onClick}>-</span>
        }else if (newlyAdded) {
            return !defaultapp ? <span className={css.edit + " " + css.edit_s} onClick={onClick}>-</span> : ''
        } else {
            return !defaultapp  ? <span className={css.edit + " " + css.edit_s} onClick={onClick}>+</span> : ''
        }
    }
}

const IconButton = kind({
    name: 'AppIcon',
    render: (props) => {
        const { source, runningapps, id, onClick } = props;
        // delete props.onClick
        return <div  {...props} className={source === 'launchpad' ? css.icon_cnt : css.icon_cnt_s}>
            <Image src={props.src} onClick={onClick} className={source === 'launchpad' ? css.icon : css.icon_small} />
            {source === 'launchpad' ? <p className={css.title}>{props.title}</p> : ''}
            {renderIcon(props)}
            {/* {edit && !defaultapp ? <span className={source === 'launchpad' ? css.edit : css.edit + " " + css.edit_s} onClick={onClick}>+</span> : ''} */}
            {source !== 'launchpad' && runningapps.indexOf(id) > -1 ? <span className={css.running} /> : ''}
        </div>

    }
});



const MenuPopupButton = ContextualPopupDecorator(IconButton);

const AppIcon = ({ src, title, edit, id, source, defaultapp, removable,newlyAdded }) => {
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
            if (appNames.length >= 5) {
                dispatch(({
                    type: SHOW_ALERT,
                    payload: {
                        id,
                        title: "Added apps limit",
                        type: MAX_APPADD_LIMIT,
                        showButtons: false,
                        autoClose: true,
                        message: 'Maximum 5 apps can be added to the App bar'
                    }
                }));
            } else {
                dispatch(addAppName(id));
            }

        }
    }, [dispatch, closeMenu, id, appNames]);
    const closeApp = useCallback(() => {
        closeMenu()
        dispatch(closeAppAction(id,()=>{
            dispatch(({
                type: SHOW_FEEDBACK,
                payload: {title, id,show:true}
            }));
        }));
    }, [dispatch, id,closeMenu,title])
    const deleteApp = useCallback((value) => {
        if (value.selected) {
            closeMenu();
            dispatch(({
                type: SHOW_ALERT,
                payload: {
                    id,
                    title,
                    showButtons: true,
                    type: DELETE_APP,
                    message: 'Are you sure you want to delete this app ?'
                }
            }));
        }
    }, [dispatch, id, closeMenu, title]);
    const renderItmes = useCallback(() => {
        let item = <div className={css.switchItemcontainer_delete}>
            <Switch className={css.radio} onToggle={deleteAppHandler} />
            <p className={css.label}>Delete from App Bar</p>
        </div>
        // console.log(defaultapp+"    "+running+"  "+defaultapp);
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
        }else if(defaultapp){
            item = '';
        }else if(runningApps.indexOf(id) > -1 && appNames.indexOf(id) < 0 ){
            item = <div className={css.switchItemcontainer}>
                    <Switch className={css.radio} onToggle={addAppHandler} />
                    <p className={css.label}>Add to App Bar</p>
                </div>
        }
        return item;
    }, [appNames, addAppHandler, deleteAppHandler, id, source,defaultapp,runningApps])
    const renderPopup = useCallback(() => (
        <div onClick={menuClick}>
            <div className={css.menuContainer} >
                <div className={css.closeIconCtn}>
                    <Heading size='small' className={css.popuptitle} >{title}</Heading>
                    {/* <Button className={css.closeIconCtnIcon} backgroundOpacity="transparent"
                        size="small"
                        icon="closex" onClick={closeMenu} /> */}
                </div>
                {renderItmes()}
                {removable ? <div className={css.switchItemcontainer}>
                    <Switch className={css.radio} onToggle={deleteApp} />
                    <p className={css.label}>Delete App</p>
                </div> : ''}
                {runningApps.indexOf(id) > -1 ? <div className={css.switchItemcontainer}>
                    <Switch className={css.radio} onToggle={closeApp} />
                    <p className={css.label}>Close App</p>
                </div> : ''}
            </div>
            <Scrim closeMenu={closeMenu} />
        </div>
    ), [deleteApp, closeApp, menuClick, removable, renderItmes, title, closeMenu, runningApps,id]);
    const clickMenu = useCallback((event) => {
        event.stopPropagation()
        if (edit && (!defaultapp || runningApps.indexOf(id) > -1)) {
            setIsOpened(true)
        } else {
            if (source === "launchpad") {
                window.PalmSystem.PmLogString(6, 'DATA_COLLECTION', `{ "main":"com.webos.app.home", "sub": "launchpad", "event": "click", "extra": { "clickeditem":"${id}" }}`, '');
            } else {
                window.PalmSystem.PmLogString(6, 'DATA_COLLECTION', `{ "main":"com.webos.app.home", "sub": "appbar", "event": "click", "extra": { "clickeditem":"${id}" }}`, '');
            }
            dispatch(launchAction(id));
            dispatch({ type: CLEAR_APPBAR_EDIT })
        }

    }, [edit, dispatch, id, defaultapp, source,runningApps]);
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
            newlyAdded={newlyAdded}
        />
    );
}

export default AppIcon;
