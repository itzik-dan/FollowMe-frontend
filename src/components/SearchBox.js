import React, {useState} from "react";
// import { useHistory } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
// import { SEARCH_QUERY } from "../../types/searchTypes";
import { useHistory } from "react-router-dom";

const SearchBox = () => {
	const [keyword, setKeyword] = useState('')
	const history = useHistory();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (keyword.trim()) {
			history.push(`/search/${keyword}`)
			setKeyword("")
		} else {
			history.push("/")
		}
	};

	return (
		<form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
			<input
				onChange={e => setKeyword(e.target.value)}
				type="search"
				value={keyword}
				className="form-control mr-sm-2"
				placeholder="Search User"
			/>
			<SearchOutlined
				onClick={handleSubmit}
				style={{ cursor: "pointer" }}
			/>
		</form>
	);
};

export default SearchBox;
