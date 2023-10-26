import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeletePlacePopup(props) {

    function handleSubmit(e) {
        e.preventDefault();
        props.onDeletePlace(props.cardToDelete);
    }

    return(
        <PopupWithForm title="Вы уверены?" name="delete" button={props.btnMessage} isOpen={props.isOpen} onClose={props.onClose}
               onSubmit={handleSubmit} onOverlayClose={props.onOverlayClose}/>
    );
}

export default DeletePlacePopup