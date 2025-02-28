import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ss from './Products.module.css'
import api from '../../util/api'
import getImgURLFromImgName from '../../util/getImgURLFromImgName'
import { ReactComponent as Symbol } from '../../svg/symbol.svg'
import img_lv1 from '../../img/Products/lv1.png'
import ItemCard from './component/ItemCard/ItemCard'

const Products = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const currentCategory = searchParams.get('category') || ''

    const [allItems, setAllItems] = useState([]) // 모든 상품 저장
    const [filteredItems, setFilteredItems] = useState([]) // 필터링된 상품 저장
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
        fetchData()
    }, [])

    // 카테고리가 변경될 때마다 아이템 필터링
    useEffect(() => {
        if (currentCategory && allItems.length > 0) {
            const filtered = allItems.filter(item => item.category === currentCategory)
            setFilteredItems(filtered)
        }
    }, [currentCategory, allItems])

    useEffect(() => {
        // 카테고리가 로드되었고, 현재 선택된 카테고리가 없다면
        if (categories.length > 0 && !currentCategory) {
            navigate(`/products?category=${categories[0].name}`, { replace: true })
        }
    }, [categories, currentCategory, navigate])

    const fetchCategories = async () => {
        try {
            const response = await api.get('/get-categories')
            if (response.status === 200) {
                setCategories(response.data)
                setIsLoading(false)
            }
        } catch (err) {
            console.error('카테고리 로딩 중 오류:', err)
        }
    }

    const fetchData = async () => {
        try {
            const response = await api.get('/get-item')
            if (response.status === 200) {
                const array = response.data.sort((a, b) => a.index - b.index)
                setAllItems(array)
                setIsLoading(false)
            }
        } catch (err) {
            console.error('아이템 로딩 중 오류:', err)
        }
    }

    const handleCategoryClick = (categoryName) => {
        navigate(`/products?category=${categoryName}`)
    }

    // if (items.length === 0) {
    //     return (
    //         <div>
    //             <h1 style={{ textAlign: 'center', marginTop: '100px' }}>상품이 없습니다.</h1>
    //         </div>
    //     )
    // }

    return (
        <div className={ss.wrap}>
            <div className={ss.lv1}>
                <img src={img_lv1} alt='' />
                <h2>Our Products,<br />Our Solutions</h2>
            </div>
            <div className={ss.lv2}>
                <h3>Our Categories</h3>
                <div className={ss.category_wrap}>
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className={`${ss.category_item} ${currentCategory === category.name ? ss.active : ''}`}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <span>{category.name}</span>
                            <svg className={ss.arrow} viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </div>
                    ))}
                </div>
                {/* 추후 추가 */}
                {/* <button className={ss.download_btn}>
                    <svg className={ss.download_icon} viewBox="0 0 24 24">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                    download_catalog
                </button> */}
            </div>

            <div className={ss.lv3}>
                {/* <h2>Our Products, <br className={ss.only_m} />Our Solutions</h2> */}
                <div className={ss.item_wrap}>
                    {filteredItems.map((item, idx) => (
                        <div key={item._id} className={ss.item_container}>
                            <ItemCard item={item} />
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}

export default Products