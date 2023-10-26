import {options} from "./constants";

class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl;
        this._headers = options.headers;
    }

    _getResponseData(res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`)
        }
        return res.json();
    }

    getInitialCards(){
        return fetch(`${this._baseUrl}/cards`,
            {headers: this._headers})
            .then((res) => {
                return this._getResponseData(res).then((data) => {
                    return data.reverse();
                })
            });
    }

    getUserInfo(){
        return fetch(`${this._baseUrl}/users/me`,
            {headers: this._headers})
            .then((res) => {
                return this._getResponseData(res)
            });
    }

    postNewCard(name, link) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name: name,
                link: link
            })
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    setUserInfo(name, info){
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: name,
                about: info
            })
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    setUserAvatar(link) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: link,
            })
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    changeLikeCardStatus(id, isLiked) {
        return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: isLiked ? 'PUT' : 'DELETE',
            headers: this._headers,
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    deleteCard(id) {
        return fetch(`${this._baseUrl}/cards/${id}`, {
            method: 'DELETE',
            headers: this._headers,
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }
}

const api = new Api(options);

export default api;

