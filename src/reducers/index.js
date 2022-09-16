import { combineReducers } from 'redux';
import appBarAlign from './appBarAlign';
import appNames from './appNames';
import appBarShow from './appBarShow';
import appState from './appState';
import getApplist from './getApplist';
import runningApps from './runningApps';
import appAlert from './appAlert';
import searchNames from './searchNames';
import sortType from './sortType';
import searchString from './searchString';
import editStatus from './editStatus';
const rootReducer = combineReducers({
    appList:getApplist,
    appState,
    runningApps,
    appBarAlign,
    appNames,
    appBarShow,
    appAlert,
    searchNames,
    sortType,
    searchString,
    editStatus
});

export default rootReducer;