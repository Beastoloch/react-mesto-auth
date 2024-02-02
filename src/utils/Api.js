import {authUrl} from "./constants";

class Api {
    constructor(url) {
        this._baseUrl = url;
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
                authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return this._getResponseData(res)
            });
    }

    getUserInfo(jwt){
        return fetch(`${this._baseUrl}/users/me`, {
            headers: {
                authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return this._getResponseData(res)
            });
    }

    postNewCard(name, link, jwt) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
                headers: {
                    authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
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
                    authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
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
                    authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
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
                    authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                }
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    deleteCard(id, jwt) {
        return fetch(`${this._baseUrl}/cards/${id}`, {
            method: 'DELETE',
                headers: {
                    authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                }
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }
}

const api = new Api(authUrl);

export default api;

