import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from '@enact/sandstone/Image';
import historysearch from '../../../assets/historysearch.png'
import { deleteAllSearchNames } from '../../actions/registerKind';
import Carousel from '../../components/Carousel/Carousel';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchHistory from '../../components/SearchHistory/SearchHistory';
import css from './LaunchPad.module.less';
import AppList from '../../components/AppList/AppList';
import { CLEAR_APPBAR_EDIT, CLEAR_LAUNCHPAD_EDIT, SET_LAUNCHPAD_EDIT } from '../../actions/actionNames';

let delay;
let longPressEvent = false;
const LaunchPad = () => {
    const appList = useSelector(state => state.appList);
    const sortType = useSelector(state => state.sortType);
    const [chunckAppList, setChunckAppList] = useState([]);
    const [filter, setFilter] = useState({ enabled: false, value: '' });
    const [showSearchHistory, setShowSearchHistory] = useState(false);
    const dragStatus = useSelector(state => state.dragStatus);
    const dispatch = useDispatch();
    useEffect(() => {
        let result = [];
        let arr = appList;
        if (filter.enabled) {
            arr = filter.value ? appList.filter((v) => {
                const title = v.title || v.id;
                return title.toLowerCase().indexOf(filter.value) > -1;
            }) : [];
        }
        const chunkSize = 12;
        let sortFunction = (a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()) {
                return -1;
            }
            if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return 1;
            }
            return 0;
        }
        if (sortType === 'z_to_a') {
            sortFunction = (a, b) => {
                if (a.title.toLowerCase() > b.title.toLowerCase()) {
                    return -1;
                }
                if (a.title.toLowerCase() < b.title.toLowerCase()) {
                    return 1;
                }
                return 0;
            }
        }
        arr = arr.sort(sortFunction);
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            result.push(chunk);
        }
        setChunckAppList(result);
    }, [appList, filter, sortType])

    const removeEdit = useCallback(() => {
        if (!longPressEvent) {
            dispatch({ type: CLEAR_LAUNCHPAD_EDIT })
        }
        dispatch({ type: CLEAR_APPBAR_EDIT })
    }, [dispatch]);
    /*Long press */
    let longpress = 500;
    const mouseDownHandler = useCallback(() => {
        longPressEvent = false;
        delay = setTimeout(() => {
            //addEdit();
            dispatch({ type: SET_LAUNCHPAD_EDIT })
            longPressEvent = true;
        }, longpress);
    }, [dispatch, longpress])
    const mouseUpHandler = useCallback(() => {
        console.log('mouseUpHandler..')
        clearTimeout(delay);
    }, [])

    /*--------------Long press */
    const showSearchHistoryPage = useCallback((value) => {
        setShowSearchHistory(value);
    }, [setShowSearchHistory])

    const onFilterHandler = useCallback((value) => {
        setChunckAppList([]);
        setFilter({ ...value });
        showSearchHistoryPage(false)
    }, [showSearchHistoryPage])

    const onClearAllHandler = useCallback(() => {
        window.PalmSystem.PmLogString(6, 'DATA_COLLECTION', '{"main":"com.webos.app.home", "sub":"searchbar","event":"searchistory","extra": {"history":"clearall","deletedsearchtext": ""}}', '');
        setShowSearchHistory(false);
        dispatch(deleteAllSearchNames())
    }, [setShowSearchHistory, dispatch])
    const onClickHistoryIcon = useCallback(() => {
        window.PalmSystem.PmLogString(6, 'DATA_COLLECTION', `{"main":"com.webos.app.home", "sub":"searchbar","event":"searchistory","extra": { "clickeditem":"searchistory" }}`, '');
        showSearchHistoryPage(!showSearchHistory)
    }, [showSearchHistoryPage, showSearchHistory])
    // console.log("filter:: ",filter)

    return (
        <div>
            <div className={css.searchcnt}>
                <SearchBar onFilter={onFilterHandler} />
                <Image src={historysearch}
                    onClick={onClickHistoryIcon}
                    className={css.searchicon} />
            </div>

            {showSearchHistory ?
                <SearchHistory clearAllHandler={onClearAllHandler} /> :
                <div onTouchStart={mouseDownHandler}
                    onTouchEnd={mouseUpHandler}
                    onClick={removeEdit}>
                    <Carousel dragStatus={dragStatus} size={chunckAppList.length}>
                        {chunckAppList.map((value, index) => {
                            return <AppList apps={value} key={index} />
                        })}
                    </Carousel></div>}

        </div>
    )
}
export default LaunchPad;