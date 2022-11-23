import React, { useEffect } from "react";
import { Card, Avatar, Spin, Tooltip } from "antd";
import {
  UserOutlined,
  LikeOutlined,
  DislikeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  listPosts,
  addLike,
  removeLike,
  addComment,
  deletePost,
} from "../actions/postActions";
import { toast } from "react-toastify";

const { Meta } = Card;

const HomeScreen = ({ history }) => {
  const dispatch = useDispatch();

  // fetching logged in user info
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // fetching  list of posts from redux state
  const postList = useSelector((state) => state.postList);
  const { loading, error, posts, loadingLikes } = postList;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      dispatch(listPosts());
    }
  }, [history, dispatch, userInfo]);

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3">
        {loading ? (
          <Spin style={{ marginLeft: "256px" }} size="large" />
        ) : error ? (
          toast.error(error)
        ) : (
          posts.map((item) => (
            <Card
              key={item._id}
              hoverable
              style={{
                width: 450,
                marginBottom: "40px",
              }}
              cover={
                <img
                  alt="example"
                  src={item.photo}
                  style={{
                    height: "500px",
                    objectFit: "cover",
                  }}
                />
              }
              actions={[
                <Tooltip title="Delete post">
                  {userInfo._id === item.postedBy._id && (
                    <DeleteOutlined
                      key="delete"
                      onClick={() => {
                        if (window.confirm("Delete?")) {
                          dispatch(deletePost(item._id));
                        }
                      }}
                      style={{ color: "red" }}
                    />
                  )}
                </Tooltip>,
              ]}
            >
              {loadingLikes ? (
                <Spin size="large" />
              ) : item.likes.includes(userInfo._id) ? (
                <DislikeOutlined
                  style={{
                    fontSize: "30px",
                    marginBottom: "10px",
                  }}
                  onClick={() => dispatch(removeLike(item._id))}
                />
              ) : (
                <LikeOutlined
                  style={{
                    fontSize: "30px",
                    marginBottom: "10px",
                  }}
                  onClick={() => dispatch(addLike(item._id))}
                />
              )}
              <h5>{item.likes.length} likes</h5>
              <br />
              <Meta
                onClick={() => {
                  if (userInfo._id !== item.postedBy._id) {
                    history.push(`/profile/${item.postedBy._id}`);
                  } else {
                    history.push("/profile");
                  }
                }}
                avatar={<Avatar size="large" icon={<UserOutlined />} />}
                title={`${item.postedBy.name} - ${item.title}`}
                description={item.body}
              />
              <hr />
              <div
                style={{
                  height: "100px",
                  overflowY: "auto",
                  wordWrap: "break-word",
                }}
              >
                {item.comments.map((comment) => {
                  return (
                    <p key={comment._id}>
                      <span>
                        <strong>{comment.postedBy.name}</strong>
                      </span>{" "}
                      {comment.text}
                    </p>
                  );
                })}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(addComment(item._id, e.target[0].value));
                  e.target.reset();
                }}
              >
                <input
                  type="text"
                  placeholder="Leave a comment"
                  className="form-control my-4 "
                  required
                />
              </form>
              <small>Posted on: {item.createdAt.substring(0, 10)}</small>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
