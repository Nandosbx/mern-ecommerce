import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { listOrders } from './apiAdmin'
import moment from 'moment'

const Orders = () => {
    const [orders, setOrders] = useState([])

    const { user, token } = isAuthenticated()

    const loadOrders = () => {
        listOrders(user._id, token).then((data) => {
            if (data.error) {
                console.log(data.error)
                console.log(data.user)
                console.log(data.token)
            } else {
                setOrders(data)
            }
        })
    }

    useEffect(() => {
        loadOrders()
    }, [setOrders])

    const showOrdersLength = () => {
        if (orders.length > 0) {
            return (
                <h1 className="text-danger display-2">
                    Total orders: {orders.length}
                </h1>
            )
        } else {
            return <h1 className="text-danger">No orders</h1>
        }
    }

    return (
        <Layout
            title="Orders"
            description={`Good day ${user.name}, you can manage all the orders here`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showOrdersLength()}

                    {orders.map((order, index) => {
                        console.log(order)
                        return (
                            <div
                                key={index}
                                className="mt-5"
                                style={{ borderBottom: '5px solid indigo' }}
                            >
                                <h2 className="mb-5">
                                    <span className="bg-primary">
                                        Order ID: {order._id}
                                    </span>
                                </h2>

                                <ul className="list-group mb-2">
                                    <li className="list-group-item">
                                        {order.status}
                                    </li>

                                    <li className="list-group-item">
                                        Transaction ID: {order.transaction_id}
                                    </li>

                                    <li className="list-group-item">
                                        Amount: ${order.amount}
                                    </li>

                                    <li className="list-group-item">
                                        Ordered by: {order.user.name}
                                    </li>

                                    <li className="list-group-item">
                                        Ordered on:{' '}
                                        {moment(order.createdAt).fromNow()}
                                    </li>

                                    <li className="list-group-item">
                                        Delivery address: {order.address}
                                    </li>
                                </ul>

                                <h3 className="mt-4 mb-4 font-italic">
                                    Total products in the order:{' '}
                                    {order.products.length}
                                </h3>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}

export default Orders
