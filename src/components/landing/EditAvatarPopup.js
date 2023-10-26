import React, {useEffect} from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {

    const avatarRef = React.useRef();

    React.useEffect(() => {
        avatarRef.current.value = '';
    }, [props.isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateAvatar(avatarRef.current.value);
    }

    return(
        <PopupWithForm title="Обновить аватар" name="avatar" button="Сохранить" isOpen={props.isOpen}
                       onClose={props.onClose} onSubmit={handleSubmit} onOverlayClose={props.onOverlayClose}>
            <input className="form__input form__input_type_avatar" type="url" placeholder="Ссылка на картинку"
                   id="avatar-input" name="avatar" required ref={avatarRef}/>
            <span className="avatar-input-error"></span>
        </PopupWithForm>
    );
}

export default EditAvatarPopup;