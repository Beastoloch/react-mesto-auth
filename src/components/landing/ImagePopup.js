import React from "react";

function ImagePopup(props){

    const handleOverlayClose = (evt) => {
        if(evt.target === evt.currentTarget)
            props.onClose()
    }

    return(
        <div className={`popup popup_theme_dark ${props.isOpen ? 'popup_opened' : ''}`} id="image-popup"
             onMouseDown={handleOverlayClose}>
            <div className="popup__container popup__image-container">
                <img className="popup__image" src={props.selectedCard.link}
                     alt="Ваша картинка в полном размере"/>
                <p className="popup__image-title">{props.selectedCard.name}</p>
                <button className="popup__exit-button" type="button" onClick={props.onClose}></button>
            </div>
        </div>
    );
}

export default ImagePopup