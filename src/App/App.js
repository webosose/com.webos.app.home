import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Button from '@enact/sandstone/Button';
import Transition from '@enact/ui/Transition';
import { useCallback, useEffect, useState } from 'react';
import Footer from '../views/Footer/Footer';
import css from './App.module.less';
import Controls from '../views/Controls';
import { useDispatch } from 'react-redux';
import getLaunchPoints from '../actions/getLaunchPoints';
import { useSelector } from 'react-redux';
import { SHOW_APP } from '../actions/actionNames';
import getRunningApps from '../actions/getRunningApps';
import registerKind from '../actions/registerKind';
import LaunchPad from '../views/LaunchPad/LaunchPad';
import launchAction from '../actions/launchAction';
import backgroundImage from './../../assets/background.jpg';

const App = () => {
	const [shownLaunchPad, setShownLaunchPad] = useState(false);
	const dispatch = useDispatch();
	const shown = useSelector(state => state.appState);
	const launchPadHandler = useCallback(() => {
		// if(!shownLaunchPad){
		// 	document.body.style.backgroundImage = "url('../../assets/launchpad_back.jpg')";
		// }else {
		// 	document.body.style.backgroundImage = "url('../../assets/background.jpg')";
		// }
		setShownLaunchPad(!shownLaunchPad);
	}, [shownLaunchPad])
	const handleHide = useCallback(() => {
		if (!shownLaunchPad) {
			dispatch({
				type: SHOW_APP,
				payload: false
			});
		}

	}, [dispatch, shownLaunchPad]);
	const closeApp = useCallback(() => {
		if (typeof window !== 'undefined') {
			window.close();
		}
	}, []);
	const showApp = useCallback(({ keyCode }) => {
		// setShown(true);
		if (keyCode === 48) { // 0
			dispatch({
				type: SHOW_APP,
				payload: true
			});
		}
		return true;

	}, [dispatch])
	const appRelaunch = useCallback(() => {
		dispatch({
			type: SHOW_APP,
			payload: true
		});
	}, [dispatch])
	useEffect(() => {
		if (typeof window !== 'undefined') {
			document.addEventListener('keyup', showApp);
			document.addEventListener('webOSRelaunch', appRelaunch);
		}
		dispatch(getLaunchPoints());
		dispatch(getRunningApps());
		dispatch(registerKind());

	}, [showApp, appRelaunch, dispatch])

	const launchSettings = useCallback(() => {
        dispatch(launchAction('com.palm.app.settings'));
    }, [dispatch]);
	return (
		<div className={css.app}>
			<Transition type="fade" visible={shown}>
				<div className={css.basement} onClick={handleHide} />
			</Transition>
			<Transition direction="up" visible={shown}>
				<Controls className={css.controls}>
					<buttons>
						<Button size="large" backgroundOpacity="opaque" icon="notification" />
						<Button size="large" backgroundOpacity="opaque" icon="profile" />
						<Button size="large" backgroundOpacity="opaque" icon="bluetooth" />
						<Button size="large" backgroundOpacity="opaque" icon="share" />
						<Button size="large" backgroundOpacity="opaque" icon="gear" onClick={launchSettings}/>
					</buttons>
				</Controls>
			</Transition>
			<Transition direction="down" visible={shownLaunchPad}>
				{shownLaunchPad ? <LaunchPad /> : ''}
			</Transition>
			<Transition css={css}
				// onShow={handleShow}
				onHide={closeApp}
				direction="down"
				visible={shown}
				className={css.launcherTransition} >
				<Footer onLaunchPadHandler={launchPadHandler} />
			</Transition>
			<Transition css={css}
				direction="down"
				visible={shown}
				className={css.bottom_line_ctn}>
				<div className={css.bottom_line} />
			</Transition>
			<img  width="0" height="0" alt="" src={backgroundImage}  />
		</div>
	)
}
export default ThemeDecorator({ overlay: true }, App);