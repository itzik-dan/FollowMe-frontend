import React, { useState } from "react";
import axios from "axios";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { createPost } from "../actions/postActions";

const AddPost = ({ history }) => {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [previewSource, setPreviewSource] = useState("");
	const [uploading, setUploading] = useState(false);

	const dispatch = useDispatch();

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
			const photo = data.url;
			// calling createPost action with the data user nourished
			dispatch(createPost(title, body, photo));
			setUploading(false);
			history.push("/");
		} catch (e) {
			console.log(e);
			setUploading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		uploadFields(previewSource);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<label>Title</label>
				<input
					type="text"
					name="title"
					className="form-control"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>

			<div className="form-group">
				<label>Body</label>
				<input
					type="text"
					name="body"
					className="form-control"
					value={body}
					onChange={(e) => setBody(e.target.value)}
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
			<div className="text-center">
				<button
					className="btn btn-outline-info "
					disabled={!title || !body || !previewSource}
				>
					Submit
				</button>
			</div>
			{previewSource && (
				<img
					src={previewSource}
					alt=" chosen"
					style={{ height: "300px" }}
				/>
			)}
		</form>
	);
};

export default AddPost;
