import React from "react";
import {Link, useLocation, useRoutes} from "react-router-dom";
import {CurrentUserContext} from "../../contexts/CurrentUserContext";

function Header(props){

    const currentUser = React.useContext(CurrentUserContext);

    const location = useLocation();

    const authPath = () => {
        return location.pathname === '/sign-up' ?
            <Link to='/sign-in' className='header__auth'>Войти</Link> :
            <Link to='/sign-up' className='header__auth'>Регистрация</Link>
    }

    return (
        <header className="header" id="header">
            <div className="header__logo"></div>
            {props.loggedIn ?
                <div className='header__info'>
                    <p className='header__email'>{currentUser.email}</p>
                    <Link to='/sign-in' onClick={props.onLogOut} className='header__log-out'>Выйти</Link>
                </div> : authPath()}
        </header>
    );
}

export default Header;