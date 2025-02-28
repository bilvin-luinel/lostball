import React, { useCallback, useEffect, useState } from 'react'
import styles from './AppLayout.module.css'
import { Outlet, useLocation } from 'react-router-dom'
import { ReactComponent as Hamburger } from '../../svg/hamburger.svg'
import { ReactComponent as HamburgerClose } from '../../svg/hamburger_close.svg'
import img_logo_transparent from '../../img/common/logo_transparent.png'
import Footer from '../../common/Footer/Footer'

const AppLayout = () => {
    const location = useLocation()
    const [showNavbar, setShowNavbar] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [isTransNav, setIsTransNav] = useState(true)
    const [isProductPage, setIsProductPage] = useState(false)


    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY
        if (currentScrollY > 0 && currentScrollY > lastScrollY) {
            setShowNavbar(false)
        } else {
            setShowNavbar(true)
        }

        if (currentScrollY === 0) {
            setIsTransNav(true)
        } else {
            setIsTransNav(false)
        }
        setLastScrollY(currentScrollY)
    }, [lastScrollY])
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    const handleNavigation = (path) => {
        setIsProductPage(path.startsWith('/product/'))  // /product/로 시작하는 경우만 true
        window.location.href = path
    }

    useEffect(() => {
        // URL이 /product/로 시작하는 경우만 true로 설정
        setIsProductPage(location.pathname.startsWith('/product/'))
    }, [location.pathname])

    return (
        <div className={styles.super_wrap}>
            <div className={`
                ${styles.wrap} 
                ${isMobileMenu && styles.m_wrap_border} 
                ${(!isMobileMenu && !showNavbar) ? styles.wrap_hidden : styles.wrap_visible} 
                ${(!isMobileMenu && isTransNav && !isProductPage) && styles.transNav} 
                ${isProductPage && styles.productPage}
            `}>
                <img 
                    className={styles.logo} 
                    src={(!isMobileMenu && isTransNav && !isProductPage) ? img_logo_transparent : `${process.env.PUBLIC_URL}/logo.png`} 
                    onClick={() => window.location.href = '/'} 
                    alt='' 
                />
                <div className={styles.right_wrap}>
                    <div className={styles.menu_wrap}>
                        <p onClick={() => window.location.href = '/'}>Home</p>
                        <p onClick={() => window.location.href = '/about-us'}>About Us</p>
                        {/* <p onClick={() => window.location.href = '/products'}>Product</p> */}
                        <p onClick={() => window.location.href = '/contact'}>Contact</p>
                        {/* <p onClick={() => window.location.href = '/inquiry'}>Inquiry</p> */}
                    </div>

                </div>
                {isMobileMenu ?
                    <HamburgerClose className={styles.m_hamburger_close} onClick={() => setIsMobileMenu(false)} />
                    :
                    <Hamburger className={styles.m_hamburger} onClick={() => setIsMobileMenu(true)} />}
            </div>
            {isMobileMenu && (
                <div className={`${styles.m_menu} ${isTransNav && styles.transNav}`}>
                    <p onClick={() => window.location.href = '/about-us'}>About Us</p>
                    {/* <p onClick={() => window.location.href = '/products'}>Product</p> */}
                    <p onClick={() => window.location.href = '/contact'}>Contact</p>
                    {/* <p onClick={() => window.location.href = '/inquiry'}>Inquiry</p> */}
                </div>
            )}

            <Outlet />
            <Footer />
        </div>
    )
}

export default AppLayout