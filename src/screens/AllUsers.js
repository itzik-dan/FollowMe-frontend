import React, { useEffect } from "react";
import { Card, Avatar, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { listAllUsers } from "../actions/userActions";
import { toast } from "react-toastify";

const { Meta } = Card;

const AllUsers = ({ history, match }) => {
	const keyword = match.params.keyword
	const dispatch = useDispatch();

	// fetching logged in user info
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	// fetching  list of posts from redux state
	const userlist = useSelector((state) => state.userList);
	const { loading, error, users } = userlist;

	useEffect(() => {
		if (!userInfo) {
			history.push("/login");
		} else {
			dispatch(listAllUsers(keyword));
		}
	}, [history, dispatch, userInfo, keyword]);

	return (
		<div className="row">
			{loading ? (
				<Spin style={{ margin: "auto" }} size="large" />
			) : error ? (
				toast.error(error)
			) : users.length ? (
				users.map((item) => (
					<div className="col-md-4" key={item._id}>
						<Card
							key={item._id}
							hoverable
							style={{ width: 240, marginBottom: "20px" }}
							cover={
								<img
									alt="example"
									src={item.photo}
									style={{
										height: "300px",
										objectFit: "cover",
									}}
								/>
							}
						>
							<Meta
								onClick={() => {
									if (userInfo._id !== item._id) {
										history.push(`/profile/${item._id}`);
									} else {
										history.push("/profile");
									}
								}}
								avatar={
									<Avatar
										size="large"
										icon={<UserOutlined />}
									/>
								}
								title={item.name}
								description={item.email}
							/>
						</Card>
					</div>
				))
			): <h1>User not found!</h1>}
		</div>
	);
};

export default AllUsers;
