import React from 'react'
import ss from './ItemCard.module.css'
import img_icon1 from '../../../../img/icon/item_icon1.png'
import img_icon2 from '../../../../img/icon/item_icon2.png'
import img_icon3 from '../../../../img/icon/item_icon3.png'
import baseURL from '../../../../data/baseURL'

const ItemCard = ({ item }) => {
    return (
        <div className={ss.wrap}>
            <div className={ss.lv1}>
                <h3>{item.category}</h3>
                <p onClick={() => window.location.href = `/product/${item._id}`}>View More</p>
            </div>
            <h2>{item.name}</h2>
            <div className={ss.lv2}>
                <img src={`${baseURL}/uploads/${item.mainImg}`} />
                <div className={ss.lv2_body}>
                    {item.applications && item.applications.length > 0 && (
                        <>
                            {/* <h3>Application</h3> */}
                            <div className={ss.icon_wrap}>
                                {item.applications.includes(0) && (
                                    <div>
                                        <img src={img_icon1} />
                                        <span>semi-<br />conductor</span>
                                    </div>
                                )}
                                {item.applications.includes(1) && (
                                    <div>
                                        <img src={img_icon2} />
                                        <span>lead frame</span>
                                    </div>
                                )}
                                {item.applications.includes(2) && (
                                    <div>
                                        <img src={img_icon3} />
                                        <span>electronic<br />parts</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    <p>{item.noticeContent.content1}</p>
                    <p>{item.noticeContent.content2}</p>
                    <span>{item.noticeContent.content3}</span>
                </div>
            </div>
        </div>
    )
}

export default ItemCard