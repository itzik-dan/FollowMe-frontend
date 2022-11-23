import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Card, Image, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_FOLLOW } from "../types/userTypes";
const { Meta } = Card;

const ProfileScreen = ({ history, match }) => {
	// State for presenting profile once fetched from backend
	const [profile, setProfile] = useState(null);
	// Loading state for follow/unfollow button, this will prevent multiple follow clicks
	const [loading, setLoading] = useState(false);

	const { id } = match.params;
	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const { following } = JSON.parse(localStorage.getItem("userInfo"));

	useEffect(() => {
		if (!userInfo) {
			history.push("/login");
		} else {
			(async () => {
				const { data } = await axios.get(`/user/${id}`, {
					headers: {
						Authorization: `Bearer ${userInfo.token}`,
					},
				});
				setProfile(data);
			})();
		}
	}, [history, id, userInfo]);

	const followUser = async () => {
		setLoading(true);
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			"/follow",
			{ followedUserId: profile.user._id },
			config
		);
		// // add to redux state
		dispatch({
			type: UPDATE_FOLLOW,
			payload: {
				following: data.followingUser.following,
				followers: data.followingUser.followers,
			},
		});
		localStorage.setItem(
			"userInfo",
			JSON.stringify({
				...userInfo,
				followers: data.followingUser.followers,
				following: data.followingUser.following,
			})
		);
		// Adding user who liked to post the the followed user array
		setProfile((prevState) => {
			return {
				...prevState,
				user: {
					...prevState.user,
					followers: [
						...prevState.user.followers,
						data.followingUser._id,
					],
				},
			};
		});
		setLoading(false);
	};

	const unfollowUser = async () => {
		setLoading(true);
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			"/unfollow",
			{ unfollowedUserId: profile.user._id },
			config
		);
		// // add to redux state
		dispatch({
			type: UPDATE_FOLLOW,
			payload: {
				following: data.followingUser.following,
				followers: data.followingUser.followers,
			},
		});
		localStorage.setItem(
			"userInfo",
			JSON.stringify({
				...userInfo,
				followers: data.followingUser.followers,
				following: data.followingUser.following,
			})
		);
		// Adding user who liked to post the the followed user array
		setProfile((prevState) => {
			const removeFollowArr = prevState.user.followers.filter(
				(record) => record !== data.followingUser._id
			);
			return {
				...prevState,
				user: {
					...prevState.user,
					followers: removeFollowArr,
				},
			};
		});
		setLoading(false);
	};

	return (
		<Fragment>
			{!profile ? (
				<Spin style={{ marginLeft: "500px" }} size="large" />
			) : (
				<div>
					<div
						className="row"
						style={{ borderBottom: "2px solid grey" }}
					>
						<div className="col-md-6">
							<Image width={400} src={profile.user.photo} />
						</div>
						<div className="col-md-6">
							<div className="site-card-border-less-wrapper">
								<Card
									title={<h2>{profile.user.name}</h2>}
									bordered={false}
									style={{ width: 300 }}
								>
									<h5>Posts: {profile.userPosts.length}</h5>{" "}
									<br />
									<h5>
										Followers:{" "}
										{profile.user.followers.length}
									</h5>
									<br />
									<h5>
										Following:{" "}
										{profile.user.following.length}
									</h5>
									<br />
									{loading ? (
										<Spin size="large" />
									) : following &&
									  following.includes(profile.user._id) ? (
										<button
											type="button"
											onClick={() => unfollowUser()}
											className="btn btn-raised btn-info"
										>
											Unfollow
										</button>
									) : (
										<button
											type="button"
											onClick={() => followUser()}
											className="btn btn-raised btn-info"
										>
											Follow
										</button>
									)}
								</Card>
							</div>
						</div>
					</div>

					<div className="row mt-5">
						{profile.userPosts.map((item) => (
							<div className="col-md-4 mb-5" key={item._id}>
								<Card
									hoverable
									style={{ width: 240 }}
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
										title={item.title}
										description={item.body}
									/>
									<small>
										Posted on:{" "}
										{item.createdAt.substring(0, 10)}
									</small>
								</Card>
							</div>
						))}
					</div>
				</div>
			)}
		</Fragment>
	);
};

export default ProfileScreen;
