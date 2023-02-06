import '../styles/responsiveSidebar.css';
import {useState} from "react";
import {NavLink, Outlet} from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import dodo from '../assets/images/userIcon.jpg';
import {useAuth} from "../stores/AuthStore";
export const NavBar = () => {
    const {loginValid, logout} = useAuth();
    const [open, setOpen] = useState(false);

    if (!loginValid) {
        return;
    }

    const toggleMenu = () => {
        setOpen(!open);
    };


    return (
        <>
            <div className="nav_header">
                <div className="logo">
                    DodoTodo
                </div>
                <nav className={`${open ? "active" : ""}`}>
                    <ul>
                        <li>
                            <NavLink to="/home" onClick={toggleMenu}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/todo/all" onClick={toggleMenu}>All</NavLink>
                        </li>
                        <li>
                            <NavLink to="/todo/today" onClick={toggleMenu}>Today</NavLink>
                        </li>
                        <li>
                            <NavLink to="/todo/tomorrow" onClick={toggleMenu}>Tomorrow</NavLink>
                        </li>

                        <li>
                            <NavLink to="/user" onClick={toggleMenu}>User</NavLink>
                        </li>
                        <li>
                            <NavLink to="/logout" onClick={() => {
                                logout();
                            }}>Login</NavLink>
                        </li>
                    </ul>
                </nav>
                <div onClick={toggleMenu} className="menu-toggle"><i className="fa fa-bars"></i></div>
            </div>
            <Outlet/>
        </>
    );
};