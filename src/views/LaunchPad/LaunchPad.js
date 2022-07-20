import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from '@enact/sandstone/Image';
import historysearch from '../../../assets/historysearch.png'
import { deleteAllSearchNames } from '../../actions/registerKind';
import AppIcon from '../../components/AppIcon/AppIcon';
import Carousel from '../../components/Carousel/Carousel';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchHistory from '../../components/SearchHistory/SearchHistory';
import { getClientWidth } from '../../util/util';
import css from './LaunchPad.module.less';

let delay;
let longPressEvent = false;
const LaunchPad = () => {
    const appList = useSelector(state => state.appList);
    const sortType = useSelector(state => state.sortType);
    const [chunckAppList, setChunckAppList] = useState([]);
    const [filter, setFilter] = useState('');
    const [showSearchHistory, setShowSearchHistory] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        let result = [];
        let arr = filter ? appList.filter((v) => {
            const title = v.title || v.id;
            return title.toLowerCase().indexOf(filter) > -1;
        }) : appList;
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
    const [showEdit, setShowEdit] = useState(false);
    const addEdit = useCallback(() => {
        setShowEdit(true);
    }, []);
    const removeEdit = useCallback(() => {
        if (!longPressEvent) {
            setShowEdit(false);
        }
    }, []);
    /*Long press */
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
    /*--------------Long press */
    const showSearchHistoryPage = useCallback((value) => {
        setShowSearchHistory(value);
    }, [setShowSearchHistory])

    const onFilterHandler = useCallback((value) => {
        setFilter(value)
        showSearchHistoryPage(false)
    }, [showSearchHistoryPage])

    const onClearAllHandler = useCallback(() => {
        setShowSearchHistory(false);
        dispatch(deleteAllSearchNames())
    }, [setShowSearchHistory, dispatch])
    const onClickHistoryIcon = useCallback(() => {
        showSearchHistoryPage(!showSearchHistory)
    }, [showSearchHistoryPage, showSearchHistory])
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
                <Carousel size={chunckAppList.length}>
                    {chunckAppList.map((value, i) => {
                        return <div className={css.item}
                            key={i}
                            onTouchStart={mouseDownHandler}
                            onTouchEnd={mouseUpHandler}
                            onTouchCancel={mouseOutHandler}
                            onClick={removeEdit}
                            style={{ width: getClientWidth() + 'px' }}>
                            {value.map((app, index) => {
                                return <AppIcon key={index} src={'file:' + app.icon}
                                    source='launchpad' title={app.title} id={app.id}
                                    edit={showEdit ? 1 : 0} defaultapp={app.default}
                                    removable={app.removable} />
                            })}
                        </div>
                    })}
                </Carousel>}

        </div>
    )
}
export default LaunchPad;