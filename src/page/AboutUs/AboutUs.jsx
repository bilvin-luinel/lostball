import React, { useEffect, useRef } from 'react'
import ss from './AboutUs.module.css'
import img_lv1 from '../../img/AboutUs/about1.png'
import img_lv3_1 from '../../img/AboutUs/lv3_1.png'
import img_lv3_2 from '../../img/AboutUs/lv3_2.png'
import img_lv3_3 from '../../img/AboutUs/lv3_3.png'

const AboutUs = () => {
  const h3Ref = useRef(null);
  const p2Ref = useRef(null);
  const p1Ref = useRef(null);
  const p3Ref = useRef(null);

  useEffect(() => {
    const adjustHeight = () => {
      if (h3Ref.current && p2Ref.current) {
        const h3Height = h3Ref.current.offsetHeight;
        p2Ref.current.style.height = `${h3Height}px`;
      }

      if (p1Ref.current && p3Ref.current) {
        const p3Height = p3Ref.current.offsetHeight;
        p1Ref.current.style.height = `${p3Height}px`;
      }
    };

    // 초기 실행
    adjustHeight();

    // 창 크기 변경 시 실행
    window.addEventListener('resize', adjustHeight);

    // 클린업
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  return (
    <div className={ss.wrap}>
      <div className={ss.lv1}>
        <img src={img_lv1} alt='' />
        <h2>We deliver solutions,<br />you create greater value.</h2>
      </div>
      <div className={ss.lv2}>
        <h3>“Every step is an opportunity to build trust and deliver excellence,<br />and we strive to be a reliable partner in your global journey.”</h3>
        <div>
          <div />
          <div>
            <p>Steven Youn</p>
            <span>CEO of Y-Jun</span>
          </div>
        </div>
      </div>
      <div className={ss.lv3}>
        <div className={ss.lv3_img_wrap}>
          <img src={img_lv3_1} alt='' />
          <div>
            <img src={img_lv3_2} alt='' />
            <img src={img_lv3_3} alt='' />
          </div>
        </div>
        <div className={ss.lv3_text_wrap}>
          <h3>Introduction</h3>
          <p>Y-Jun, we are committed to connecting high-quality<br />products with the world.</p>
          <p>Since our founding in 2006, we have strived to build a reputation for reliability, excellence, and innovation in global trade. Our goal is not only to meet the expectations of our customers but to exceed them, creating long-lasting partnerships built on trust and mutual growth.</p>
          <p>&nbsp;</p>
          <p>Thank you for your interest in Y-Jun, and we look forward to helping your business  succeed in the global market.</p>
        </div>
      </div>
      <div className={ss.lv4}>
        <div className={ss.lv4_left}>
          <h3 ref={h3Ref}>Empowering<br />Your Success In<br />Every Step</h3>
          <p className={ss.lv4_p1} ref={p1Ref}>"Together, we're not just completing transactions — we're building lasting success, one step at a time." </p>
        </div>
        <div className={ss.lv4_right}>
          <p className={ss.lv4_p2} ref={p2Ref}>Our vision</p>
          <p className={ss.lv4_p3} ref={p3Ref}>We believe that true success comes from supporting our clients at every stage of their journey. 'Empowering Your Success in Every Step,' reflects our commitment to  providing seamless, reliable service that helps you achieve your goals.</p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs