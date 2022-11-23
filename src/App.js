import { BrowserRouter as Router, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from './components/Footer'
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AddPost from "./screens/AddPost";
import UserProfile from "./screens/UserProfile";
import FollowingPage from "./screens/FollowingPage";
import AllUsers from "./screens/AllUsers";

const App = () => {
  return (
    <Router>
      <Header />
      <ToastContainer />
      <section className="container py-4" style={{backgroundColor: '#FAFAFA'}}>
        <Route path='/register' component={RegisterScreen} />
        <Route path='/login' component={LoginScreen} />
        <Route path='/profile' component={ProfileScreen} exact/>
        <Route path='/create' component={AddPost} />
        <Route path='/profile/:id' component={UserProfile} />
        <Route path='/followingPosts' component={FollowingPage} />
        <Route path='/search/:keyword' component={AllUsers} />
        <Route path='/users' component={AllUsers} />
        <Route path='/' component={HomeScreen} exact />
      </section>
      <Footer />
    </Router>
  );
};

export default App;
