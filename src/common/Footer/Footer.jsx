import React, { useState } from 'react'
import ss from './Footer.module.css'
import PrivacyModal from '../PrivacyModal/PrivacyModal'

const Footer = () => {
    const [showPrivacyModal, setShowPrivacyModal] = useState(false)

    return (
        <>
            <div className={ss.wrap}>
                <img className={ss.logo} src={`${process.env.PUBLIC_URL}/logo.png`} alt='' />
                <div className={ss.body}>
                    <p className={ss.info_line}>
                        <span><span className={ss.lato}>Y-Jun</span> export trading company&nbsp;|</span>
                        <span>Registration No : 220-04-99901<span className={ss.only_pc}>&nbsp;|</span></span>
                        <span>Tel : +82-31-945-5636&nbsp;|</span>
                        <span>FAX : +82-31-945-5637</span>
                    </p>
                    <p className={ss.info_line}>
                        <span>#3, 55, Solan-gil, Sangjiseok-dong, Paju-si, <span className={ss.only_m}><br /></span>Gyeonggi-do, S/Korea<span className={ss.only_pc}>&nbsp;|</span></span>
                        <span>ZIP code(postcode) : 10911</span>
                    </p>
                    <p className={ss.info_line}>
                        <span>CEO : Steven Youn<span className={ss.only_pc}>&nbsp;|</span></span>
                        <span>Mail : steven@yjun.co.kr</span>
                    </p>
                    <p onClick={() => setShowPrivacyModal(true)}>Privacy Policy</p>
                    <p>ⓒ 2024 Y-Jun company | All rights reserved</p>
                </div>
                <div className={ss.empty}></div>
            </div>
            {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
        </>
    )
}

export default Footer