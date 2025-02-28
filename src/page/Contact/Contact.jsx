import React, { useEffect } from 'react'
import ss from './Contact.module.css'
import img_lv1 from '../../img/Contact/lv1.png'
import img_whatsapp from '../../img/Contact/whatsapp.png'
import img_logo from '../../img/common/logo_column.png'

const { kakao } = window;

const Contact = () => {

    useEffect(() => {
        createMap();
    }, []);

    const createMap = () => {
        const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
        const options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(37.7344933, 126.7737626), //지도의 중심좌표.
            level: 5 //지도의 레벨(확대, 축소 정도)
        };

        const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

        const imageSrc = 'https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_1280.png', // 마커이미지의 주소입니다    
            // const imageSrc = img_logo, // 마커이미지의 주소입니다    
            imageSize = new kakao.maps.Size(30, 50), // 마커이미지의 크기입니다
            imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
            markerPosition = new kakao.maps.LatLng(37.7344933, 126.7737626); // 마커가 표시될 위치입니다

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            position: markerPosition,
            image: markerImage, // 마커이미지 설정
            clickable: true
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);

        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function () {
            // 마커 위에 인포윈도우를 표시합니다
            window.open('https://www.google.com/maps/place/%EA%B2%BD%EA%B8%B0%EB%8F%84+%ED%8C%8C%EC%A3%BC%EC%8B%9C+%EC%86%94%EC%95%88%EA%B8%B8+55/data=!3m1!4b1!4m6!3m5!1s0x357c8e04e2978ffd:0x528e03d11442222a!8m2!3d37.7344933!4d126.7737626!16s%2Fg%2F11bz71vg27?entry=ttu&g_ep=EgoyMDI1MDIwNS4xIKXMDSoASAFQAw%3D%3D', '_blank');
        });
        // // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        // const content = '<div class="customoverlay">' +
        //     '  <a href="https://map.kakao.com/link/map/11394059" target="_blank">' +
        //     '    <span class="title">구의야구공원</span>' +
        //     '  </a>' +
        //     '</div>';

        // // 커스텀 오버레이가 표시될 위치입니다 
        // const position = new kakao.maps.LatLng(37.7344933, 126.7737626);

        // // 커스텀 오버레이를 생성합니다
        // const customOverlay = new kakao.maps.CustomOverlay({
        //     map: map,
        //     position: position,
        //     content: content,
        //     yAnchor: 1
        // });
    }
    return (
        <div className={ss.wrap}>
            <div className={ss.lv1}>
                <img src={img_lv1} alt='' />
                <h2>Contact us <br className={ss.only_m} />Anytime.</h2>
            </div>
            <div className={ss.lv2}>
                <div className={ss.lv2_left}>
                    <p><span>TEL&nbsp;</span>+82-31-945-5636</p>
                    <p><span>FAX&nbsp;</span>+82-31-945-5637</p>
                    <p><span>Email&nbsp;</span>steven@yjun.co.kr</p>
                    <p style={{ marginBottom: '-1vw' }}><span>Address&nbsp;</span></p>
                    <p>#3, 55, Solan-gil, Sangjiseok-dong, Paju-si, Gyeonggi-do, S/Korea</p>
                    <img src={img_whatsapp} alt='' />
                </div>
                <div className={ss.lv2_right} id='map'></div>
            </div>
        </div>

    )
}

export default Contact