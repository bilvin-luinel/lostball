import React, { useEffect, useState } from 'react'
import styles from './AdminAddProduct.module.css'
import api from '../../util/api'
import getImgURLFromImgName from '../../util/getImgURLFromImgName'
import { useNavigate, useSearchParams } from 'react-router-dom'
import img_icon1 from '../../img/icon/item_icon1.png'
import img_icon2 from '../../img/icon/item_icon2.png'
import img_icon3 from '../../img/icon/item_icon3.png'

const AdminAddProduct = () => {

    const navigate = useNavigate()
    const [searchParam] = useSearchParams()
    const modify = searchParam.get('modify')

    const [name, setName] = useState('')
    const [modelName, setModelName] = useState('')
    const [mainImg, setMainImg] = useState('')
    const [additionalImg, setAdditionalImg] = useState([])
    const [content, setContent] = useState([{ name: '', value: '', bold: false }])
    const [contentCount, setContentCount] = useState(1)
    const [imgBody, setImgBody] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [noticeContent, setNoticeContent] = useState({
        content1: '',
        content2: '',
        content3: ''
    })
    const [additionalInfo, setAdditionalInfo] = useState({
        additionalInfo1: '', // MOQ
        additionalInfo2: '', // per BOX / per Carton
        additionalInfo3: '', // Leadtime
        additionalInfo4: '', // Samples provided
        additionalInfo5: ''  // Payment options
    })
    const [certificate, setCertificate] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [applications, setApplications] = useState([])

    useEffect(() => {
        if (modify) {
            fetchData()
        }
        fetchCategories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modify])

    const fetchCategories = async () => {
        try {
            const response = await api.get('/get-categories')
            if (response.status === 200) {
                setCategories(response.data)
            }
        } catch (err) {
            console.error('카테고리 로딩 실패:', err)
        }
    }

    const fetchData = async () => {
        try {
            const response = await api.get(`/get-item-info?itemId=${modify}`)
            if (response.status === 200) {
                setName(response.data.name)
                setModelName(response.data.modelName)
                setMainImg(response.data.mainImg)
                setAdditionalImg(response.data.additionalImg)
                setContent(response.data.content)
                setContentCount(response.data.content.length)
                setImgBody(response.data.imgBody)
                setNoticeContent(response.data.noticeContent || {
                    content1: '',
                    content2: '',
                    content3: ''
                })
                setAdditionalInfo({
                    additionalInfo1: response.data.additionalInfo1 || '',
                    additionalInfo2: response.data.additionalInfo2 || '',
                    additionalInfo3: response.data.additionalInfo3 || '',
                    additionalInfo4: response.data.additionalInfo4 || '',
                    additionalInfo5: response.data.additionalInfo5 || ''
                })
                setCertificate(response.data.certificate || [])
                setSelectedCategory(response.data.category || '')
                setApplications(response.data.applications || [])
            } else {
                return
            }
        } catch (err) {
            console.error('데이터 로딩 중 오류:', err)
        }
    }

    const handleAddImage = async (type, index) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.addEventListener('change', async () => {
            const file = input.files[0]
            if (file) {
                const formData = new FormData()
                formData.append('img', file)
                try {
                    setIsLoading(true)
                    const res = await api.post('/add-image', formData)
                    if (res.status === 200) {
                        switch (type) {
                            case 'main':
                                setMainImg(res.data.filename)
                                break
                            case 'add':
                                if (additionalImg[index]) {
                                    setAdditionalImg(prev => {
                                        const newArray = [...prev]
                                        newArray[index] = res.data.filename
                                        return newArray
                                    })
                                } else {
                                    setAdditionalImg(prev => {
                                        const newArray = [...prev]
                                        newArray.push(res.data.filename)
                                        return newArray
                                    })
                                }
                                break
                            case 'body':
                                setImgBody(prev => {
                                    const newArray = [...prev]
                                    newArray.push(res.data.filename)
                                    return newArray
                                })
                                break
                            default:
                                break
                        }
                    }
                    setIsLoading(false)
                } catch (error) {
                }
            }
        })
    }

    const handleRemoveImage = async (type, index) => {
        try {
            switch (type) {
                case 'add':
                    if (!additionalImg[index]) {
                        return
                    } else {
                        setIsLoading(true)
                        const response = await api.get(`/remove-image?imgName=${additionalImg[index]}`)
                        if (response.status === 200) {
                            setAdditionalImg(prev => prev.filter((item, idx) => idx !== index))
                        } else if (response.status === 201) {
                            console.log('서버에서 이미지 삭제 도중 오류 발생')
                        }
                        setIsLoading(false)
                    }
                    break
                case 'body':
                    setIsLoading(true)
                    const response = await api.get(`/remove-image?imgName=${imgBody[index]}`)
                    if (response.status === 200) {
                        setImgBody(prev => prev.filter((item, idx) => idx !== index))
                    } else if (response.status === 201) {
                        console.log('서버에서 이미지 삭제 도중 오류 발생')
                    }
                    setIsLoading(false)
                    break
                default:
                    break
            }
        } catch (err) {
        }
    }

    const handleAddCertificate = async () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.addEventListener('change', async () => {
            const file = input.files[0]
            if (file) {
                const formData = new FormData()
                formData.append('img', file)
                try {
                    setIsLoading(true)
                    const res = await api.post('/add-image', formData)
                    if (res.status === 200) {
                        setCertificate(prev => [...prev, res.data.filename])
                    }
                    setIsLoading(false)
                } catch (error) {
                    console.error('인증서 이미지 업로드 중 오류:', error)
                    setIsLoading(false)
                }
            }
        })
    }

    const handleRemoveCertificate = async (index) => {
        try {
            setIsLoading(true)
            const response = await api.get(`/remove-image?imgName=${certificate[index]}`)
            if (response.status === 200) {
                setCertificate(prev => prev.filter((_, idx) => idx !== index))
            }
            setIsLoading(false)
        } catch (err) {
            console.error('인증서 이미지 삭제 중 오류:', err)
            setIsLoading(false)
        }
    }

    const handleApplicationChange = (value) => {
        setApplications(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            } else {
                return [...prev, value].sort((a, b) => a - b);
            }
        });
    };

    const handleSubmit = async () => {
        try {
            if (!name) {
                alert('이름을 입력해 주세요.')
                return
            }
            if (!mainImg) {
                alert('대표 이미지를 등록해 주세요.')
                return
            }
            if (!selectedCategory) {
                alert('카테고리를 선택해 주세요.')
                return
            }
            setIsLoading(true)
            const response = await api.post('/add-item', {
                name,
                modelName,
                mainImg,
                additionalImg,
                content,
                imgBody,
                noticeContent,
                additionalInfo1: additionalInfo.additionalInfo1,
                additionalInfo2: additionalInfo.additionalInfo2,
                additionalInfo3: additionalInfo.additionalInfo3,
                additionalInfo4: additionalInfo.additionalInfo4,
                additionalInfo5: additionalInfo.additionalInfo5,
                certificate,
                category: selectedCategory,
                applications,
                modify
            })
            if (response.status === 200) {
                alert('상품이 등록되었습니다.')
                navigate('/admin/products')
                return
            } else {
                alert('서버에서 알 수 없는 오류 발생')
                setIsLoading(false)
                return
            }
        } catch (err) {
            console.error('상품 등록 중 오류:', err)
        }
    }
    const changeContent = (e, idx, type) => {
        setContent(prev => {
            const newArray = [...prev]
            if (type === 'name') {
                newArray[idx].name = e.target.value
            } else if (type === 'value') {
                newArray[idx].value = e.target.value
            } else if (type === 'bold') {
                newArray[idx].bold = e.target.checked
            }
            return newArray
        })
    }
    const addContentCount = (type, index) => {

        setContent(prev => {
            const newArray = [...prev]
            if (type === 'enter') {
                const target = [...newArray.slice(0, index + 1), { name: '', value: '', bold: false, enter: true }, ...newArray.slice(index + 1)]
                return target
            } else if (type === 'new') {
                const target = [...newArray.slice(0, index + 1), { name: '', value: '', bold: false }, ...newArray.slice(index + 1)]
                return target
            }
        })
        setContentCount(contentCount + 1)
    }
    const handleDeleteContent = (idx) => {
        if (contentCount === 1) {
            return
        }
        setContentCount(contentCount - 1)
        setContent(prev => {
            const newArray = [...prev]
            const result = newArray.filter((item, index) => index !== idx)
            return result
        })
    }



    return (
        <div className={styles.wrap}>
            <p className={styles.explain}>상품 이름</p>
            <input className={styles.input} type='text' value={name} onChange={(e) => setName(e.target.value)} />
            <p className={styles.explain}>모델명</p>
            <input className={styles.input} type='text' value={modelName} onChange={(e) => setModelName(e.target.value)} />
            <p className={styles.explain}>대표 이미지</p>
            <div className={styles.img_div} style={{ backgroundImage: mainImg && getImgURLFromImgName(mainImg, 'forInline') }} onClick={() => handleAddImage('main')}></div>
            <p className={styles.explain}>추가 이미지</p>
            <div className={styles.additional_img_wrap}>
                <div>
                    <div className={styles.img_div} style={{ backgroundImage: additionalImg[0] && getImgURLFromImgName(additionalImg[0], 'forInline') }} onClick={() => handleAddImage('add', 0)}></div>
                    <p className={styles.img_del_btn} onClick={() => handleRemoveImage('add', 0)}>삭제</p>
                </div>
                <div>
                    <div className={styles.img_div} style={{ backgroundImage: additionalImg[1] && getImgURLFromImgName(additionalImg[1], 'forInline') }} onClick={() => handleAddImage('add', 1)}></div>
                    <p className={styles.img_del_btn} onClick={() => handleRemoveImage('add', 1)}>삭제</p>
                </div>
                <div>
                    <div className={styles.img_div} style={{ backgroundImage: additionalImg[2] && getImgURLFromImgName(additionalImg[2], 'forInline') }} onClick={() => handleAddImage('add', 2)}></div>
                    <p className={styles.img_del_btn} onClick={() => handleRemoveImage('add', 2)}>삭제</p>
                </div>
            </div>

            <p className={styles.explain}>설명</p>

            {Array.from({ length: contentCount }, (_, idx) => (
                <div key={idx} className={styles.content}>
                    {!content[idx].enter ? (
                        <input className={styles.content_input_text} type='text' placeholder='이름' value={content[idx].name} onChange={(e) => changeContent(e, idx, 'name')} />
                    ) : (
                        <div className={styles.content_input_text} style={{ margin: '5px 10px' }}></div>
                    )}
                    <input className={styles.content_input_text} type='text' placeholder='값' value={content[idx].value} onChange={(e) => changeContent(e, idx, 'value')} />
                    <input className={styles.content_input_check} type='checkbox' value={content[idx].bold} checked={content[idx].bold === true} onChange={(e) => changeContent(e, idx, 'bold')} />
                    <p className={styles.img_del_btn} style={{ marginRight: '10px' }} onClick={() => addContentCount('enter', idx)}>줄바꿈</p>
                    <p className={styles.img_del_btn} style={{ marginRight: '10px' }} onClick={() => handleDeleteContent(idx)}>삭제</p>
                    <p className={styles.img_del_btn} onClick={() => addContentCount('new', idx)}>+추가</p>
                </div>
            ))}


            <p className={styles.explain}>상세 이미지</p>
            {imgBody[0] && Array.from({ length: imgBody.length }, (_, idx) => (
                <div key={idx} className={styles.imgBody_wrap}>
                    <img src={getImgURLFromImgName(imgBody[idx])} alt='' />
                    <p className={styles.img_del_btn} onClick={() => handleRemoveImage('body', idx)}>삭제</p>
                </div>
            ))}
            <p className={styles.addContent_btn} onClick={() => handleAddImage('body')}>+추가</p>

            <p className={styles.explain}>공지사항 내용</p>
            <div className={styles.notice_content}>
                <input 
                    type="text"
                    placeholder="Content 1"
                    value={noticeContent.content1}
                    onChange={(e) => setNoticeContent(prev => ({
                        ...prev,
                        content1: e.target.value
                    }))}
                />
                <input 
                    type="text"
                    placeholder="Content 2"
                    value={noticeContent.content2}
                    onChange={(e) => setNoticeContent(prev => ({
                        ...prev,
                        content2: e.target.value
                    }))}
                />
                <input 
                    type="text"
                    placeholder="Content 3"
                    value={noticeContent.content3}
                    onChange={(e) => setNoticeContent(prev => ({
                        ...prev,
                        content3: e.target.value
                    }))}
                />
            </div>

            <p className={styles.explain}>추가 정보</p>
            <div className={styles.additional_info}>
                <div className={styles.info_item}>
                    <label>MOQ</label>
                    <textarea
                        value={additionalInfo.additionalInfo1}
                        onChange={(e) => setAdditionalInfo(prev => ({
                            ...prev,
                            additionalInfo1: e.target.value
                        }))}
                    />
                </div>
                <div className={styles.info_item}>
                    <label>per BOX / per Carton</label>
                    <textarea
                        value={additionalInfo.additionalInfo2}
                        onChange={(e) => setAdditionalInfo(prev => ({
                            ...prev,
                            additionalInfo2: e.target.value
                        }))}
                    />
                </div>
                <div className={styles.info_item}>
                    <label>Leadtime</label>
                    <textarea
                        value={additionalInfo.additionalInfo3}
                        onChange={(e) => setAdditionalInfo(prev => ({
                            ...prev,
                            additionalInfo3: e.target.value
                        }))}
                    />
                </div>
                <div className={styles.info_item}>
                    <label>Samples provided</label>
                    <textarea
                        value={additionalInfo.additionalInfo4}
                        onChange={(e) => setAdditionalInfo(prev => ({
                            ...prev,
                            additionalInfo4: e.target.value
                        }))}
                    />
                </div>
                <div className={styles.info_item}>
                    <label>Payment options</label>
                    <textarea
                        value={additionalInfo.additionalInfo5}
                        onChange={(e) => setAdditionalInfo(prev => ({
                            ...prev,
                            additionalInfo5: e.target.value
                        }))}
                    />
                </div>
            </div>

            <p className={styles.explain}>인증서</p>
            <div className={styles.certificate_wrap}>
                {certificate.map((cert, idx) => (
                    <div key={idx} className={styles.certificate_item}>
                        <img src={getImgURLFromImgName(cert)} alt={`Certificate ${idx + 1}`} />
                        <p className={styles.img_del_btn} onClick={() => handleRemoveCertificate(idx)}>삭제</p>
                    </div>
                ))}
                <p className={styles.addContent_btn} onClick={handleAddCertificate}>+인증서 추가</p>
            </div>

            <p className={styles.explain}>카테고리</p>
            <select 
                className={styles.input}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="">카테고리 선택</option>
                {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>

            <p className={styles.explain}>Applications</p>
            <div className={styles.applications_wrap}>
                <label>
                    <input 
                        type="checkbox"
                        checked={applications.includes(0)}
                        onChange={() => handleApplicationChange(0)}
                    />
                    <img src={img_icon1} alt="semi-conductor icon" />
                    Semi-conductor
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={applications.includes(1)}
                        onChange={() => handleApplicationChange(1)}
                    />
                    <img src={img_icon2} alt="lead frame icon" />
                    Lead frame
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={applications.includes(2)}
                        onChange={() => handleApplicationChange(2)}
                    />
                    <img src={img_icon3} alt="electronic parts icon" />
                    Electronic parts
                </label>
            </div>

            <p className={styles.submit_btn} onClick={() => handleSubmit()}>등록하기</p>


            {isLoading && (
                <div className='loading-wrap-dark'>
                    <div className='loading-spinner' />
                </div>
            )}
        </div>
    )
}

export default AdminAddProduct