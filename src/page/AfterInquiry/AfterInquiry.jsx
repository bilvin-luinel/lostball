import React, { useEffect, useState } from 'react'
import ss from './AfterInquiry.module.css'
import img_right1 from '../../img/AboutUs/about1.png'
import img_right2 from '../../img/AfterInquiry/right2.png'
import img_logo_trans from '../../img/common/logo_transparent.png'
import api from '../../util/api'
import img_whats from '../../img/AfterInquiry/whatsapp.png'

const AfterInquiry = () => {
    const [recommendItems, setRecommendItems] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await api.get('/get-item')
            if (response.status === 200) {
                // 추천 상품만 필터링하고 인덱스 순으로 정렬
                const recommendedItems = response.data
                    .filter(item => item.recommend?.recommend)
                    .sort((a, b) => a.recommend.index - b.recommend.index)
                    .slice(0, 4) // 최대 4개만 표시
                setRecommendItems(recommendedItems)
            }
        } catch (err) {
            console.error('추천 상품 로딩 중 오류:', err)
        }
    }

    return (
        <div className={ss.wrap}>
            <div className={ss.lv1}>
                <h2>Thank you for reaching out.</h2>
                <p>We have received your inquiry and will get back to you shortly.</p>
            </div>
            <div className={ss.lv2}>
                <div className={ss.lv2_left}>
                    {recommendItems.length > 0 && recommendItems.map((item, idx) => (
                        <div key={idx} className={ss.item} onClick={() => window.location.href = `/product/${item._id}`}>
                            <img src={`https://yjun.co.kr:8989/uploads/${item.mainImg}`} alt='' />
                            <div>
                                <h3>{item.name}</h3>
                                <p>{item.modelName}</p>
                            </div>
                        </div>
                    ))}
                    <p className={ss.more} onClick={() => window.location.href = '/products'}>View More Products</p>
                </div>
                <div className={ss.lv2_right}>
                    <div className={ss.right1} style={{ backgroundImage: `url(${img_right1})` }}>
                        <h3>Looking forward to<br className={ss.only_m} /> staying <br className={ss.only_pc} />In touch!</h3>
                        <img src={img_whats} alt='' />
                        {/* <p>Click to Chat</p> */}
                    </div>
                    <div className={ss.right2} style={{ backgroundImage: `url(${img_right2})` }}>
                        <h3>We, <span>Y-Jun</span>&nbsp;&nbsp;will<br />always support you!</h3>
                    </div>
                    <div className={ss.right3}>
                        <h3>Go back to</h3>
                        <img src={img_logo_trans} alt='' onClick={() => window.location.href = '/'} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AfterInquiry