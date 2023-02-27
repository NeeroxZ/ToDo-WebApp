import {Outlet} from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import {useAuth} from "../stores/AuthStore";
import {NavLink} from "react-router-dom";
import '../styles/navbar.css'
import {useTopics} from "../stores/TopicStore";
import {CircularProgress} from "@mui/material";
import {useGlobalStore} from "../stores/GlobalStore";


export const NavBar = () => {
    const {loginValid, logout} = useAuth();
    const {topics, waiting, error} = useTopics();

    const {showNav, toggleNav} = useGlobalStore();

    if (!loginValid) {
        return;
    }

    const checkTopics = () => {
        return topics.length !== 0;
    };

    const retTopics = () => {
        if (checkTopics()) {
            return (
                <>
                    {topics.map((item, i) =>
                        <NavLink key={i}
                                 to={`/topic/${item.titleParam}`}
                                 onClick={toggleNav}>
                            {item.titleMod}
                        </NavLink>)}
                </>
            );
        } else {
            return (
                <a>No topics</a>
            )
        }
    };



    return (
        <>
            <div className={`topnav ${showNav ? "responsive" : ""}`} id="myTopnav">
                <a style={{display: "none"}}></a>
                <div className="dropdown">
                    <button className="dropbtn">
                        <i className="fa fa-user" aria-hidden="true"></i>

                    </button>
                    <div className="dropdown-content-user">

                            <NavLink to="/user" onClick={toggleNav}>User</NavLink>

                            <NavLink to="/about" onClick={toggleNav}>About</NavLink>

                        <NavLink to="/login" onClick={() => {
                            logout();
                        }}>Logout</NavLink>
                    </div>
                </div>
                <NavLink to="/home" onClick={() => toggleNav()}>Home</NavLink>
                <NavLink to="/todo/all" onClick={() => toggleNav()}>All</NavLink>
                <NavLink to="/todo/today" onClick={() => toggleNav()}>Today</NavLink>
                <NavLink to="/todo/tomorrow" onClick={() => toggleNav()}>Tomorrow</NavLink>
                {waiting
                    ?
                    <CircularProgress className={"dropdown"}/>
                    :
                    <div className="dropdown">
                        <button className="dropbtn">
                            Category
                            <i className="fa fa-caret-down dropdownArrow"></i>
                        </button>
                        <div className="dropdown-content">
                            {waiting
                                ?
                                <div>loading...</div>
                                :
                                retTopics()}
                        </div>
                    </div>
                }


                <a onClick={toggleNav} className="icon">&#9776;</a>
            </div>
            <Outlet/>
        </>
    );
};
