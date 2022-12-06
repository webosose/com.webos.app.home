import service from '../service';
import { ADD_LAUNCH_POINT, GET_LAUNCH_POINTS, REMOVE_LAUNCH_POINT } from './actionNames';
const DEFAULT_APPS_IDS = ['com.webos.app.videocall', 'com.webos.app.enactbrowser', 'com.palm.app.settings']
const getLaunchPoints = () => (dispatch) => {
    console.log("getLaunchPoints API is called========>")
    service.listLaunchPoints({
        subscribe: true,
        onSuccess: (res) => {
            // console.log("res.launchPoint:: ",res)
            if (res.launchPoints) {
                const launchPoints = res.launchPoints.map(v => {
                    if (DEFAULT_APPS_IDS.indexOf(v.id) > -1) {
                        v.default = true;
                    }
                    return v;
                })
                launchPoints.push({
                    default: true,
                    id: 'com.palm.app.settings',
                    icon: '/usr/palm/applications/com.palm.app.settings/icon.png',
                    title:'Settings Application'
                });
                dispatch({
                    type: GET_LAUNCH_POINTS,
                    payload: launchPoints
                })
            } else if (res.launchPoint && res.change === "added") {
                dispatch({
                    type: ADD_LAUNCH_POINT,
                    payload: res.launchPoint
                })
            } else if (res.launchPoint && res.change === "removed") {
                dispatch({
                    type: REMOVE_LAUNCH_POINT,
                    payload: res.launchPoint.id
                })
            }

        },
        onFailure: () => {

        }
    });
}

export default getLaunchPoints;