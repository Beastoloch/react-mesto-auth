import React from "react";
import {CurrentUserContext} from "../../contexts/CurrentUserContext";

function Card(props) {

    const currentUser = React.useContext(CurrentUserContext);

    const isOwn = props.card.owner === currentUser._id;

    const isLiked = props.card.likes.some((i) => i === currentUser._id);

    const cardLikeButtonClassName = (
        `element__like-button ${isLiked && 'element__like-button_active'}`
    );

    const handleClick = () => {
        props.onCardClick(props.card);
    }

    const handleLikeClick = () => {
        props.onCardLike(props.card);
    }

    const handleDeleteClick = () => {
        props.onCardDelete(props.card);
    }

    return(
        <article className="element">
            <img className="element__image" alt={props.card.name} src={props.card.link} onClick={handleClick}/>
            {isOwn && <button className="element__delete-button" type="button" onClick={handleDeleteClick}/>}
            <div className="element__info">
                <h3 className="element__title">{props.card.name}</h3>
                <div className="element__like-section">
                    <button className={cardLikeButtonClassName} onClick={handleLikeClick} type="button"/>
                    <p className="element__like-count">{props.card.likes.length}</p>
                </div>
            </div>
        </article>
    )
}

export default Card