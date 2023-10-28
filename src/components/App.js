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
import {
    authMessageSuccess, authMessageFailure, submitBtnMessage, submitBtnMessageDefault,
    deleteBtnMessage, deleteBtnMessageDefault, createBtnMessageDefault
} from "../utils/constants";
import ProtectedRouteElement from "./landing/ProtectedRoute";
import api from "../utils/Api";
import {registerUser, loginUser, checkToken} from "../utils/auth";
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
    const [userEmail, setUserEmail] = useState('');
    const [submitBtn, setSubmitBtn] = useState(submitBtnMessageDefault);
    const [deleteBtn, setDeleteBtn] = useState(deleteBtnMessageDefault);
    const [createBtn, setCreateBtn] = useState(createBtnMessageDefault);
    const navigate = useNavigate();

    useEffect(() => {
        if(isTokenExist()){
            Promise.all([
                api.getUserInfo(),
                api.getInitialCards()
            ])
                .then((values) => {
                    let userLoadedInfo, cardsData;
                    [userLoadedInfo, cardsData] = values;
                    setCurrentUser(userLoadedInfo);
                    setCards(cardsData);
                })
                .catch((err)=>{
                    console.log(`Ошибка...: ${err}`);
                })
        }
    }, [loggedIn]);

    useEffect(() => {
        if(isTokenExist()){
            checkToken(localStorage.getItem('jwt'))
                .then(value => {
                    if(value) {
                        setUserEmail(value.data.email);
                        setLoggedIn(true);
                        navigate('/', {replace: true})
                    }
                })
                .catch((err)=>{
                    console.log(`Ошибка...: ${err}`);
                    navigate('/sign-in', {replace: true});
                });
        }
    }, [])

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
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) =>
                    state.map((c) =>
                        c._id === card._id ? newCard : c));
            })
            .catch((err)=>{
                console.log(`Ошибка...: ${err}`);
            })
    }

    const handleCardDelete = (card) => {
        setDeleteBtn(deleteBtnMessage);
        api.deleteCard(card._id)
            .then((deletedCard) => {
                setCards((state) =>
                    state.filter((c) =>
                        c._id !== card._id))
                closeAllPopups();
            })
            .catch((err)=>{
                console.log(`Ошибка...: ${err}`);
            })
            .finally(() => {
                setDeleteBtn(deleteBtnMessageDefault);
            })
    }

    const handleUpdateUser = (userInfo) => {
        setSubmitBtn(submitBtnMessage);
        api.setUserInfo(userInfo.name, userInfo.about)
            .then(user => {
                setCurrentUser(user);
                closeAllPopups();
            })
            .catch((err)=>{
                console.log(`Ошибка...: ${err}`);
            })
            .finally(() => {
                setSubmitBtn(submitBtnMessageDefault);
            })
    }

    const handleUpdateAvatar = (avatarLink) => {
        setSubmitBtn(submitBtnMessage);
        api.setUserAvatar(avatarLink)
            .then(user => {
                setCurrentUser(user);
                closeAllPopups();
            })
            .catch((err)=>{
                console.log(`Ошибка...: ${err}`);
            })
            .finally(() => {
                setSubmitBtn(submitBtnMessageDefault);
            })
    }

    const handleAddPlaceSubmit = (card) => {
        setCreateBtn(submitBtnMessage);
        api.postNewCard(card.name, card.link)
            .then(newCard => {
                setCards(state => [newCard, ...state]);
                closeAllPopups();
            })
            .catch((err)=>{
                console.log(`Ошибка...: ${err}`);
            })
            .finally(() => {
                setCreateBtn(createBtnMessageDefault);
            })
    }

    const handleRegisterSubmit = (authInfo) => {
        registerUser(authInfo.email, authInfo.password)
            .then((data) => {
                data ? setAuthMessage(authMessageSuccess) : setAuthMessage(authMessageFailure);
                setInfoTooltipPopupState(true);
                setAnyPopupState(true);
                navigate('/sign-in', {replace: true})
            })
            .catch(err => {
                console.log(`Ошибка...: ${err}`);
                setAuthMessage(authMessageFailure);
                setInfoTooltipPopupState(true);
                setAnyPopupState(true);
            });
    }

    const handleLoginSubmit = (authInfo) => {
        loginUser(authInfo.email, authInfo.password)
            .then((data) => {
                localStorage.setItem('jwt', data.token);
                setLoggedIn(true);
                navigate('/', {replace: true})
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
                <Header loggedIn={loggedIn} onLogOut={handleLogOut} userEmail={userEmail}/>
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
                                 onOverlayClose={handleOverlayClose} btnMessage={submitBtn}/>
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}
                                 onOverlayClose={handleOverlayClose} btnMessage={createBtn}/>
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}
                                 onOverlayClose={handleOverlayClose} btnMessage={submitBtn}/>
                <DeletePlacePopup isOpen={isDeletePlacePopupOpen} onClose={closeAllPopups} onDeletePlace={handleCardDelete}
                                 cardToDelete={cardToDelete} onOverlayClose={handleOverlayClose} btnMessage={deleteBtn}/>
                <ImagePopup selectedCard={selectedCard} isOpen={isImagePopupOpen} onClose={closeAllPopups} />
                <InfoTooltip authMessage={authMessage} isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups}
                                 onOverlayClose={handleOverlayClose}/>
            </CurrentUserContext.Provider>
        </div>
    );
}

export default App;
