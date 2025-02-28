import React, { useEffect, useState } from 'react'
import ss from './Inquiry.module.css'
import api from '../../util/api'
import { useSearchParams } from 'react-router-dom'
import img_lv1 from '../../img/inquiry/lv1.png'

const Inquiry = () => {

    const [searchParams] = useSearchParams()
    const productName = searchParams.get('product')

    const [name, setName] = useState('')
    const [company, setCompany] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [product, setProduct] = useState('none-selected')
    const [additional1, setAdditional1] = useState('')
    const [additional2, setAdditional2] = useState('')
    const [additional3, setAdditional3] = useState('')
    const [message, setMessage] = useState('')
    const [items, setItems] = useState([])

    useEffect(() => {
        fetchData()
    }, [])
    useEffect(() => {
        if (productName) {
            setProduct(productName)
        }
    }, [productName])

    const fetchData = async () => {
        try {
            const response = await api.get('get-item')
            if (response.status === 200) {
                const array = response.data.sort((a, b) => a.index - b.index)
                setItems(array)
            }
        } catch (err) {

        }
    }

    const handleSubmit = async () => {
        if (!name || !company || !email || !message) {
            alert('Please fill out all the information.')
            return
        }
        try {
            const response = await api.post('/submit-inquiry', { name, company, phone, email, product, additional1, additional2, additional3, message })
            if (response.status === 200) {
                alert('Your Inquiry has been sent successfully.')
                window.location.href = '/after-inquiry'
            } else {
                alert('Server Error. Please try again later.')
            }
        } catch (err) {

        }
    }

    return (
        <div className={ss.wrap}>
            <div className={ss.lv1}>
                <img src={img_lv1} alt='' />
                <h2>Where <br className={ss.only_m} />Our Partnership <br className={ss.only_m} />Begins.</h2>
            </div>
            <div className={ss.lv2}>
                <div>
                    <h3>Information Sectioin</h3>
                    <div className={ss.grid_wrap}>
                        <input type='text' placeholder='Your name *' value={name} onChange={(e) => setName(e.target.value)} />
                        <input type='text' placeholder='Company name *' value={company} onChange={(e) => setCompany(e.target.value)} />
                        <input type='text' placeholder='(Local) Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <input type='text' placeholder='Email *' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div>
                    <h3>Inquiry Sectioin</h3>
                    <div className={ss.grid_wrap}>
                        <select value={product} onChange={(e) => setProduct(e.target.value)}>
                            <option value='none-selected'>(select a product)</option>
                            {items.length > 0 && items.map((item, idx) => (
                                <option key={idx} value={item.name}>{item.name}</option>
                            ))}

                        </select>
                        {/* <input type='text' placeholder='Product name' value={product} onChange={(e) => setProduct(e.target.value)} /> */}
                        <input type='text' placeholder='Quantity needed' value={additional1} onChange={(e) => setAdditional1(e.target.value)} />
                        <input type='text' placeholder='Customization Needs' value={additional2} onChange={(e) => setAdditional2(e.target.value)} />
                        <input type='text' placeholder='Intended Use/Application' value={additional3} onChange={(e) => setAdditional3(e.target.value)} />
                    </div>
                    <textarea className={ss.tarea} placeholder='Additional Comments or Requests *' value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>

                <p className={ss.submit} onClick={() => handleSubmit()}>Submit your Inquiry</p>
            </div>
        </div>
    )
}

export default Inquiry