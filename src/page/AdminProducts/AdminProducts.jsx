import React, { useEffect, useState } from 'react'
import styles from './AdminProducts.module.css'
import api from '../../util/api'
import getImgURLFromImgName from '../../util/getImgURLFromImgName'
import { useNavigate } from 'react-router-dom'

const AdminProducts = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showHomeNoticeModal, setShowHomeNoticeModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [homeNoticeForm, setHomeNoticeForm] = useState({
    notice: false,
    index: ''
  })
  const [showRecommendModal, setShowRecommendModal] = useState(false)
  const [recommendForm, setRecommendForm] = useState({
    recommend: false,
    index: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await api.get('get-item')
      if (response.status === 200) {
        const array = response.data.sort((a, b) => a.index - b.index)
        setItems(array)
        setIsLoading(false)
      }
    } catch (err) {

    }
  }

  const handleRemoveItem = async (item) => {
    try {
      if (window.confirm(`정말 ${item.name}을(를) 삭제하시겠습니까?`) === true) {
        setIsLoading(true)
        const response = await api.get(`/handle-remove-item?itemId=${item._id}`)
        if (response.status === 200) {
          alert('상품이 삭제되었습니다.')
          fetchData()
          return
        } else {
          alert('서버에서 알 수 없는 에러 발생')
          setIsLoading(false)
          return
        }
      } else {
        return
      }
    } catch (err) {

    }
  }

  const handleChangeIndex = async (type, index) => {
    if (type === 'up' && items.filter((item, idx) => item.index === index - 1).length === 0) {
      return
    } else if (type === 'down' && items.filter((item, idx) => item.index === index + 1).length === 0) {
      return
    }
    try {
      setIsLoading(true)
      const response = await api.get(`/handle-change-product-index?type=${type}&index=${index}`)
      if (response.status === 200) {
        fetchData()
      } else {
        alert('서버에서 알 수 없는 오류 발생')
        setIsLoading(false)
        return
      }
    } catch (err) {

    }
  }

  const handleHomeNoticeClick = (item) => {
    setSelectedItem(item)
    setHomeNoticeForm({
      notice: item.homeNotice?.notice || false,
      index: item.homeNotice?.index || ''
    })
    setShowHomeNoticeModal(true)
  }

  const handleHomeNoticeSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await api.post('/update-home-notice', {
        itemId: selectedItem._id,
        homeNotice: homeNoticeForm
      })
      if (response.status === 200) {
        alert('홈 화면 노출 설정이 저장되었습니다.')
        setShowHomeNoticeModal(false)
        fetchData()
      }
    } catch (err) {
      alert('설정 저장 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  const handleRecommendClick = (item) => {
    setSelectedItem(item)
    setRecommendForm({
      recommend: item.recommend?.recommend || false,
      index: item.recommend?.index || ''
    })
    setShowRecommendModal(true)
  }

  const handleRecommendSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await api.post('/update-recommend', {
        itemId: selectedItem._id,
        recommend: recommendForm
      })
      if (response.status === 200) {
        alert('추천 상품 설정이 저장되었습니다.')
        setShowRecommendModal(false)
        fetchData()
      }
    } catch (err) {
      alert('설정 저장 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  if (isLoading === true) {
    return (
      <div className='loading-wrap'>
        <div className='loading-spinner' />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div>
        <h1 style={{ textAlign: 'center', marginTop: '100px' }}>상품이 없습니다.</h1>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.map_wrap}>
        {items.map((item, idx) => (
          <div key={idx} className={styles.item_wrap}>
            <img src={getImgURLFromImgName(item.mainImg)} onClick={() => window.open(`/product/${item._id}`, '_blank', 'noopener,noreferrer')} alt='' />
            <p>{item.name}</p>
            <div className={styles.item_btn_wrap}>
              <div className={styles.basic_buttons}>
                <p onClick={() => navigate(`/admin/add-product?modify=${item._id}`)}>수정</p>
                <p onClick={() => handleRemoveItem(item)}>삭제</p>
                <p onClick={() => handleChangeIndex('up', item.index)}>▲</p>
                <p onClick={() => handleChangeIndex('down', item.index)}>▼</p>
              </div>
              <div className={styles.notice_buttons}>
                <p 
                  onClick={() => handleHomeNoticeClick(item)} 
                  className={`${styles.notice_btn} ${item.homeNotice?.notice ? styles.active : ''}`}
                >
                  홈노출{item.homeNotice?.notice ? ` (${item.homeNotice?.index})` : ''}
                </p>
                <p 
                  onClick={() => handleRecommendClick(item)} 
                  className={`${styles.notice_btn} ${item.recommend?.recommend ? styles.active : ''}`}
                >
                  추천상품{item.recommend?.recommend ? ` (${item.recommend?.index})` : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showHomeNoticeModal && (
        <div className={styles.modal_wrap} onClick={() => setShowHomeNoticeModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>홈 화면 노출 설정</h2>
            <div className={styles.form_group}>
              <label className={styles.checkbox_label}>
                <input 
                  type="checkbox" 
                  checked={homeNoticeForm.notice}
                  onChange={(e) => setHomeNoticeForm({
                    ...homeNoticeForm,
                    notice: e.target.checked,
                    index: e.target.checked ? homeNoticeForm.index || '1' : ''
                  })}
                />
                <span>홈 화면에 노출</span>
              </label>
            </div>
            {homeNoticeForm.notice && (
              <div className={styles.form_group}>
                <label>노출 순서</label>
                <input 
                  type="number"
                  min="1"
                  value={homeNoticeForm.index}
                  onChange={(e) => setHomeNoticeForm({
                    ...homeNoticeForm,
                    index: e.target.value
                  })}
                />
              </div>
            )}
            <div className={styles.modal_buttons}>
              <button onClick={handleHomeNoticeSubmit}>저장</button>
              <button onClick={() => setShowHomeNoticeModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {showRecommendModal && (
        <div className={styles.modal_wrap} onClick={() => setShowRecommendModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>추천 상품 설정</h2>
            <div className={styles.form_group}>
              <label className={styles.checkbox_label}>
                <input 
                  type="checkbox" 
                  checked={recommendForm.recommend}
                  onChange={(e) => setRecommendForm({
                    ...recommendForm,
                    recommend: e.target.checked,
                    index: e.target.checked ? recommendForm.index || '1' : ''
                  })}
                />
                <span>추천 상품으로 설정</span>
              </label>
            </div>
            {recommendForm.recommend && (
              <div className={styles.form_group}>
                <label>노출 순서</label>
                <input 
                  type="number"
                  min="1"
                  value={recommendForm.index}
                  onChange={(e) => setRecommendForm({
                    ...recommendForm,
                    index: e.target.value
                  })}
                />
              </div>
            )}
            <div className={styles.modal_buttons}>
              <button onClick={handleRecommendSubmit}>저장</button>
              <button onClick={() => setShowRecommendModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts