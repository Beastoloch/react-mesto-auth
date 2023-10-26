import React, {useEffect, useState} from "react";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import Header from "./landing/Header";
import Main from "./landing/Main";
import ImagePopup from "./landing/ImagePopup";
import EditProfilePopup from "./landing/EditProfilePopup";
import EditAvatarPopup from "./landing/EditAvatarPopup";
import AddPlacePopup from "./landing/AddPlacePopup";
import DeletePlacePopup from "./landing/DeletePlacePopup";
import Register from "./landing/Register";
import Login from "./landing/Login";
import {authMessageSuccess, authMessageFailure, deleteBtnMessage, submitBtnMessage} from "../utils/constants";
import ProtectedRouteElement from "./landing/ProtectedRoute";
import api from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import InfoTooltip from "./landing/InfoTooltip";

function App() {

    const [isAddPlacePopupOpen, setAddPlacePopupState] = useState(false);
    const [isEditAvatarPopupOpen, setEditAvatarPopupState] = useState(false);
    const [isEditProfilePopupOpen, setEditProfilePopupState] = useState(false);
    const [isDeletePlacePopupOpen, setDeletePlacePopupState] = useState(false);
    const [isInfoTooltipPopupOpen, setInfoTooltipPopupState] = useState(false);
    const [isAnyPopupOpen, setAnyPopupState] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    const [cardToDelete, setCardToDelete] = useState({});
    const [isImagePopupOpen, setImagePopupState] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [authMessage, setAuthMessage] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if(isTokenExist()){
            api.checkToken(localStorage.getItem('jwt'))
                .then(value => {
                    if(value) {
                        setCurrentUser(value.data);
                        setLoggedIn(true);
                        navigate('/', {replace: true})
                    }
                })
                .catch((err)=>{
                    console.log(`Ошибка...: ${err}`);
                    navigate('/sign-in', {replace: true});
                });
        }
    }, [loggedIn])

    useEffect(() => {
        if(isTokenExist()){
            api.getInitialCards(localStorage.getItem('jwt'))
                .then(value => {
                    setCards(value.data.reverse());
                })
                .catch((err)=>{
                    console.log(`Ошибка...: ${err}`);
                })
        }
    }, [loggedIn]);

    useEffect(() => {
        const close = (evt) => {
            if(evt.key === 'Escape'){
                closeAllPopups();
            }
        }
        window.addEventListener('keydown', close);
        return () => window.removeEventListener('keydown', close)
    },[isAnyPopupOpen]);

    const isTokenExist = () => {
        return localStorage.getItem('jwt')
    }

    const handleOverlayClose = (evt) => {
        if(evt.target === evt.currentTarget)
            closeAllPopups();
    }

    const handleEditAvatarClick = () => {
        setEditAvatarPopupState(true);
        setAnyPopupState(true);
    }

    const handleEditProfileClick = () => {
        setEditProfilePopupState(true);
        setAnyPopupState(true);
    }

    const handleAddPlaceClick = () => {
        setAddPlacePopupState(true);
        setAnyPopupState(true);
    }

    const handleDeletePlaceClick = (card) => {
        setDeletePlacePopupState(true);
        setAnyPopupState(true);
        setCardToDelete(card);
    }

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setImagePopupState(true);
        setAnyPopupState(true);
    }

    const handleCardLike = (card) => {
        const isLiked = card.likes.some((i) => i === currentUser._id);
        api.changeLikeCardStatus(card._id, !isLiked, localStorage.getItem('jwt'))
            .then((newCard) => {
                setCards((state) =>
                    state.map((c) =>
                        c._id === card._id ? newCard.data : c));
            })
            .catch((err)=>{
                console.log(`Ошибка...: ${err}`);
            })
    }

    const handleCardDelete = (card) => {
        api.deleteCard(card._id, localStorage.getItem('jwt'))
            .then((deletedCard) => {
                setCards((state) =>
                    state.filter((c) =>
                        c._id !== card._id))
                closeAllPopups();
            })
            .catch((err)=>{
                console.log(`Ошибка...: ${err}`);
            })
    }

    const handleUpdateUser = (userInfo) => {
        api.setUserInfo(userInfo.name, userInfo.about, localStorage.getItem('jwt'))
            .then(user => {
                setCurrentUser(user.data);
                closeAllPopups();
            })
            .catch((err)=>{
                console.log(`Ошибка...: ${err}`);
            })
    }

    const handleUpdateAvatar = (avatarLink) => {
        api.setUserAvatar(avatarLink, localStorage.getItem('jwt'))
            .then(user => {
                setCurrentUser(user.data);
                closeAllPopups();
            })
            .catch((err)=>{
                console.log(`Ошибка...: ${err}`);
            })
    }

    const handleAddPlaceSubmit = (card) => {
        api.postNewCard(card.name, card.link, localStorage.getItem('jwt'))
            .then(newCard => {
                setCards([newCard.data, ...cards]);
                closeAllPopups();
            })
            .catch((err)=>{
                console.log(`Ошибка...: ${err}`);
            })
    }

    const handleRegisterSubmit = (authInfo) => {
        api.registerUser(authInfo.email, authInfo.password)
            .then((data) => {
                data ? setAuthMessage(authMessageSuccess) : setAuthMessage(authMessageFailure);
                setInfoTooltipPopupState(true);
                setAnyPopupState(true);
            })
            .catch(err => {
                console.log(`Ошибка...: ${err}`);
                setAuthMessage(authMessageFailure);
                setInfoTooltipPopupState(true);
                setAnyPopupState(true);
            });
    }

    const handleLoginSubmit = (authInfo) => {
        api.loginUser(authInfo.email, authInfo.password)
            .then((data) => {
                localStorage.setItem('jwt', data.token);
                setLoggedIn(true);
                navigate('/', {replace: false})
            })
            .catch(err => {
                console.log(`Ошибка...: ${err}`);
                setAuthMessage(authMessageFailure);
                setInfoTooltipPopupState(true);
                setAnyPopupState(true);
            });
    }

    const handleLogOut = () => {
        localStorage.clear();
        setLoggedIn(false);
        navigate('/sign-in', {replace: true});
        setCurrentUser({});
        setCards([]);
    }

    const closeAllPopups = () => {
        setEditAvatarPopupState(false);
        setEditProfilePopupState(false);
        setAddPlacePopupState(false);
        setImagePopupState(false);
        setDeletePlacePopupState(false);
        setInfoTooltipPopupState(false);
        setAnyPopupState(false);
    }
    return (
        <div className="page">
            <CurrentUserContext.Provider value={currentUser}>
                <Header loggedIn={loggedIn} onLogOut={handleLogOut}/>
                <Routes>
                    <Route path='/'
                           element={<ProtectedRouteElement
                               element={Main} onCardClick={handleCardClick} onEditAvatar={handleEditAvatarClick}
                               onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick}
                               cards={cards} onCardLike={handleCardLike} onDeletePlace={handleDeletePlaceClick} loggedIn={loggedIn}/>}/>
                    <Route path='/sign-up' element={(!loggedIn) ? <Register onSubmit={handleRegisterSubmit}/>  : <Navigate to='/' replace />}/>
                    <Route path='/sign-in' element={(!loggedIn) ? <Login onSubmit={handleLoginSubmit}/>  : <Navigate to='/' replace />}/>
                </Routes>
                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}
                                 onOverlayClose={handleOverlayClose}/>
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}
                                 onOverlayClose={handleOverlayClose}/>
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}
                                 onOverlayClose={handleOverlayClose}/>
                <DeletePlacePopup isOpen={isDeletePlacePopupOpen} onClose={closeAllPopups} onDeletePlace={handleCardDelete}
                                 cardToDelete={cardToDelete} onOverlayClose={handleOverlayClose}/>
                <ImagePopup selectedCard={selectedCard} isOpen={isImagePopupOpen} onClose={closeAllPopups} />
                <InfoTooltip authMessage={authMessage} isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups}
                                 onOverlayClose={handleOverlayClose}/>
            </CurrentUserContext.Provider>
        </div>
    );
}

export default App;
