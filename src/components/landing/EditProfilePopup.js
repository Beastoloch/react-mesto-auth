import React, {useEffect, useState} from "react";
import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from "../../contexts/CurrentUserContext";
import {submitBtnMessage, submitBtnMessageDefault} from "../../utils/constants";

function EditProfilePopup(props) {

    const currentUser = React.useContext(CurrentUserContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, props.isOpen]);

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateUser({
            name,
            about: description,
        })
    }

    return(
        <PopupWithForm title="Редактировать профиль" name="edit" button={props.btnMessage} isOpen={props.isOpen}
                       onClose={props.onClose} onSubmit={handleSubmit} onOverlayClose={props.onOverlayClose}>
            <input className="form__input form__input_type_name" type="text" placeholder="Имя" value={name || ''}
                   id="name-input" name="name" required minLength="2" maxLength="40" onChange={handleChangeName}/>
            <span className="name-input-error"></span>
            <input className="form__input form__input_type_job" type="text" placeholder="О себе" value={description || ''}
                   id="job-input" name="info" required minLength="2" maxLength="200" onChange={handleChangeDescription}/>
            <span className="job-input-error"></span>
        </PopupWithForm>
    );
}

export default EditProfilePopup