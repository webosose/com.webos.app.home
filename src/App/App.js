import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Transition from '@enact/ui/Transition';
import { useCallback, useEffect, useState } from 'react';
import Footer from '../views/Footer/Footer';
import css from './App.module.less';
import { useDispatch } from 'react-redux';
import getLaunchPoints from '../actions/getLaunchPoints';
import { useSelector } from 'react-redux';
import { SHOW_APP } from '../actions/actionNames';
import getRunningApps from '../actions/getRunningApps';
import registerKind from '../actions/registerKind';
import LaunchPad from '../views/LaunchPad/LaunchPad';
import backgroundImage from './../../assets/app_bg.jpg'
import launchpadImage from './../../assets/launchpad_bg.jpg'

const App = () => {
	const [shownLaunchPad, setShownLaunchPad] = useState(false);
	const [curreentLanguage, setCurreentLanguage] = useState("");
	const dispatch = useDispatch();
	const shown = useSelector(state => state.appState);
	const launchPadHandler = useCallback(() => {
		if (typeof window !== 'undefined') {
			if (!shownLaunchPad) {
				document.body.className = css.lauchpad_bg;
			} else {
				document.body.className = css.app_bg
			}
			window.PalmSystem.PmLogString(6, 'DATA_COLLECTION', '{ "main":"com.webos.app.home", "sub": "launchpad", "event": "click",  "extra": { "clickeditem":"launchpad" } }', '');
			setShownLaunchPad(!shownLaunchPad);
		}
	}, [shownLaunchPad])
	useEffect(() => {
		if (!shown) {
			setShownLaunchPad(false);
		}
	}, [shown])
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
		document.body.className = css.app_bg;
		dispatch({
			type: SHOW_APP,
			payload: true
		});
	}, [dispatch])
	useEffect(() => {
		if (typeof window !== 'undefined') {
			document.addEventListener('keyup', showApp);
			document.addEventListener('webOSRelaunch', appRelaunch);
			setCurreentLanguage(window.navigator.language);
		}
		dispatch(getLaunchPoints());
		dispatch(getRunningApps());
		dispatch(registerKind());

		document.addEventListener('webOSLocaleChange', () => {
			console.log("LISTENED TO webOSLocaleChange EVENT ====>")
			// window.location.reload();
			if (typeof window !== 'undefined' && window.navigator) {
				// _locale = curreentLanguage
				console.log("curreentLanguage is (inside) ===> ", curreentLanguage)

				if (curreentLanguage !== window.navigator.language) {
					console.log("inside IF CONDITION window.navigator.language =======> ", window.navigator.language)
					window.location.reload();
				} else {
					console.log("inside ELSE CONDITION window.navigator.language =======> ", window.navigator.language)
				}
			}
		});

	}, [showApp, appRelaunch,curreentLanguage, dispatch])
	return (
		<div className={css.app}>
			<Transition type="fade" visible={shown}>
				<div className={css.basement} onClick={handleHide} />
			</Transition>
			{/* <Transition direction="up" visible={shown}>
				<Controls className={css.controls}>
					<buttons>
						<Button size="large" backgroundOpacity="opaque" icon="notification" />
						<Button size="large" backgroundOpacity="opaque" icon="profile" />
						<Button size="large" backgroundOpacity="opaque" icon="bluetooth" />
						<Button size="large" backgroundOpacity="opaque" icon="share" />
						<Button size="large" backgroundOpacity="opaque" icon="gear" onClick={launchSettings} />
					</buttons>
				</Controls>
			</Transition> */}
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
			<img width="0" height="0" alt="" src={backgroundImage} />
			<img width="0" height="0" alt="" src={launchpadImage} />
		</div>
	)
}
export default ThemeDecorator({ overlay: true }, App);