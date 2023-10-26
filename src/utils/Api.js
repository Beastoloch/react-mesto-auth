import {options} from "./constants";

class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl;
    }

    _getResponseData(res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`)
        }
        return res.json();
    }

    getInitialCards(jwt){
        return fetch(`${this._baseUrl}/cards`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${jwt}`
            }
        })
            .then((res) => {
                return this._getResponseData(res).then((data) => {
                    return data;
                })
            });
    }

    postNewCard(name, link, jwt) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${jwt}`
            },
            body: JSON.stringify({
                name: name,
                link: link
            })
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    setUserInfo(name, info, jwt){
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${jwt}`
            },
            body: JSON.stringify({
                name: name,
                about: info
            })
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    setUserAvatar(link, jwt) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${jwt}`
            },
            body: JSON.stringify({
                avatar: link,
            })
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    changeLikeCardStatus(id, isLiked, jwt) {
        return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: isLiked ? 'PUT' : 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${jwt}`
            },
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    deleteCard(id, jwt) {
        return fetch(`${this._baseUrl}/cards/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${jwt}`
            },
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    registerUser(email, password) {
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    loginUser(email, password) {
        return fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    checkToken(jwt) {
        return fetch(`${this._baseUrl}/users/me`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${jwt}`
            }
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }
}

const api = new Api(options);

export default api;

