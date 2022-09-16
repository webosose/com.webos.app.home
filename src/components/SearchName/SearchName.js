import Button from '@enact/sandstone/Button';
import BodyText from '@enact/sandstone/BodyText';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SEARCH_STRING } from '../../actions/actionNames';
import { deleteSearchName } from '../../actions/registerKind';
import css from './SearchName.module.less';

const SearchName = ({title})=>{
    const dispatch = useDispatch();
    const removeSearchName = useCallback(()=>{
        window.PalmSystem.PmLogString(6, 'DATA_COLLECTION', `{"main":"com.webos.app.home", "sub":"searchbar","event":"searchistory","extra": {"history":"delete","deletedsearchtext": "${title}"}}`, '')
        dispatch(deleteSearchName(title));
    },[dispatch,title])
    const onSearchStringHandler = useCallback(()=>{
        dispatch({
            type:SEARCH_STRING,
            payload:title
        })
    },[title,dispatch])

    return(
        <div className={css.searchNameCtn}>
            <BodyText size='small' className={css.title} onClick={onSearchStringHandler}>{title}</BodyText>
            {/* <Icon>closex</Icon> */}
            <Button className={css.closeIconCtnIcon} backgroundOpacity="transparent"
                css={css}
                size="small"
                icon="closex" onClick={removeSearchName} />
        </div>
    )
}

export default SearchName;