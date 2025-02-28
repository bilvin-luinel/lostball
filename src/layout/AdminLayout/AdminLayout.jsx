import React, { useState, useEffect } from 'react'
import styles from './AdminLayout.module.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ReactComponent as Symbol } from '../../svg/symbol.svg'
import api from '../../util/api'

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [auth, setAuth] = useState(false)
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (auth) {
      fetchTotalProducts()
    }
  }, [auth])

  const fetchTotalProducts = async () => {
    try {
      const response = await api.get('get-item')
      if (response.status === 200) {
        setTotalProducts(response.data.length)
      }
    } catch (err) {
      console.error('상품 데이터 가져오기 실패:', err)
    }
  }

  const handleLogin = async () => {
    const response = await api.post('/admin-login', { id: id, pw: pw })
    if (response.status === 200 && response.data === 'success') {
      setAuth(true)
    } else {
      alert('fail')
    }
  }
  const handleKeyDownLogin = (e) => {
    switch (e.code) {
      case 'Enter':
        handleLogin()
        break;
      case 'NumpadEnter':
        handleLogin()
        break;
      default:
    }
  }

  return (
    <div className={auth === false ? styles.nonAuth : undefined}>
      <div className={styles.wrap} style={{ pointerEvents: auth === false && 'none' }}>
        <h1 className={`${location.pathname === '/admin' && styles.neon}`} onClick={() => navigate('/admin')}>관리자 홈</h1>
        <h1 className={`${location.pathname === '/admin/products' && styles.neon}`} onClick={() => navigate('/admin/products')}>상품 관리</h1>
        <h1 className={`${location.pathname === '/admin/add-product' && styles.neon}`} onClick={() => navigate('/admin/add-product')}>상품 등록</h1>
        <h1 className={`${location.pathname === '/admin/category' && styles.neon}`} onClick={() => navigate('/admin/category')}>카테고리 관리</h1>
        <div className={styles.symbol_wrap} onClick={() => navigate('/')}>
          <Symbol fill='red' />
        </div>
      </div>
      {auth === false && (
        <div className={styles.pw_super_wrap}>
          <div className={styles.pw_wrap}>
            <p>ID</p>
            <input type='text' value={id} onChange={(e) => setId(e.target.value)} />
            <p>PW</p>
            <input type='password' value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={handleKeyDownLogin} />
            <div className={styles.login_btn} onClick={() => handleLogin()}>Login</div>
          </div>
        </div>
      )}
      {(auth === true && location.pathname === '/admin') && (
        <div className={styles.admin_home}>
          <div className={styles.welcome_banner}>
            <Symbol fill='var(--main-red)' />
            <h2>Y-Jun company 관리자 페이지</h2>
            <p>현재 시간: {currentTime.toLocaleString()}</p>
          </div>
          <div className={styles.quick_stats}>
            <div className={styles.stat_card} onClick={() => navigate('/admin/products')} style={{ cursor: 'pointer' }}>
              <h3>총 상품</h3>
              <p>{totalProducts}개</p>
            </div>
            <div className={styles.stat_card}>
              <h3>필드 준비 중</h3>
              <p>n건</p>
            </div>
            <div className={styles.stat_card}>
              <h3>필드 준비 중</h3>
              <p>n건</p>
            </div>
          </div>
        </div>
      )}
      {auth === true && (
        <Outlet />
      )}
    </div>
  )
}

export default AdminLayout