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
            <Button className={css.closeIconCtnIcon} backgroundOpacity="transparent"
                size="small"
                icon="closex" onClick={removeSearchName} />
        </div>
    )
}

export default SearchName;