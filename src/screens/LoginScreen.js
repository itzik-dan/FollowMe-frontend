import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { login } from "../actions/userActions";
import { Button, Space, Spin } from "antd";

const LoginScreen = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  // Fetching logged in user info from redux state
  const userLogin = useSelector((state) => state.userLogin);

  const { loading, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      history.push("/");
    }
  }, [history, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Dispatch login action
    dispatch(login(email, password));
  };

  const loginForm = () => (
    <form>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <br />
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="primary"
          block
          onClick={handleSubmit}
          disabled={!email || password.length < 6}
          icon={<MailOutlined />}
          size="large"
        >
          Login
        </Button>
      </Space>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? <Spin size="large" /> : <h2>Login</h2>}
          {loginForm()}

          <Link to="/register" className="float-right text-danger">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
