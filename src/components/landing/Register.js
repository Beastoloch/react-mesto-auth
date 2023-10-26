import React, {useRef} from "react";
import {Link} from "react-router-dom";

function Register(props) {

    const emailRef = useRef();
    const passwordRef = useRef();

    function handleSubmit (e){
        e.preventDefault();
        props.onSubmit({
            email: emailRef.current.value,
            password: passwordRef.current.value
        })
    }

    return(
        <div className='auth'>
            <h2 className='popup__title popup__title_auth'>Регистрация</h2>
            <form className='form form_auth' onSubmit={handleSubmit}>
                <input className='form__input form__input_auth' type='email' placeholder='Email'
                       id='email-input' name='email' required minLength="2" maxLength="40" ref={emailRef}/>
                <input className='form__input form__input_auth' type='password' placeholder='Пароль'
                       id='password-input' name='password' required minLength="2" maxLength="40" ref={passwordRef}/>
                <button className='popup__admit-button popup__admit-button_auth'>Зарегистрироваться</button>
            </form>
            <div className='auth__switch'>
                <p>Уже зарегестрированы? <Link to='/sign-in' className='auth__switch-link'>Войти</Link></p>
            </div>
        </div>
    );
}

export default Register