import service from '../service';
import { APP_BAR_ALIGN, APP_BAR_NAMES, APP_BAR_SHOW, SEARCH_NAME_UPDATE, SHOW_APP, SORT_TYPE_UPDATE } from './actionNames';
let APP_BAR_ALIGN_PROP = "";
let APP_BAR_NAMES_PROP = "";
let APP_BAR_SHOW_PROP = "";
let SEARCH_STRING_PROP = "";
let SORT_TYPE_PROP = "";
const getData = (dispatch) => {
    service.find({
        "query": {
            "from": "com.webos.app.home:1",
        },
        onSuccess: (res) => {
            let displayAffinity = 0;
            if (typeof window !== 'undefined') {
                displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
                APP_BAR_ALIGN_PROP = "appbar_aligh_" + displayAffinity
                APP_BAR_NAMES_PROP = "appbar_names_" + displayAffinity
                APP_BAR_SHOW_PROP = "appshow_" + displayAffinity
                SEARCH_STRING_PROP = "search_string_" + displayAffinity
                SORT_TYPE_PROP = 'sort_type' + displayAffinity
            }
            console.log(displayAffinity + ' find: ' + JSON.stringify(res));
            if (res.returnValue && res.results.length > 0) {

                const appbar_aligh = res.results[0][APP_BAR_ALIGN_PROP] || 'left';
                const appbar_names = res.results[0][APP_BAR_NAMES_PROP];
                let appshow = true;
                if (res.results[0][APP_BAR_SHOW_PROP] !== undefined) {
                    appshow = res.results[0][APP_BAR_SHOW_PROP]
                }
                const search_string = res.results[0][SEARCH_STRING_PROP] || [];
                const sortType = res.results[0][SORT_TYPE_PROP] || 'a_to_z';
                dispatch({
                    type: SORT_TYPE_UPDATE,
                    payload: sortType
                })
                dispatch({
                    type: SEARCH_NAME_UPDATE,
                    payload: search_string
                })
                dispatch({
                    type: APP_BAR_ALIGN,
                    payload: appbar_aligh
                });
                if (Array.isArray(appbar_names)) {
                    dispatch({
                        type: APP_BAR_NAMES,
                        payload: appbar_names
                    })
                }
                dispatch({
                    type: APP_BAR_SHOW,
                    payload: appshow
                })
                if (appshow) {
                    dispatch({
                        type: SHOW_APP,
                        payload: true
                    });
                } else {
                    if (typeof window !== 'undefined') {
                        console.log('App closed before opened...')
                        window.close();
                    }
                }
            } else {
                //This is very first time need to create only in only display
                //because we are using same table for both display
                if (displayAffinity === 0) {
                    service.put({
                        objects: [
                            {
                                "_kind": "com.webos.app.home:1",
                            }
                        ],
                        onSuccess: (result) => {
                            console.log('First record created..', result);
                        },
                        onFailure: (result) => {
                            console.log(' First record created onFailure :::', result);
                            // serviceConnected = false;
                        }
                    })
                }
                dispatch({
                    type: APP_BAR_SHOW,
                    payload: true
                })
                dispatch({
                    type: SHOW_APP,
                    payload: true
                });
            }
            if (typeof window !== 'undefined') {
                document.body.style.display = "block";
            }
        },
        onFailure: () => {

        }
    });
}
const registerKind = () => (dispatch) => {
    service.putKind({
        "id": "com.webos.app.home:1",
        "owner": "com.webos.app.home",
        "indexes": [],
        onSuccess: (res) => {
            console.log(' putKind: ', res);
            getData(dispatch);
        },
        onFailure: (res) => {
            console.log('putKind onFailure :::', res);
            // serviceConnected = false;
        }
    });
}
const mergeData = (prop, value, callback) => {
    service.merge({
        "query": {
            "from": "com.webos.app.home:1",
        },
        "props": {
            [prop]: value
        },
        onSuccess: () => {
            console.log(value + ' merge onSuccess ::: ', prop);
            callback();
        },
        onFailure: (res) => {
            console.log('merge onFailure :::', res);
            // serviceConnected = false;
        }
    });
}
export const addSortType = (name) => (dispatch) => {
    mergeData(SORT_TYPE_PROP, name, () => {
        dispatch({
            type: SORT_TYPE_UPDATE,
            payload: name
        })
    })
}
export const addSearchName = (name) => (dispatch, getState) => {
    const value = [name, ...getState().searchNames.filter(v => v !== name)];
    if (value.length > 10) {
        value.pop();
    }
    mergeData(SEARCH_STRING_PROP, value, () => {
        dispatch({
            type: SEARCH_NAME_UPDATE,
            payload: value
        })
    })
}
export const deleteSearchName = (name) => (dispatch, getState) => {
    const value = getState().searchNames.filter(v => v !== name);
    mergeData(SEARCH_STRING_PROP, value, () => {
        dispatch({
            type: SEARCH_NAME_UPDATE,
            payload: value
        })
    })
}
export const deleteAllSearchNames = () => (dispatch) => {
    const value = []
    mergeData(SEARCH_STRING_PROP, value, () => {
        dispatch({
            type: SEARCH_NAME_UPDATE,
            payload: value
        })
    })
}
export const addAppName = (id) => (dispatch, getState) => {
    if (id) {
        const value = [...getState().appNames, id];
        mergeData(APP_BAR_NAMES_PROP, value, () => {
            dispatch({
                type: APP_BAR_NAMES,
                payload: value
            })
        })
    }
}
export const deleteAppName = (id) => (dispatch, getState) => {
    const value = getState().appNames.filter(v => v !== id);
    mergeData(APP_BAR_NAMES_PROP, value, () => {
        dispatch({
            type: APP_BAR_NAMES,
            payload: value
        })
    })
}
export const addAppNames = (names) => (dispatch) => {
    if (names) {
        const value = [...names];
        mergeData(APP_BAR_NAMES_PROP, value, () => {
            dispatch({
                type: APP_BAR_NAMES,
                payload: value
            })
        })
    }

}
export const changeAppBarView = (value) => (dispatch) => {
    mergeData(APP_BAR_SHOW_PROP, value, () => {
        dispatch({
            type: APP_BAR_SHOW,
            payload: value
        })
    })

};
export const changeAppBarViewAlign = (value) => (dispatch) => {
    mergeData(APP_BAR_ALIGN_PROP, value, () => {
        dispatch({
            type: APP_BAR_ALIGN,
            payload: value
        })
    })

};
export default registerKind;