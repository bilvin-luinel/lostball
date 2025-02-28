import React, { useEffect, useRef, useState } from 'react'
import ss from './Home.module.css'
import img_new3 from '../../img/Home/new3.png'
import img_main1 from '../../img/Home/main_banner1.png'
import img_main2 from '../../img/Home/main_banner2.png'
import img_main3 from '../../img/Home/main_banner3.png'
import img_lv2_1 from '../../img/Home/lv2_1.png'
import img_lv2_2 from '../../img/Home/lv2_2.png'
import img_lv2_3 from '../../img/Home/lv2_3.png'
import img_lv2_4 from '../../img/Home/lv2_4.png'
import img_lv4_1 from '../../img/Home/lv4_1.png'
import img_lv4_2 from '../../img/Home/lv4_2.png'
import img_h1 from '../../img/Home/lv5_1.png'
import img_h2 from '../../img/Home/lv5_2.png'
import img_h3 from '../../img/Home/lv5_3.png'
import img_h4 from '../../img/Home/lv5_4.png'
import img_faq1 from '../../img/icon/faq1.png'
import img_faq2 from '../../img/icon/faq2.png'
import img_faq3 from '../../img/icon/faq3.png'
import img_faq4 from '../../img/icon/faq4.png'
import img_faq5 from '../../img/icon/faq5.png'
import img_faq6 from '../../img/icon/faq6.png'
import img_faq7 from '../../img/icon/faq7.png'
import img_arrow from '../../img/icon/arrow_down.png'
import img_lv7_m from '../../img/Home/lv7_m.png'
import { useNavigate } from 'react-router-dom'
import api from '../../util/api'
import img_icon1 from '../../img/icon/item_icon1.png'
import img_icon2 from '../../img/icon/item_icon2.png'
import img_icon3 from '../../img/icon/item_icon3.png'
import baseURL from '../../data/baseURL'

