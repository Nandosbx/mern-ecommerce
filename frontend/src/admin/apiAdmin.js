import { API } from '../config'

export const createCategory = (userId, token, category) => {
    //console.log(values)
    return fetch(`${API}/category/create/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
    })
        .then((response) => {
            return response.json({ category })
        })
        .catch((err) => {
            console.log(err)
        })
}

export const createProduct = (userId, token, product) => {
    //console.log(values)
    return fetch(`${API}/product/create/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: product,
    })
        .then((response) => {
            return response.json({ product })
        })
        .catch((err) => {
            console.log(err)
        })
}

export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: 'GET',
    })
        .then((response) => {
            return response.json({})
        })
        .catch((error) => console.log(error))
}
