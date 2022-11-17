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
import { CLEAR_APPBAR_EDIT, HIDE_ALERT, HIDE_FEEDBACK, SET_APPBAR_EDIT } from '../../actions/actionNames';
import deleteApp from '../../actions/deleteApp';
import AddedApps from '../../components/AddedApps/AddedApps';
import Feedback from '../../components/Feedback/Feedback';

let delay;
let longPressEvent = false;
const DEFAULT_APPS_IDS = ['com.webos.app.videocall', 'com.webos.app.enactbrowser', 'com.palm.app.settings']
const Footer = ({ onLaunchPadHandler }) => {
    const appList = useSelector(state => state.appList);
    const appNames = useSelector(state => state.appNames);
    const runningAppsNames = useSelector(state => state.runningApps);
    const appBarAlign = useSelector(state => state.appBarAlign);
    const appAlert = useSelector(state => state.appAlert);
    const appFeedback = useSelector(state => state.appFeedback);
    const showEdit = useSelector(state => state.editStatus.appBar);
    const appBarEdit = useSelector(state => state.editStatus.appBar);
    //apps
    const [defaultApps, setDefaultApps] = useState([]);
    const [addedApps, setAddedApps] = useState([]);
    const [runningApps, setRunningApps] = useState([]);
    const [keyBoardShowing, setKeyBoardShowing] = useState(false);


    const dispatch = useDispatch();

    const removeEdit = useCallback(() => {
        if (!longPressEvent) {
            dispatch({ type: CLEAR_APPBAR_EDIT })
        }
    }, [dispatch]);
    useEffect(() => {
        document.addEventListener('keyboardStateChange', (event) => {
            if (event.visibility) {
                setKeyBoardShowing(event.visibility);
            } else {
                setTimeout(() => {
                    setKeyBoardShowing(event.visibility);
                }, 100)
            }

        });
    }, [])
    let longpress = 500;
    const mouseDownHandler = useCallback((event) => {
        if (event.touches.length === 1) {
            longPressEvent = false;
            delay = setTimeout(() => {
                dispatch({ type: SET_APPBAR_EDIT })
                longPressEvent = true;
            }, longpress);
        } else if (event.touches.length > 1) {
            clearTimeout(delay);
        }
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

    const onCloseFeedbackPage = useCallback(() => {
        if (!keyBoardShowing) {
            dispatch({
                type: HIDE_FEEDBACK
            });
        }

    }, [dispatch, keyBoardShowing])

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
                    title: v.title,
                    running: runningAppsNames.indexOf(v.id) > -1,
                    defaultapp: true
                });
            }
        })
        const apps = DEFAULT_APPS_IDS.map((value) => {
            return _defaultApps.find(element => element.id === value);
        })
        setDefaultApps(appBarAlign === 'left' ? apps : apps.reverse());
    }, [appList, appBarAlign, runningAppsNames]);
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
    const onScrollStart = useCallback(() => {
        clearTimeout(delay);
    }, [])
    const datacollectionHandler = useCallback(() => {
        window.PalmSystem.PmLogString(6, 'DATA_COLLECTION', '{ "main":"com.webos.app.home", "sub": "appbar", "event": "click", "extra": { "clickeditem":"appBarSettings" }}', '');
    }, [])
    const settingsIcon = appBarAlign === 'left' ? css.setting_icon : css.setting_icon_right;
    const footerCnt = appBarAlign === 'left' ? css.footer_ctn : css.footer_ctn + " " + css.footer_ctn_right;
    const footerscrooler = appBarAlign === 'left' ? css.footerscrooler : css.footerscrooler_right;
    // console.log("appFeedback ::", appFeedback)
    return (
        <div className={footerCnt}
            onTouchStart={mouseDownHandler}
            onTouchEnd={mouseUpHandler}
            onClick={removeEdit}>
            <div>
                <Image src={launchpad} className={css.icon} onClick={onLaunchPadHandler} />
            </div>
            <div className={css.defaultApps}>
                {defaultApps.map((v, index) => <AppIcon key={index} {...v} edit={appBarEdit} />)}
            </div>
            <AddedApps apps={addedApps} />
            <div key={appList.length + 1} className={css.divider}>|</div>

            <div className={css.footerscrooler_cnt}>
                <Scroller direction='horizontal' onScrollStart={onScrollStart}>
                    <div className={footerscrooler}>
                        {runningApps.map((v, index) => <AppIcon key={index} {...v} />)}
                    </div>
                </Scroller>
            </div>
            <div className={settingsIcon} onClick={datacollectionHandler}>
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
            <Popup open={appFeedback.show} onClose={onCloseFeedbackPage} noAnimation position='top' className={css.popup_ct}>
                <Feedback appName={appFeedback.title} appId={appFeedback.id} />
            </Popup>
        </div>
    )
}

export default Footer;