const Home = () => {

    const navigation = useNavigate()
    const containerRef = useRef(null);
    const lv2Refs = useRef([]);  // lv2 이미지들을 위한 ref 배열 추가
    const lv7Ref = useRef(null);  // lv7 이미지를 위한 ref 추가
    const [scale, setScale] = useState(1.1);
    const [lv2Scales, setLv2Scales] = useState([1.1, 1.1, 1.1, 1.1]);  // lv2 이미지들의 scale 상태 추가
    const [lv7Scale, setLv7Scale] = useState(1.1);  // lv7 scale 상태 추가
    const [currentImage, setCurrentImage] = useState(0);
    const images = [img_main1, img_main2, img_main3];
    const [hoveredIndex, setHoveredIndex] = useState(null);  // hover된 이미지의 인덱스
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 639);
    const [mainItem, setMainItem] = useState([])
    const [hoveredItemIndex, setHoveredItemIndex] = useState(null);
    const [currentBodyImageIndex, setCurrentBodyImageIndex] = useState(0);
    const imageIntervalRef = useRef(null);
    const [homeNoticeItems, setHomeNoticeItems] = useState([])

    useEffect(() => {
        const handleScroll = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const newScale = 1.1 - (entry.intersectionRatio * 0.1);

                    // target이 lv2 이미지인 경우
                    const lv2Index = lv2Refs.current.findIndex(ref => ref === entry.target);
                    if (lv2Index !== -1) {
                        setLv2Scales(prev => {
                            const newScales = [...prev];
                            newScales[lv2Index] = newScale;
                            return newScales;
                        });
                    } else if (entry.target === containerRef.current) {
                        // lv5 이미지인 경우
                        setScale(newScale);
                    } else if (entry.target === lv7Ref.current) {
                        // lv7 이미지인 경우
                        setLv7Scale(newScale);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleScroll, {
            root: null,
            threshold: Array.from({ length: 11 }, (_, i) => i / 10),
        });

        // 각 이미지 관찰
        if (containerRef.current) observer.observe(containerRef.current);
        if (lv7Ref.current) observer.observe(lv7Ref.current);
        lv2Refs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
            if (lv7Ref.current) observer.unobserve(lv7Ref.current);
            lv2Refs.current.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 639);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        const fetchHomeNoticeItems = async () => {
            try {
                const response = await api.get('get-item')
                if (response.status === 200) {
                    // 홈 노출 상품만 필터링하고 인덱스 순으로 정렬
                    const noticeItems = response.data
                        .filter(item => item.homeNotice?.notice)
                        .sort((a, b) => a.homeNotice.index - b.homeNotice.index)
                    setHomeNoticeItems(noticeItems)
                }
            } catch (err) {
                console.error('홈 노출 상품 로딩 중 오류:', err)
            }
        }

        fetchHomeNoticeItems()
    }, [])

    const [faq, setFaq] = useState([
        { title: 'What is the Minimum Order Quantity (MOQ) ?', content: 'The Minimum Order Quantity varies depending on the product. Generally, we recommend placing bulk orders for optimal cost-efficiency. For specific information regarding the MOQ of a particular product, please feel free to contact us directly, and we will be happy to assist  you.', isShow: false, img: img_faq1 },
        { title: 'Is product customization available?', content: 'Yes, we offer a range of customization options to meet your specific needs, including product size, thickness, and other specifications. If you have unique requirements, please consult with us, and we will provide tailored solutions to best suit your needs.', isShow: false, img: img_faq2 },
        { title: 'How long does shipping take?', content: 'The delivery timeline depends on the order quantity, product type, and shipping destination. On average, it takes approximately 2–4 weeks after the order is confirmed. A precise delivery schedule will be provided during the ordering process.', isShow: false, img: img_faq3 },
        { title: 'Can I request product samples?', content: 'Yes, we can provide samples for most products. However, there may be a nominal fee for the sample, which can be discussed at the time of the request.', isShow: false, img: img_faq4 },
        { title: 'What payment options are available for international clients?', content: 'We accept payments via Telegraphic Transfer (T/T). For detailed information, please contact us directly', isShow: false, img: img_faq5 },
        { title: 'How can I get additional information ?', content: 'We are always happy to assist with your inquiries. For more information or consultation, please reach out to us using the contact details provided on our website, and our team will respond promptly and professionally.', isShow: false, img: img_faq6 },
    ])

    const fetchData = async () => {
        try {
            const response = await api.get('/get-item')
            if (response.status === 200) {
                if (response.data.length > 7) {
                    setMainItem(response.data.slice(0, 7))
                } else {
                    setMainItem(response.data)
                }
            }
        } catch { }
    }

    const handleClickFAQ = (idx) => {
        setFaq((prev) => {
            const target = [...prev]
            const original = target[idx].isShow
            target[idx].isShow = !original
            return target
        })
    }

    const getMainImageClassName = (index) => {
        if (currentImage === index) {
            return ss.slide_image_active
        }
        if (currentImage - 1 === index) {
            return ss.slide_image_prev
        }
        if (currentImage === 0 && index === 2) {
            return ss.slide_image_prev
        }
        return ss.slide_image_next
    }

    const getFAQActiveMargin = (show, idx) => {
        if (show === false) {
            return
        }
        if (!isMobile) {
            return { marginBottom: '250px' }
        }
        if (isMobile) {
            return { marginBottom: '180px' }
        }
        // switch (idx) {
        //     case 0:
        //         return { marginBottom: '150px' }
        //     case 1:
        //         return { marginBottom: '132px' }
        //     case 2:
        //         return { marginBottom: '132px' }
        //     case 3:
        //         return { marginBottom: '95px' }
        //     case 4:
        //         return { marginBottom: '75px' }
        //     case 5:
        //         return { marginBottom: '170px' }
        //     case 6:
        //         return { marginBottom: '100px' }
        //     default:
        //         return { marginBottom: '160px' }
        // }
    }

    const handleItemMouseEnter = (index) => {
        setHoveredItemIndex(index);
        // 이미지 순환 시작
        imageIntervalRef.current = setInterval(() => {
            setCurrentBodyImageIndex(prev => {
                const item = mainItem[index];
                // additionalImg가 없거나 비어있으면 순환하지 않음
                if (!item.additionalImg || item.additionalImg.length === 0) return 0;
                // 다음 이미지 인덱스 계산 (순환)
                return (prev + 1) % item.additionalImg.length;
            });
        }, 2000);
    };

    const handleItemMouseLeave = () => {
        setHoveredItemIndex(null);
        setCurrentBodyImageIndex(0);
        // 이미지 순환 중지
        if (imageIntervalRef.current) {
            clearInterval(imageIntervalRef.current);
            imageIntervalRef.current = null;
        }
    };

    // 컴포넌트 언마운트 시 인터벌 정리
    useEffect(() => {
        return () => {
            if (imageIntervalRef.current) {
                clearInterval(imageIntervalRef.current);
            }
        };
    }, []);


    return (
        <div className={ss.wrap}>

            <div className={ss.lv1}>
                <div className={ss.lv1_video_wrap}>
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt=""
                            className={getMainImageClassName(index)}
                        />
                    ))}
                </div>
                {/* <h2>유토피아 로스트볼은<br />최고의 품질,최고의 서비스를 제공합니다.</h2> */}
            </div>
            <div className={ss.lv2}>
                <h2>저희는 비재생 로스트볼만을 취급합니다</h2>
                <p>정확한 상품, 제대로 된 품질의 상품.</p>
                <div className={ss.lv2_img_wrap}>
                    <div onMouseEnter={() => setHoveredIndex(0)} onMouseLeave={() => setHoveredIndex(null)}>
                        <img
                            ref={el => lv2Refs.current[0] = el}
                            style={{ transform: `scale(${hoveredIndex === 0 ? 1.1 : lv2Scales[0]})` }}
                            src='https://ecimg.cafe24img.com/pg403b04812162082/crisiongolf/web/product/big/20240807/b0e46475bf438e549ddd0868d41339a9.jpg'
                            // src={img_lv2_1}
                            alt=''
                        />
                        <h3>로스트볼</h3>
                        <p>판매자가 직접 등급 분류 작업으로<br />정확한 등급대로 분류합니다.<br />제대로 된 품질의 로스트볼,<br />제대로 된 친절한 서비스 제공할 것을 약속합니다.</p>
                    </div>
                    <div onMouseEnter={() => setHoveredIndex(1)} onMouseLeave={() => setHoveredIndex(null)}>
                        <img
                            ref={el => lv2Refs.current[1] = el}
                            style={{ transform: `scale(${hoveredIndex === 1 ? 1.1 : lv2Scales[1]})` }}
                            src='https://mblogthumb-phinf.pstatic.net/MjAyMzA2MDRfMjcx/MDAxNjg1ODQ3ODQzMzMx.sVBnMV9cTmcwtx7E10vNP36eXrGRcmJTrTo-T7Wj_5Qg.geJUC1yAQ81kHR8mIDvrKDrRN57PAsYpN6kOImRe2log.PNG.golf79s177/20230604120307.png?type=w800'
                            // src={img_lv2_2}
                            alt=''
                        />
                        <h3>국제공인구 다이아윙스</h3>
                        <p>고반발 국제공인구 다이아윙스는<br />압도적 비거리 증가가 가능하며<br />미국 USGA,<br />영국 R&A 인증을 받은 증명된 골프공입니다.</p>
                    </div>
                    <div onMouseEnter={() => setHoveredIndex(2)} onMouseLeave={() => setHoveredIndex(null)}>
                        <img
                            ref={el => lv2Refs.current[2] = el}
                            style={{ transform: `scale(${hoveredIndex === 2 ? 1.1 : lv2Scales[2]})` }}
                            src='https://webimage.10x10.co.kr/image/basic600/410/B004107219.jpg'
                            // src={img_lv2_3}
                            alt=''
                        />
                        <h3>GD11 화장품</h3>
                        <p>국제 특허기술과 인체제대혈세포배양액<br />눈에 보이는 리얼한 효과를 피부에 선사합니다.<br />GD11만의 독자기술로 만들어진<br />인체제대혈세포배양액을 소개합니다.</p>
                    </div>
                    {/* <div onMouseEnter={() => setHoveredIndex(3)} onMouseLeave={() => setHoveredIndex(null)}>
                        <img
                            ref={el => lv2Refs.current[3] = el}
                            style={{ transform: `scale(${hoveredIndex === 3 ? 1.1 : lv2Scales[3]})` }}
                            src={img_lv2_4}
                            alt=''
                        />
                        <h3>Reliable<br />Communication</h3>
                        <p>We strive to build lasting<br />partnerships, dedicated to<br />supporting the growth and<br />success of your business.</p>
                    </div> */}
                </div>
                {/* <div className={ss.lv2_img_wrap}></div> */}
            </div>
            <div className={ss.lv5}>
                <div className={ss.lv5_description_wrap}>
                    <h2>고르고</h2>
                    <p>국내 300여개 다양한 휴양시설을 온라인보다 더 저렴하게 이용할 수 있도록 국내 숙박 기업복지 사이트를 오픈합니다.</p>
                </div>
                <div className={ss.lv5_img_wrap}>
                    <div ref={containerRef} onMouseEnter={() => setHoveredIndex(4)} onMouseLeave={() => setHoveredIndex(null)}>
                        <img src={img_h1}
                            style={{ transform: `scale(${hoveredIndex === 4 ? 1.1 : scale})` }}
                            alt='' />
                        <h3>Manufacturing</h3>
                    </div>
                    <div onMouseEnter={() => setHoveredIndex(5)} onMouseLeave={() => setHoveredIndex(null)}>
                        <img src={img_h2}
                            style={{ transform: `scale(${hoveredIndex === 5 ? 1.1 : scale})` }}
                            alt='' />
                        <h3>Packaging</h3>
                    </div>
                    <div onMouseEnter={() => setHoveredIndex(6)} onMouseLeave={() => setHoveredIndex(null)}>
                        <img src={img_h3}
                            style={{ transform: `scale(${hoveredIndex === 6 ? 1.1 : scale})` }}
                            alt='' />
                        <h3>Delivery</h3>
                    </div>
                    <div onMouseEnter={() => setHoveredIndex(7)} onMouseLeave={() => setHoveredIndex(null)}>
                        <img src={img_h4}
                            style={{ transform: `scale(${hoveredIndex === 7 ? 1.1 : scale})` }}
                            alt='' />
                        <h3>Shipping</h3>
                    </div>
                </div>
            </div>
            <div className={ss.lv3}>
                <h3 className={ss.lv3_headline}>Products</h3>
                <p className={ss.lv3_headline_sub}>we provide products that you can be satisfied with.</p>
                <div className={ss.lv3_item_wrap}>
                    {homeNoticeItems.map((item, idx) => (
                        <div
                            key={idx}
                            className={ss.lv3_item}
                            onClick={() => window.location.href = `/product/${item._id}`}
                            onMouseEnter={() => handleItemMouseEnter(idx)}
                            onMouseLeave={handleItemMouseLeave}
                        >
                            <img
                                src={`${baseURL}/uploads/${hoveredItemIndex === idx && item.additionalImg && item.additionalImg.length > 0
                                    ? item.additionalImg[currentBodyImageIndex]
                                    : item.mainImg
                                    }`}
                                alt={item.name}
                            />
                            <h3>{item.name}</h3>
                            {item.applications && item.applications.length > 0 && (
                                <div className={ss.icon_wrap}>
                                    {item.applications.includes(0) && (
                                        <div>
                                            <img src={img_icon1} />
                                            <span>semi-conductor</span>
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
                                            <span>electronic parts</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <p>{item.noticeContent.content1}</p>
                            <p>{item.noticeContent.content2}</p>
                            <p>{item.noticeContent.content3}</p>
                        </div>
                    ))}
                    <p className={ss.lv3_view_more} onClick={() => window.location.href = '/products'}>
                        View More<span>&gt;</span>
                    </p>
                </div>
            </div>
            <div className={ss.lv4}>
                {/* <img src={img_lv4} alt='' /> */}
                <h3><span>Empowering</span><br />Your Success In <span>Every Step</span></h3>
                <div>
                    <span>“Every step is an opportunity to build trust and deliver excellence,<br />and we strive to be a reliable partner in your global journey.”</span>
                    <p onClick={() => window.location.href = '/about-us'}>Our Mission</p>
                </div>
                <img src={img_lv4_1} alt='' />
                <img src={img_lv4_2} alt='' />

            </div>

            <div className={ss.lv6}>
                <div className={ss.lv6_head}>
                    <h2>FAQs</h2>
                    <h3>frequently asked questions</h3>
                </div>
                <div className={ss.lv6_body}>
                    {faq.map((item, idx) => (
                        <div key={idx} className={ss.lv6_item} style={getFAQActiveMargin(item.isShow, idx)}>
                            <img src={item.img} alt='' />
                            <h3>{item.title}</h3>
                            {item.isShow === true && (
                                <p className={ss.lv6_content}>
                                    {item.content}
                                    {idx === 5 && (
                                        <span style={{ cursor: 'pointer', color: 'var(--main-red)', textDecoration: 'underline' }} onClick={() => window.location.href = '/contact'}><br /><br />If you have any question. Click here.</span>
                                    )}
                                </p>
                            )}
                            <div className={`${ss.lv6_arrow_wrap} ${item.isShow === true && ss.lv6_arrow_wrap_active}`} onClick={() => handleClickFAQ(idx)}>
                                <img src={img_arrow} alt='' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={ss.lv7}>
                <div className={`${ss.lv7_img_wrap} ${ss.only_pc}`}>
                    <img
                        ref={lv7Ref}
                        src={img_new3}
                        alt=''
                        style={{ transform: `scale(${lv7Scale})` }}
                    />
                    <div className={ss.lv7_text_wrap}>
                        <h2>We are ready to listen to your <br />business plans</h2>
                        <p>Through our quotation management system,<br />we receive your inquiry and<br />turn the inquiry you sent into an optimal experience.</p>
                        <div className={ss.lv7_bt_wrap}>
                            <p onClick={() => {
                                window.scrollTo(0, 0);
                                navigation('/contact');
                            }}>Contact</p>
                            <p onClick={() => {
                                window.scrollTo(0, 0);
                                navigation('/inquiry');
                            }}>Inquiry</p>
                        </div>
                    </div>
                </div>
                <div className={`${ss.lv7_img_wrap_m} ${ss.only_m}`}>
                    <div className={ss.img_container}>
                        <img src={img_lv7_m} alt='' />
                    </div>
                    <div className={ss.lv7_ab_wrap_m}>
                        <h3>We are ready to listen<br />to your <span>business plans</span></h3>
                        <div>
                            <p onClick={() => {
                                window.scrollTo(0, 0);
                                navigation('/contact');
                            }}>CONTACT</p>
                            <p onClick={() => {
                                window.scrollTo(0, 0);
                                navigation('/inquiry');
                            }}>INQUIRY</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Home