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
