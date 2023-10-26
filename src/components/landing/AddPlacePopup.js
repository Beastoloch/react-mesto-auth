import React, {useRef} from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {

    const titleRef = useRef();
    const linkRef = useRef();

    React.useEffect(() => {
        titleRef.current.value = '';
        linkRef.current.value = '';
    }, [props.isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        props.onAddPlace({
            name: titleRef.current.value,
            link: linkRef.current.value
        });
    }

    return(
        <PopupWithForm title="Новое место" name="add" button={props.btnMessage} isOpen={props.isOpen}
                       onClose={props.onClose} onSubmit={handleSubmit} onOverlayClose={props.onOverlayClose}>
            <input className="form__input form__input_type_place" type="text" placeholder="Название" id="place-input"
                   name="place-input" required minLength="2" maxLength="30" ref={titleRef}/>
            <span className="place-input-error"></span>
            <input className="form__input form__input_type_image" type="url" placeholder="Ссылка на картинку"
                   id="image-input" name="image-input" required ref={linkRef}/>
            <span className="image-input-error"></span>
        </PopupWithForm>
    );
}

export default AddPlacePopup;