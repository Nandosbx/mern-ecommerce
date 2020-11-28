import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import { createProduct } from './apiAdmin'

const AddProduct = () => {
    const { user, token } = isAuthenticated()
    const { values, setValues } = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photos: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: '',
    })

    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData,
    } = values

    const newPostForm = () => {
        return (
            <form className="mb-3">
                <h4>Post Photo</h4>
                <div className="from-group">
                    <label className="btn btn-secondary">
                        <input type="file" name="photo" accept="image/*" />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="">Name</label>
                    <input type="text" className="form-control" value={name} />
                </div>
            </form>
        )
    }

    return (
        <Layout
            title="Add a new category"
            description={`Good day ${user.name}, ready to add a new product?`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">{newPostForm()}</div>
            </div>
        </Layout>
    )
}

export default AddProduct
