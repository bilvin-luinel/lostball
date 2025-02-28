import React, { useEffect } from 'react'
import ss from './Contact.module.css'
import img_lv1 from '../../img/Contact/lv1.png'
import img_whatsapp from '../../img/Contact/whatsapp.png'
import img_logo from '../../img/common/logo_column.png'
import img_map from '../../img/Contact/map.png'
import img_call from '../../img/Contact/call.png'
import img_email from '../../img/Contact/images.jpeg'


const Contact = () => {



    return (
        <div className={ss.wrap}>
            <div className={ss.lv1}>
                <img src={img_lv1} alt='' />
                <h2> <br className={ss.only_m} />...</h2>
            </div>
            <div className={ss.lv2}>
                <div className={ss.lv2_left}>
                    <p><span>TEL&nbsp;</span>031-922-0604</p>
                    <p><span>Email&nbsp;</span>usn9514@naver.com</p>
                    <p style={{ marginBottom: '-1vw' }}><span>Address&nbsp;</span></p>
                    <p>경기도 고양시 일산서구 탄중로111</p>
                    <div className={ss.lv2_left_icon}>
                        <img src={img_whatsapp} onClick={()=>alert('카카오톡.')} alt='' />
                        <img src={img_call} onClick={()=>alert('전화걸기')}alt='' />
                        <img src={img_email} onClick={()=>alert('이메일')}alt='' />
                    </div>

                </div>
                <img src={img_map} className={ss.lv2_right} alt='' />
            </div>
        </div>

    )
}

export default Contact