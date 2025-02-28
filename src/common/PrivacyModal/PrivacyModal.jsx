import React, { useEffect } from 'react'
import ss from './PrivacyModal.module.css'

const PrivacyModal = ({ onClose }) => {
    useEffect(() => {
        // 모달이 열릴 때 body 스크롤 막기
        document.body.style.overflow = 'hidden'

        // 모달이 닫힐 때 스크롤 다시 활성화
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <div className={ss.overlay} onClick={onClose}>
            <div className={ss.modal} onClick={e => e.stopPropagation()}>
                <div className={ss.header}>
                    <h2>Privacy Policy</h2>
                    <button className={ss.closeBtn} onClick={onClose}>×</button>
                </div>
                <div className={ss.content}>
                    <section>
                        <h3>Purpose of Personal Information Collection and Use</h3>
                        <p>Your personal information is collected and used solely for identity verification when submitting inquiries.</p>
                        <p>Your contact details and address are used for inquiry verification and emergency communication purposes.</p>
                    </section>
                    <section>
                        <h3>Personal Information Collected</h3>
                        <ul>
                            <li>Name</li>
                            <li>Contact information</li>
                            <li>Email address</li>
                        </ul>
                    </section>
                    <section>
                        <h3>Retention and Usage Period</h3>
                        <p>Your personal information will be retained for one month from the date of inquiry confirmation and then permanently deleted.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default PrivacyModal