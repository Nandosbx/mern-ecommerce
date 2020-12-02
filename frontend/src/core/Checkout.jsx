import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { getBraintreeClientToken, getProducts, processPayment } from './apiCore'
import { emptyCart } from './cartHelpers'
import Card from './Card'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import DropIn from 'braintree-web-drop-in-react'

const Checkout = ({ products, refresh }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: '',
    })

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    //TODO
    useEffect(() => {
        getPaymentToken(userId, token)
    }, [])

    const getPaymentToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then((data) => {
            if (data.error) {
                setData({ ...data, error: data.error })
            } else {
                setData({ clientToken: data.clientToken })
            }
        })
    }

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    }

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                {' '}
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        )
    }

    const buy = () => {
        setData({ ...data, loading: true })
        let nonce
        let getNonce = data.instance
            .requestPaymentMethod()
            .then((data) => {
                nonce = data.nonce

                //console.log(data)
                //console.log(nonce, getTotal(products))

                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products),
                }

                //console.log(paymentData)

                processPayment(userId, token, paymentData)
                    .then((response) => {
                        setData({ ...data, success: response.success })
                        emptyCart(() => {
                            refresh(true)
                            console.log('payment success and empty cart')
                            setData({ ...data, loading: false, success: true })
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                        setData({ ...data, loading: false })
                    })
            })

            .catch((error) => {
                console.log(error)
                setData({ ...data, error: error.message })
            })
    }

    const showDropIn = () => {
        return (
            <div onBlur={() => setData({ ...data, error: '' })}>
                {data.clientToken !== null && products.length > 0 ? (
                    <div>
                        <DropIn
                            options={{
                                authorization: data.clientToken,
                                paypal: {
                                    flow: 'vault',
                                },
                            }}
                            onInstance={(instance) =>
                                (data.instance = instance)
                            }
                        />
                        <button
                            onClick={buy}
                            className="btn btn-success btn-block"
                        >
                            Pay
                        </button>
                    </div>
                ) : null}
            </div>
        )
    }

    const showError = (error) => {
        return (
            <div
                className="alert alert-danger"
                style={{ display: error ? '' : 'none' }}
            >
                {error}
            </div>
        )
    }

    const showSuccess = (success) => {
        return (
            <div
                className="alert alert-info"
                style={{ display: success ? '' : 'none' }}
            >
                Thanks! Your payment was successful!
            </div>
        )
    }

    const showLoading = (loading) => {
        return loading && <h2>Loading</h2>
    }

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
    )
}

export default Checkout
