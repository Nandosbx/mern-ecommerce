import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { getCategories } from './apiCore'
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

    const searchSubmit = () => {}

    const handleChange = () => {}

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
                                    Pick Category
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
        </div>
    )
}

export default Search
