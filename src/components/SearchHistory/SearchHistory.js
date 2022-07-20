import BodyText from "@enact/sandstone/BodyText";
import Button from "@enact/sandstone/Button";
import Heading from "@enact/sandstone/Heading";
import { useSelector } from "react-redux"
import SearchName from "../SearchName/SearchName";
import css from './SearchHistory.module.less';

const SearchHistory = ({clearAllHandler})=>{
    const searchNames = useSelector(state=>state.searchNames);
    return (
        <div className={css.searchhistoryCnt}>
            <div className={css.header}>
                <Heading>Recent Search History</Heading>
                <Button backgroundOpacity="transparent"
                className={css.clearbtn}
                onClick={clearAllHandler}>Clear All</Button>
            </div>
            <div className={css.searchhistory}>
                {searchNames.length > 0 ?searchNames.map(v=>{
                    return <SearchName title={v}/>
                }) : <BodyText>No Data Found</BodyText>}
            </div>
        </div>
    );
}

export default SearchHistory;