import React from 'react'
import { Link } from 'react-router-dom'
import ShowImage from './ShowImage'
import moment from 'moment'
//import 'moment/locale/pt-br'
//moment.locale('pt-br')

const Card = ({ product, showViewProductButton = true }) => {
    const showViewButton = (showViewProductButton) => {
        return (
            showViewProductButton && (
                <Link to={`/product/${product._id}`} className="mr-2">
                    <button className="btn btn-outline-info mt-2 mb-2 mr-2">
                        View Product
                    </button>
                </Link>
            )
        )
    }

    return (
        <div className="card">
            <div className="card-header bg-dark text-white">{product.name}</div>
            <div className="card-body">
                <ShowImage item={product} url="product" />
                <p className="lead mt-2">
                    {product.description.substring(0, 100)}
                </p>
                <p className="black-9">${product.price}</p>
                <p className="black-8">
                    Category: {product.category && product.category.name}
                </p>
                <p className="black-8">
                    Added on {moment(product.createdAt).fromNow()}
                </p>
                {showViewButton(showViewProductButton)}

                <button className="btn btn-outline-warning mt-2 mb-2">
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default Card
