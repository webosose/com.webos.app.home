import { useCallback, useState } from 'react';
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
import { HIDE_ALERT } from '../../actions/actionNames';
import deleteApp from '../../actions/deleteApp';
let delay;
let longPressEvent = false;

const Footer = ({ onLaunchPadHandler }) => {
    const appList = useSelector(state => state.appList);
    const appNames = useSelector(state => state.appNames);
    const runningApps = useSelector(state => state.runningApps);
    const appBarAlign = useSelector(state => state.appBarAlign);
    const appAlert = useSelector(state => state.appAlert);
    const dispatch = useDispatch();

    const [showEdit, setShowEdit] = useState(false);
    const addEdit = useCallback(() => {
        setShowEdit(true);
    }, []);
    const removeEdit = useCallback(() => {
        if (!longPressEvent) {
            setShowEdit(false);
        }
    }, []);

    let longpress = 500;
    const mouseDownHandler = useCallback(() => {
        longPressEvent = false;
        delay = setTimeout(() => {
            addEdit();
            longPressEvent = true;
        }, longpress);
    }, [addEdit, longpress])
    const mouseUpHandler = useCallback(() => {
        clearTimeout(delay);
    }, [])
    const mouseOutHandler = useCallback(() => {
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
    const renderApps = useCallback(() => {
        const defaultApps = [];
        const addedApps = [];
        const runningsApps = [];
        appList.forEach((v, index) => {
            if (v.default) {
                defaultApps.push(<AppIcon key={index} src={'file:' + v.icon} id={v.id} running={v.running} />)
            } else if (!v.default && appNames.indexOf(v.id) > -1) {
                addedApps.push(<AppIcon key={index} src={'file:' + v.icon} title={v.title} id={v.id} edit={showEdit ? 1 : 0} defaultapp={v.default ? 1 : 0} removable={v.removable} />);
            } else if (!v.default && appNames.indexOf(v.id) <= -1 && runningApps.indexOf(v.id) > -1) {
                runningsApps.push(<AppIcon key={index} src={'file:' + v.icon} title={v.title} id={v.id} edit={showEdit ? 1 : 0} defaultapp={v.default ? 1 : 0} running removable={v.removable} />)
            }
        })
        const lineIcon = <div key={appList.length+1} className={css.divider}>|</div>
        const allApps = [...defaultApps, ...addedApps, lineIcon, ...runningsApps];
        let item;
        if (allApps.length > 12) {
            item = <Scroller className={css.footerscrooler_scroll}>
                <div className={css.footerscrooler}>
                    {appBarAlign === 'left' ? allApps : allApps.reverse()}
                </div>
            </Scroller>
        } else if (appBarAlign === 'left') {
            item = <div className={css.footerscrooler}>
                {allApps}
            </div>
        } else if (appBarAlign === 'right') {
            item = <div className={css.footerscrooler + " " + css.footerscrooler_right}>
                {allApps}
            </div>
        }

        return item;
    }, [appList, appBarAlign, appNames, runningApps, showEdit])
    const settingsIcon = appBarAlign === 'left' ? css.setting_icon : css.setting_icon_right;
    const footerCnt = appBarAlign === 'left' ? css.footer_ctn : css.footer_ctn + " " + css.footer_ctn_right;
    return (
        <div className={footerCnt}
            onTouchStart={mouseDownHandler}
            onTouchEnd={mouseUpHandler}
            onTouchCancel={mouseOutHandler}
            onClick={removeEdit}>
            <Image src={launchpad} className={css.icon} onClick={onLaunchPadHandler} />
            {renderApps()}
            <div className={settingsIcon}>
                <AppBarSettings />
            </div>

            <Popup
                open={appAlert.show}
                position='center'>
                <Heading>{appAlert.title}</Heading>
                <BodyText>{appAlert.message}</BodyText>
                <Button onClick={noHandler}>No</Button>
                <Button onClick={yesHandler}>Yes</Button>
            </Popup>
        </div>
    )
}

export default Footer;