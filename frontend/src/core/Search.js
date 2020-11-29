import React, { useState, useEffect } from 'react'
import { getCategories, list } from './apiCore'
import Card from './Card'

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false,
    })

    const { categories, category, search, results, searched } = data

    const loadCategories = () => {
        getCategories().then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setData({ ...data, categories: data })
            }
        })
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const searchData = () => {
        //console.log(search, category)
        if (search) {
            list({ search: search || undefined, category: category }).then(
                (response) => {
                    if (response.error) {
                        console.log(response.error)
                    } else {
                        setData({ ...data, results: response, searched: true })
                    }
                }
            )
        }
    }

    const searchSubmit = (e) => {
        e.preventDefault()

        searchData()
    }

    const handleChange = (name) => (event) => {
        setData({ ...data, [name]: event.target.value, searched: false })
    }

    const searchMessage = (searched, results) => {
        if (searched && results.length === 1) {
            return `Found ${results.length} product`
        }

        if (searched && results.length > 1) {
            return `Found ${results.length} products`
        }

        if (searched && results.length === 0) {
            return `No products found`
        }
    }

    const searchedProduct = (results = []) => {
        return (
            <div>
                <h2 className="mb-4 mt-4">
                    {searchMessage(searched, results)}
                </h2>
                <div className="row">
                    {results.map((product, i) => {
                        return <Card key={i} product={product} />
                    })}
                </div>
            </div>
        )
    }

    const searchForm = () => {
        return (
            <form onSubmit={searchSubmit}>
                <span className="input-group-text bg-dark">
                    <div className="input-group input-group-lg">
                        <div
                            className="input-group-prepend"
                            style={{ border: 'none' }}
                        >
                            <select
                                className="btn mr-2  text-white"
                                onChange={handleChange('category')}
                            >
                                <option value="All" style={{ color: 'black' }}>
                                    All
                                </option>
                                {categories.map((c, i) => {
                                    return (
                                        <option
                                            key={i}
                                            value={c._id}
                                            style={{ color: 'black' }}
                                        >
                                            {c.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <input
                            type="search"
                            className="form-control"
                            onChange={handleChange('search')}
                            placeholder="Search by Name"
                        />
                    </div>
                    <div
                        className="btn input-group-append"
                        style={{ border: 'none' }}
                    >
                        <button className="input-group-text">Search</button>
                    </div>
                </span>
            </form>
        )
    }

    return (
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
            <div className="container-fluid mb-3">
                {searchedProduct(results)}
            </div>
        </div>
    )
}

export default Search
