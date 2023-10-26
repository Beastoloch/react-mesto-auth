import React from "react";

function PopupWithForm(props){

    return (
        <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`} id={`${props.name}-popup`}
             onMouseDown={props.onOverlayClose}>
            <div className="popup__container popup__form-container">
                <button className="popup__exit-button" type="button" onClick={props.onClose}></button>
                <h2 className="popup__title">{props.title}</h2>
                <form id={`popup__${props.name}-form`} className="form" name="delete-form" noValidate onSubmit={props.onSubmit}>
                    {props.children}
                    <button className="popup__admit-button" type="submit">{props.button}</button>
                </form>
            </div>
        </div>
    );
}

export default PopupWithForm