import React,{useEffect, useState} from "react";
import {CurrentUserContext} from "../../contexts/CurrentUserContext";
import Card from "./Card";
import api from "../../utils/Api";
import Footer from "./Footer";

function Main(props) {

    const currentUser = React.useContext(CurrentUserContext);


    return (
        <main className="content">
            <section className="profile" id="profile">
                <div className="profile__avatar-border">
                    <img className="profile__avatar" src={`${currentUser.avatar}`}/>
                    <div className="profile__avatar-edit" onClick={props.onEditAvatar}></div>
                </div>
                <div className="profile__info">
                    <div className="profile__edit-line">
                        <h1 className="profile__name">{currentUser.name}</h1>
                        <button className="profile__edit-button" type="button" onClick={props.onEditProfile}></button>
                    </div>
                    <p className="profile__job">{currentUser.about}</p>
                </div>
                <button className="profile__add-button" type="button" onClick={props.onAddPlace}></button>
            </section>
            <section className="elements" id="elements">
                {props.cards.map((card) => (
                    <Card key={card._id} card={card} onCardClick={props.onCardClick}
                          onCardLike={props.onCardLike} onCardDelete={props.onDeletePlace}></Card>
                ))}
            </section>
            <Footer />
        </main>
    );
}

export default Main;