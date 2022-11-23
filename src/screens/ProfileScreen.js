import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Image, Avatar, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_PIC } from "../types/userTypes";
import { Link } from "react-router-dom";

const { Meta } = Card;

const ProfileScreen = ({ history }) => {
	// State for storing logged in user posts
	const [myPosts, setMyPosts] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [image, setImage] = useState("");

	const dispatch = useDispatch();

	// Fetching logged in user info from redux state
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (!userInfo) {
			history.push("/login");
		} else {
			// Fetching logged in user's posts from backend and storing them in myPosts state
			(async () => {
				const { data } = await axios.get(`/mypost`, {
					headers: {
						Authorization: `Bearer ${userInfo.token}`,
					},
				});
				setMyPosts(data);
			})();
		}
	}, [history, userInfo]);

	useEffect(() => {
		if (image) {
			uploadFields(image);
		}
	// eslint-disable-next-line
	}, [image]);

	const uploadFields = async (base64EncodedImage) => {
		// console.log(base64EncodedImage);
		setUploading(true);
		const formData = { data: base64EncodedImage };
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};
			// api call to backend to store image on cloudinary
			const { data } = await axios.post("/upload", formData, config);
			// Updating db with the newly updated profile pic
			await axios.put(
				"/update-profile-pic",
				{ photo: data.url },
				{
					headers: {
						Authorization: `Bearer ${userInfo.token}`,
					},
				}
			);
			// Updating localStorage with the newly updated profile pic
			localStorage.setItem(
				"userInfo",
				JSON.stringify({ ...userInfo, photo: data.url })
			);
			// Updating Redux state with the newly updated profile pic
			dispatch({ type: UPDATE_PIC, payload: data.url });
			setUploading(false);
		} catch (e) {
			console.log(e);
			setUploading(false);
		}
	};

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setImage(reader.result);
		};
	};

	return (
		<div>
			<div className="row mt-2" style={{ borderBottom: "2px solid grey" }}>
				<div className="col-md-6">
				<Avatar
				  src={<Image src={userInfo.photo} />}
				  size={400}
				  shape="square" 
				/>
					<br />
					<div className="form-group">
						<label>Update image:</label>
						<br />
						<input
							type="file"
							onChange={handleFileInputChange}
							className="pt-2"
							accept="image/*"
						/>
						{uploading && <Spin />}
					</div>
				</div>
				<div className="col-md-6">
					<div className="site-card-border-less-wrapper">
						<Card
							title={<h2>{userInfo.name}</h2>}
							bordered={false}
							style={{ width: 300, height: 300 }}
						>
							<h5>{myPosts.length} posts</h5> <br />
							<h5>
								{userInfo.followers ? (
									userInfo.followers.length
								) : (
									<Spin />
								)}{" "}
								Followers
							</h5>
							<br />
							<h5>
								{userInfo.following ? (
									userInfo.following.length
								) : (
									<Spin />
								)}{" "}
								followings
							</h5>
							<br />
						</Card>
					</div>
				</div>
			</div>

			<div className="row mt-5">
				{myPosts.length ? (
					myPosts.map((item) => (
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
							</Card>
						</div>
					))
				) : (
					<h4 className="pl-3">
						No posts yet,{" "}
						<Link to="/create">Click to create new post</Link>
					</h4>
				)}
			</div>
		</div>
	);
};

export default ProfileScreen;
