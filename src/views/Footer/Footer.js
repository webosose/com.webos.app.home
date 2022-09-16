import { useCallback, useEffect, useState } from 'react';
import css from './Footer.module.less';
import launchpad from '../../../assets/launchpad.png';
import { useDispatch, useSelector } from 'react-redux';
import Image from '@enact/sandstone/Image';
import AppBarSettings from '../../components/AppBarSettings/AppBarSettings';
import AppIcon from '../../components/AppIcon/AppIcon';
import Popup from '@enact/sandstone/Popup';
import Button from '@enact/sandstone/Button';
import Heading from '@enact/sandstone/Heading';
import BodyText from '@enact/sandstone/BodyText';
import Scroller from '@enact/sandstone/Scroller';
import { CLEAR_APPBAR_EDIT, HIDE_ALERT, SET_APPBAR_EDIT } from '../../actions/actionNames';
import deleteApp from '../../actions/deleteApp';
import AddedApps from '../../components/AddedApps/AddedApps';

let delay;
let longPressEvent = false;
const DEFAULT_APPS_IDS = ['com.webos.app.videocall', 'com.webos.app.enactbrowser', 'com.palm.app.settings']
const Footer = ({ onLaunchPadHandler }) => {
    const appList = useSelector(state => state.appList);
    const appNames = useSelector(state => state.appNames);
    const runningAppsNames = useSelector(state => state.runningApps);
    const appBarAlign = useSelector(state => state.appBarAlign);
    const appAlert = useSelector(state => state.appAlert);
    const showEdit = useSelector(state=>state.editStatus.appBar);

    //apps
    const [defaultApps, setDefaultApps] = useState([]);
    const [addedApps, setAddedApps] = useState([]);
    const [runningApps, setRunningApps] = useState([]);


    const dispatch = useDispatch();

    const removeEdit = useCallback(() => {
        if (!longPressEvent) {
            dispatch({ type: CLEAR_APPBAR_EDIT })
        }
    }, [dispatch]);

    let longpress = 500;
    const mouseDownHandler = useCallback(() => {
        longPressEvent = false;
        delay = setTimeout(() => {
            dispatch({ type: SET_APPBAR_EDIT })
            longPressEvent = true;
        }, longpress);
    }, [dispatch, longpress])
    const mouseUpHandler = useCallback(() => {
        clearTimeout(delay);
    }, [])

    const noHandler = useCallback(() => {
        dispatch(({
            type: HIDE_ALERT
        }));
    }, [dispatch])
    const yesHandler = useCallback(() => {
        dispatch(({
            type: HIDE_ALERT
        }));
        dispatch(deleteApp(appAlert.id))
    }, [dispatch, appAlert]);
    useEffect(() => {
        let timer = 0;
        if (appAlert.autoClose) {
            timer = setTimeout(() => {
                dispatch(({
                    type: HIDE_ALERT
                }));
            }, 5000)
        }
        return () => {
            clearTimeout(timer);
        }
    }, [dispatch, appAlert])
    useEffect(() => {
        const _defaultApps = []
        appList.forEach((v) => {
            if (v.default) {
                _defaultApps.push({
                    src: 'file:' + v.icon,
                    id: v.id,
                    running: v.running
                });
            }
        })
        const apps = DEFAULT_APPS_IDS.map((value) => {
            return _defaultApps.find(element => element.id === value);
        })
        setDefaultApps(appBarAlign === 'left' ? apps : apps.reverse());
    }, [appList, appBarAlign]);
    useEffect(() => {
        const _addedApps = [];
        appList.forEach((v) => {
            if (!v.default && appNames.indexOf(v.id) > -1) {
                _addedApps.push({
                    src: 'file:' + v.icon,
                    id: v.id,
                    running: v.running,
                    title: v.title,
                    defaultapp: v.default ? 1 : 0,
                    removable: v.removable
                });
            }
        });
        setAddedApps(appBarAlign === 'left' ? _addedApps : _addedApps.reverse());

    }, [appList, appBarAlign, appNames]);
    useEffect(() => {
        const _runningApps = []
        appList.forEach((v) => {
            if (!v.default && appNames.indexOf(v.id) <= -1 && runningAppsNames.indexOf(v.id) > -1) {
                _runningApps.push({
                    src: 'file:' + v.icon,
                    id: v.id,
                    running: true,
                    title: v.title,
                    edit: showEdit ? 1 : 0,
                    defaultapp: v.default ? 1 : 0,
                    removable: v.removable
                });
            }
        })
        setRunningApps(appBarAlign === 'left' ? _runningApps : _runningApps.reverse());

    }, [appList, appBarAlign, appNames, runningAppsNames, showEdit]);
    const datacollectionHandler = useCallback(()=>{
        window.PalmSystem.PmLogString(6, 'DATA_COLLECTION', '{ "main":"com.webos.app.home", "sub": "appbar", "event": "click", "extra": { "clickeditem":"appBarSettings" }}', '');
    },[])
    const settingsIcon = appBarAlign === 'left' ? css.setting_icon : css.setting_icon_right;
    const footerCnt = appBarAlign === 'left' ? css.footer_ctn : css.footer_ctn + " " + css.footer_ctn_right;
    const footerscrooler = appBarAlign === 'left' ? css.footerscrooler : css.footerscrooler_right;

    return (
        <div className={footerCnt}
            onTouchStart={mouseDownHandler}
            onTouchEnd={mouseUpHandler}
            onClick={removeEdit}>
            <div>
                <Image src={launchpad} className={css.icon} onClick={onLaunchPadHandler} />
            </div>
            <div className={css.defaultApps}>
                {defaultApps.map((v, index) => <AppIcon key={index} {...v} />)}
            </div>
            <AddedApps apps={addedApps} />
            <div key={appList.length + 1} className={css.divider}>|</div>

            <div className={css.footerscrooler_cnt}>
                <Scroller direction='horizontal'>
                    <div className={footerscrooler}>
                        {runningApps.map((v, index) => <AppIcon key={index} {...v} />)}
                    </div>
                </Scroller>
            </div>
            <div className={settingsIcon}  onClick={datacollectionHandler}>
                <div key={appList.length + 1} className={css.divider}>|</div>
                <AppBarSettings />
            </div>

            <Popup
                open={appAlert.show}
                noAnimation
                position='center'
                onClose={noHandler}>
                <Heading>{appAlert.title}</Heading>
                <BodyText>{appAlert.message}</BodyText>
                {appAlert.showButtons ? <><Button onClick={noHandler}>No</Button>
                    <Button onClick={yesHandler}>Yes</Button></> : ''}

            </Popup>
        </div>
    )
}

export default Footer;