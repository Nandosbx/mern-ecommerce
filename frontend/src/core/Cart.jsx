import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { Link } from 'react-router-dom'
import { getCart, removeItem } from './cartHelpers'
import Card from './Card'
import Checkout from './Checkout'

const Cart = () => {
    const [items, setItems] = useState([])

    useEffect(() => {
        setItems(getCart())
    }, [items])

    const showItems = (items) => {
        return (
            <div>
                <h2 className="mb-4">
                    Your cart has {`${items.length}`} items
                </h2>
                <hr />
                {items.map((product, i) => (
                    <Card
                        key={i}
                        product={product}
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                    />
                ))}
            </div>
        )
    }

    const noItemsMessage = () => {
        return (
            <div>
                <h2 className="mb-4">
                    Your cart is empty.
                    <hr />
                    <Link to="/shop">Continue Shopping</Link>
                </h2>
            </div>
        )
    }

    return (
        <Layout
            title="Shopping Cart"
            description="Manage your car items. Add, remove, checkout or continue shopping"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-6">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </div>

                <div className="col-6">
                    <h2 className="mb-4">Your cart summary</h2>
                    <hr />
                    <Checkout products={items} />
                </div>
            </div>
        </Layout>
    )
}

export default Cart
