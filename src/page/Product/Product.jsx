import React, { useEffect, useRef, useState } from 'react'
import styles from './Product.module.css'
import { useParams } from 'react-router-dom'
import api from '../../util/api'
import getImgURLFromImgName from '../../util/getImgURLFromImgName'

const Product = () => {

    const { id } = useParams()

    const nameWrapRefs = useRef([]);
    const [nameSpaceWidths, setNameSpaceWidths] = useState([]);
    const [item, setItem] = useState({})
    const [currentMainImg, setCurrentMainImg] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSpecOpen, setIsSpecOpen] = useState(false);

    const sectionRefs = {
        moq: useRef(null),
        box: useRef(null),
        leadtime: useRef(null),
        samples: useRef(null),
        payment: useRef(null)
    };

    useEffect(() => {
        setItem({})
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        const widths = nameWrapRefs.current.map(ref => ref?.offsetWidth || 0);
        setNameSpaceWidths(widths);
    }, [item]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/get-item-info?itemId=${id}`)
            if (response.status === 200) {
                setItem(response.data)
                setCurrentMainImg(response.data.mainImg)
                setIsLoading(false)
            } else {
                return
            }
        } catch (err) {
        }
    }

    const getNameSpaceWidth = (idx) => {
        for (let i = idx; i > 0; i--) {
            if (item.content[i - 1].enter !== true) {
                return nameSpaceWidths[i - 1] + 6
            }
        }

        return nameSpaceWidths[idx - 1] + 6
    }

    const scrollToSection = (sectionRef) => {
        const yOffset = -70; // middleMenu의 height와 여유 공간을 고려한 offset
        const element = sectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });
    };

    if (!item._id || isLoading === true) {
        return (
            <div className='loading-wrap'>
                <div className='loading-spinner' />
            </div>
        )
    }

    return (
        <div className={styles.super_wrap}>
            <div className={styles.wrap}>
                <div className={styles.level1}>
                    <div className={styles.left}>
                        <img className={styles.left_main_img} src={getImgURLFromImgName(currentMainImg)} alt='' />
                        <div className={styles.left_img_wrap}>
                            <img src={getImgURLFromImgName(item.mainImg)} onClick={() => setCurrentMainImg(item.mainImg)} alt='' />
                            {item.additionalImg.map((img, idx) => (
                                <img key={idx} src={getImgURLFromImgName(img)} onClick={() => setCurrentMainImg(img)} alt='' />
                            ))}
                        </div>
                    </div>
                    <div className={styles.right}>
                        {/* <div className={styles.right_navigate_wrap}>
                            <p onClick={() => window.location.href = '/'}>Home</p>
                            <span>&gt;</span>
                            <p onClick={() => window.location.href = '/products'}>Product</p>
                        </div> */}
                        <h1 className={styles.right_name}>{item.name}</h1>
                        {item.modelName && (
                            <p className={styles.right_modelName}>{item.modelName}</p>
                        )}
                        {/* <div className={styles.breakLine} /> */}
                        <h3 className={styles.feature_explain}>Product Features</h3>
                        <div className={styles.feature_wrap}>
                            {item.content.map((con, idx) => (
                                <div className={`${styles.content} ${con.bold === true ? styles.content_bold : ''}`} key={idx}>
                                    <p ref={el => (nameWrapRefs.current[idx] = el)}>{con.name}</p>
                                    <p>{con.name ? ':' : ''}</p>
                                    {con.enter && (
                                        <div style={{ width: idx > 0 ? (isNaN(getNameSpaceWidth(idx)) ? 'initial' : getNameSpaceWidth(idx)) : 'initial' }}></div>
                                    )}
                                    <p style={{ marginTop: item.content[idx].enter === true ? '-15px' : '' }}>{con.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.breakLine} />

                <div className={styles.middleMenu}>
                    <p onClick={() => scrollToSection(sectionRefs.moq)}>MOQ</p>
                    <p onClick={() => scrollToSection(sectionRefs.box)}>per BOX / per Carton</p>
                    <p onClick={() => scrollToSection(sectionRefs.leadtime)}>Leadtime</p>
                    <p onClick={() => scrollToSection(sectionRefs.samples)}>Samples provided</p>
                    <p onClick={() => scrollToSection(sectionRefs.payment)}>Payment options</p>
                    <span onClick={() => window.location.href = '/contact'}>Contact</span>
                    <span onClick={() => window.location.href = `/inquiry?product=${item.name}`}>Inquiry</span>
                </div>

                <div className={styles.additional_info}>
                    <div className={styles.additional_info_left}>
                        <h3 ref={sectionRefs.moq}>MOQ</h3>
                        <p>{item.additionalInfo1}</p>
                        <h3 ref={sectionRefs.box}>per BOX / per Carton</h3>
                        <p>{item.additionalInfo2}</p>
                        <h3 ref={sectionRefs.leadtime}>Leadtime</h3>
                        <p>{item.additionalInfo3}</p>
                        <h3 ref={sectionRefs.samples}>Samples provided</h3>
                        <p>{item.additionalInfo4}</p>
                        <h3 ref={sectionRefs.payment}>Payment options</h3>
                        <p>{item.additionalInfo5}</p>
                    </div>
                    <div className={`${styles.additional_info_right} ${isSpecOpen ? styles.open : ''}`}>
                        <span onClick={() => setIsSpecOpen(!isSpecOpen)}>
                            certificate {isSpecOpen ? '▼' : '▶'}
                        </span>
                        {item.certificate && item.certificate.length > 0 && (
                            item.certificate.map((cert, idx) => (
                                <img
                                    key={idx}
                                    src={getImgURLFromImgName(cert)}
                                    alt="Certificate"
                                    className={styles.certificate_img}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* <h3 className={styles.level2_more_detail}>More details</h3> */}
                {item.imgBody.map((target, idx) => (
                    <div key={idx} className={styles.imgBody_target}>
                        <img src={getImgURLFromImgName(target)} alt='' />
                    </div>
                ))}

                {/* <img className={styles.img_poster} src={`${process.env.PUBLIC_URL}/poster.png`} alt='' /> */}
            </div>


            {/* <p className={styles.get_a_inquiry} onClick={() => window.location.href = `/inquiry?product=${item.name}`}>Get a Inquiry</p> */}
        </div>
    )
}

export default Product