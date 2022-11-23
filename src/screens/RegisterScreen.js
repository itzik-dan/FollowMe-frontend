import { React, useState, useEffect } from "react";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import axios from "axios";

const RegisterScreen = ({ history }) => {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	// State for storing the image as preview before uploading to cloudinary
	const [previewSource, setPreviewSource] = useState('');
	const [uploading, setUploading] = useState(false);

	const dispatch = useDispatch();
	const userRegister = useSelector((state) => state.userRegister);

	const { loading, userInfo } = userRegister;

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		previewFile(file);
	};

	// Function for previewing selected file 
	const previewFile = (file) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setPreviewSource(reader.result);
		};
	};

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
			// fetch response image url from cloudinary
			const photo = data.url
			// calling resiter action to sigin up user with all the details
			dispatch(register(name, email, password, photo));
			setUploading(false);
		} catch (e) {
			console.log(e);
			setUploading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		uploadFields(previewSource)
	};

	// If user is authenticated redirect to home page
	useEffect(() => {
		if (userInfo) {
			history.push("/");
		}
	}, [history, userInfo]);

	const registerForm = () => (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<input
					type="text"
					placeholder="Name"
					className="form-control"
					value={name}
					onChange={(e) => setName(e.target.value)}
					autoFocus
				/>
			</div>

			<div className="form-group">
				<input
					type="email"
					placeholder="Email"
					className="form-control"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>

			<div className="form-group">
				<input
					type="password"
					placeholder="Password (at least 6 characters)"
					className="form-control"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>

			<div className="form-group">
				<label>Upload an image:</label>
				<br />
				<input
					type="file"
					onChange={handleFileInputChange}
					className="pt-2"
					name="file"
					accept="image/*"
				/>
				{uploading && <Spin />}
			</div>

			<br />
			<button
				type="submit"
				className="btn btn-raised"
				disabled={!name || !email || password.length < 6 || !previewSource}
			>
				Register
			</button>
			<br />
			{previewSource && (
				<img
					src={previewSource}
					alt=" chosen"
					style={{ height: "300px" }}
				/>
			)}
		</form>
	);

	return (
		<div className="container p-5">
			<div className="row">
				<div className="col-md-6 offset-md-3">
					{loading ? <Spin size="large" /> : <h2>Register</h2>}
					{registerForm()}

					<Link to="/login" className="float-right text-danger">
						Have an account?
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RegisterScreen;
