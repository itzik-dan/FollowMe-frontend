import { Fragment, useState } from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  FireFilled,
  PlusOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("home");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div>
      <Menu
        onClick={handleClick}
        defaultSelectedKeys={current}
        mode="horizontal"
        theme="dark"
      >
        <Item key="home" icon={<FireFilled />} style={{ flex: "1" }}>
          <Link to="/">
            <strong>FollowMe</strong>
          </Link>
        </Item>

        {userInfo && (
          <Fragment>
            <Item key="search" className="float-right">
              <span className="float-right p-1">
                <SearchBox />
              </span>
            </Item>
            <Item key="create" icon={<PlusOutlined />} className="float-right">
              <Link to="/create"> Create Post</Link>
            </Item>
            <Item key="list" className="float-right" icon={<HeartOutlined />}>
              <Link to="/followingPosts"> Following</Link>
            </Item>
            <Item
              key="users"
              className="float-right"
              icon={<UsergroupAddOutlined />}
            >
              <Link to="/users"> Users</Link>
            </Item>
            <SubMenu
              key="SubMenu"
              icon={<SettingOutlined />}
              title={" " + userInfo.name}
            >
              <Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">Profile</Link>
              </Item>
              <Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={logoutHandler}
              >
                Logout
              </Item>
            </SubMenu>
          </Fragment>
        )}

        {!userInfo && (
          <Fragment>
            <Item key="login" icon={<UserOutlined />} className="float-right">
              <Link to="/login">Login</Link>
            </Item>
            <Item
              key="register"
              icon={<UserAddOutlined />}
              className="float-right"
            >
              <Link to="/register">Register</Link>
            </Item>
          </Fragment>
        )}
      </Menu>
    </div>
  );
};

export default Header;
