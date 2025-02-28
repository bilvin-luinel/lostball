import baseURL from "../data/baseURL"

const getImgURLFromImgName = (imgName, type) => {
    if (type === 'forInline') {
        return `url(${baseURL}/uploads/${imgName})`
    } else {
        return `${baseURL}/uploads/${imgName}`
    }

}

export default getImgURLFromImgName