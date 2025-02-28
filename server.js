const express = require('express')
const cors = require('cors')
const https = require('https')
const fs = require('fs')
const mongoose = require('mongoose')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const nodemailer = require('nodemailer')

const app = express()

const port = 8989;

//mongoDB database models
const Item = require('./models/Item')
const ItemIndex = require('./models/ItemIndex')
const Category = require('./models/Category')


//로컬 버전 http 서버
// app.listen(port, () => {
//     console.log(`\x1b[35mServer is running on port \x1b[32m${port}\x1b[0m`)
// })

//배포 버전 https 서버
const sslKey = fs.readFileSync('/etc/letsencrypt/live/alphatest.store/privkey.pem');
const sslCert = fs.readFileSync('/etc/letsencrypt/live/alphatest.store/fullchain.pem');
const credentials = { key: sslKey, cert: sslCert };
https.createServer(credentials, app).listen(port, () => {
    console.log(`\x1b[32mhttps \x1b[35mServer is running on port \x1b[32m${port}\x1b[0m`);
});


//MongoDB 연결
mongoose.connect('mongodb+srv://bilvin0709:nalkeok02@yjuncluster.kbyw9.mongodb.net/yjun')
    .then(() => {
        const db = mongoose.connection;
        console.log(`\x1b[35mMongoDB Connected in \x1b[32m${db.name}\x1b[0m ${new Date().toLocaleString()}`)
    })
    .catch((err => console.log(err)))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//multer관련 미들웨어
//이미지 업로드
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname);
        // const filename = uniqueSuffix + '.' + ext;
        const filename = uniqueSuffix + ext;
        cb(null, filename);
    },
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 30, // 30MB
    },
})
app.use('/uploads', express.static('uploads'));


//이메일 관련 함수
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'younsg8793@gmail.com',
        pass: 'ewsstxtfsdruyrhl',
    },
});
const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: 'Y-JUN Corporation younsg8793@gmail.com', // 보내는 이메일 주소
            to, // 받는 이메일 주소
            subject, // 이메일 제목
            text, // 이메일 내용
        });

        console.log('이메일이 성공적으로 보내졌습니다:', info.response);
    } catch (error) {
        console.error('이메일 보내기 실패:', error);
    }
};







app.get('/test', async (req, res) => {
    try {
        console.log('api is running well')
        res.send('ok')
    } catch (err) {
        res.status(500).json()
        console.log(err)
    }
})

app.post('/admin-login', async (req, res) => {
    try {
        const { id, pw } = req.body
        if ((id === 'steven8963' && pw === 'bigrich0116') || (id === 'a' && pw === 'a')) {
            res.status(200).json('success')
        } else {
            res.status(200).json('fail')
        }
    } catch (err) {
        res.status(500).json()
        console.log(err)
    }
})

app.post('/add-image', upload.single('img'), async (req, res) => {
    // console.log('image : ', req.file.filename)
    try {
        const metadata = await sharp(req.file.path).metadata();

        if (metadata.width <= 1920 && metadata.height <= 1920) {
            // console.log('기본 리사이징')

            await sharp(req.file.path)
                .resize({ width: metadata.width })
                .withMetadata()
                .toFile(`./uploads/resize/${req.file.filename}`);
        } else {
            if (metadata.width >= metadata.height) {
                await sharp(req.file.path)
                    .resize({ width: 1920 })
                    .withMetadata()
                    .toFile(`./uploads/resize/${req.file.filename}`);
                // console.log('가로 리사이징')
            } else {
                await sharp(req.file.path)
                    .resize({ height: 1920 })
                    .withMetadata()
                    .toFile(`./uploads/resize/${req.file.filename}`);
                // console.log('세로 리사이징')
            }
        }

        if (fs.existsSync(`./uploads/resize/${req.file.filename}`)) {
            await fs.promises.rename(`./uploads/resize/${req.file.filename}`, `./uploads/${req.file.filename}`);
        }
        sharp.cache(false)

        res.status(200).json({ filename: req.file.filename });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/remove-image', async (req, res) => {
    try {
        const { imgName } = req.query
        if (imgName) {
            if (fs.existsSync(`./uploads/${imgName}`)) {
                await fs.promises.unlink(`./uploads/${imgName}`)

                try {
                    await fs.promises.access(`./uploads/${imgName}`);
                    res.status(201).json()
                } catch (error) {
                    res.status(200).json()
                }
            } else {
                res.status(200).json()
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

app.post('/add-item', async (req, res) => {
    try {
        const { 
            name, 
            modelName, 
            mainImg, 
            additionalImg, 
            content, 
            imgBody, 
            noticeContent,
            additionalInfo1,
            additionalInfo2,
            additionalInfo3,
            additionalInfo4,
            additionalInfo5,
            certificate,
            category,
            applications,
            modify 
        } = req.body

        if (modify) {
            const item = await Item.findById(modify)
            if (!item) {
                return res.status(404).json()
            }
            
            const itemIndex = await ItemIndex.findOne({ type: 'normal' })
            if (!itemIndex) {
                return res.status(404).json()
            }

            item.name = name
            item.modelName = modelName
            item.mainImg = mainImg
            item.additionalImg = additionalImg
            item.content = content
            item.imgBody = imgBody
            item.noticeContent = noticeContent
            item.additionalInfo1 = additionalInfo1
            item.additionalInfo2 = additionalInfo2
            item.additionalInfo3 = additionalInfo3
            item.additionalInfo4 = additionalInfo4
            item.additionalInfo5 = additionalInfo5
            item.certificate = certificate
            item.category = category
            item.applications = applications || []

            await item.save()
            res.status(200).json()
        } else {
            const itemIndex = await ItemIndex.findOne({ type: 'normal' })
            if (!itemIndex) {
                return res.status(404).json()
            }

            const item = new Item({
                index: itemIndex.index,
                name,
                modelName,
                mainImg,
                additionalImg,
                content,
                imgBody,
                noticeContent,
                additionalInfo1,
                additionalInfo2,
                additionalInfo3,
                additionalInfo4,
                additionalInfo5,
                certificate,
                category,
                applications: applications || []
            })

            itemIndex.index += 1
            await itemIndex.save()
            await item.save()
            res.status(200).json()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})

app.get('/get-item', async (req, res) => {
    try {
        const items = await Item.find()
        if (items) {
            res.status(200).json(items)
        } else {
            res.status(201).json()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})

app.get('/get-item-info', async (req, res) => {
    try {
        const { itemId } = req.query
        const item = await Item.findById(itemId)
        if (item) {
            res.status(200).json(item)
        } else {
            res.status(201).json()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})

app.get('/handle-remove-item', async (req, res) => {
    try {
        const { itemId } = req.query
        const item = await Item.findById(itemId)
        if (item) {
            if (fs.existsSync(`./uploads/${item.mainImg}`)) {
                fs.promises.unlink(`./uploads/${item.mainImg}`)
            }
            for (const target of item.additionalImg) {
                if (fs.existsSync(`./uploads/${target}`)) {
                    fs.promises.unlink(`./uploads/${target}`)
                }
            }
            for (const target of item.imgBody) {
                if (fs.existsSync(`./uploads/${target}`)) {
                    fs.promises.unlink(`./uploads/${target}`)
                }
            }
        }
        const del = await Item.findByIdAndDelete(itemId)
        if (del) {
            const itemIndex = await ItemIndex.findOne({ type: 'normal' })
            itemIndex.index -= 1
            const targets = await Item.find({ index: { $gt: del.index } })
            for (const target of targets) {
                target.index -= 1
                await target.save()
            }
            await itemIndex.save()
            res.status(200).json()
        } else {
            res.status(201).json()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})

app.post('/submit-inquiry', async (req, res) => {
    try {
        const { name, company, phone, email, product, additional1, additional2, additional3, message } = req.body
        sendEmail('dominic@raulsoft.com', `새로운 견적 요청`, `고객명 : ${name} \n 회사 이름 : ${company} \n 휴대폰 번호 : ${phone} \n 메일 주소 : ${email} \n 관심 상품 : ${product} \n 필요 수량 : ${additional1} \n 커스터마이징 : ${additional2} \n 사용 용도 : ${additional3} \n 기타 메시지 : ${message}`)
        // sendEmail('steven@yjun.co.kr', `새로운 견적 요청`, `고객명 : ${name} \n 회사 이름 : ${company} \n 휴대폰 번호 : ${phone} \n 메일 주소 : ${email} \n 관심 상품 : ${product} \n 필요 수량 : ${additional1} \n 커스터마이징 : ${additional2} \n 사용 용도 : ${additional3} \n 기타 메시지 : ${message}`)
        res.status(200).json()
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})

app.get('/handle-change-product-index', async (req, res) => {
    const { type, index } = req.query
    try {
        const origin = await Item.findOne({ index: index })
        if (origin) {
            let target = {}
            if (type === 'up') {
                target = await Item.findOne({ index: origin.index - 1 })
                if (target._id) {
                    origin.index -= 1
                    target.index += 1
                    await target.save()
                }
            } else if (type === 'down') {
                target = await Item.findOne({ index: origin.index + 1 })
                if (target._id) {
                    origin.index += 1
                    target.index -= 1
                    await target.save()
                }
            }
            await origin.save()
            if (origin.index !== index) {
                res.status(200).json()
                return
            }
        }
        res.status(201).json()
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})

app.post('/update-home-notice', async (req, res) => {
  try {
    const { itemId, homeNotice } = req.body
    
    if (!itemId || homeNotice === undefined) {
      return res.status(400).json({ error: '필수 입력값이 누락되었습니다.' })
    }

    // 노출 설정이 true일 때 인덱스 검증
    if (homeNotice.notice) {
      const inputIndex = Number(homeNotice.index)
      
      // 0이나 음수 체크
      if (inputIndex <= 0) {
        return res.status(400).json({ error: '1 이상의 숫자를 입력해주세요.' })
      }

      // 현재 노출 중인 최대 인덱스 확인
      const maxIndexItem = await Item.findOne({
        _id: { $ne: itemId },
        'homeNotice.notice': true
      }).sort({ 'homeNotice.index': -1 })

      // 입력된 인덱스가 현재 최대 인덱스보다 크면 자동으로 다음 번호 부여
      if (maxIndexItem) {
        homeNotice.index = Math.min(inputIndex, maxIndexItem.homeNotice.index + 1)
      } else {
        homeNotice.index = 1
      }
    }

    const item = await Item.findById(itemId)
    if (!item) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' })
    }

    // 노출 설정을 해제하는 경우
    if (!homeNotice.notice && item.homeNotice?.notice) {
      const removedIndex = item.homeNotice.index
      
      // 해제된 인덱스보다 큰 인덱스를 가진 항목들의 인덱스를 1씩 감소
      await Item.updateMany(
        {
          _id: { $ne: itemId },
          'homeNotice.notice': true,
          'homeNotice.index': { $gt: removedIndex }
        },
        { $inc: { 'homeNotice.index': -1 } }
      )
    }
    // 노출 설정을 추가하는 경우
    else if (homeNotice.notice) {
      const targetIndex = Number(homeNotice.index)
      
      await Item.updateMany(
        {
          _id: { $ne: itemId },
          'homeNotice.notice': true,
          'homeNotice.index': { $gte: targetIndex }
        },
        { $inc: { 'homeNotice.index': 1 } }
      )
    }

    item.homeNotice = {
      notice: homeNotice.notice,
      index: homeNotice.notice ? Number(homeNotice.index) : null
    }

    await item.save()
    res.status(200).json({ message: '홈 노출 설정이 저장되었습니다.' })

  } catch (err) {
    console.error('홈 노출 설정 업데이트 중 오류:', err)
    res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
})

app.post('/update-recommend', async (req, res) => {
  try {
    const { itemId, recommend } = req.body
    
    if (!itemId || recommend === undefined) {
      return res.status(400).json({ error: '필수 입력값이 누락되었습니다.' })
    }

    // 노출 설정이 true일 때 인덱스 검증
    if (recommend.recommend) {
      const inputIndex = Number(recommend.index)
      
      // 0이나 음수 체크
      if (inputIndex <= 0) {
        return res.status(400).json({ error: '1 이상의 숫자를 입력해주세요.' })
      }

      // 현재 노출 중인 최대 인덱스 확인
      const maxIndexItem = await Item.findOne({
        _id: { $ne: itemId },
        'recommend.recommend': true
      }).sort({ 'recommend.index': -1 })

      // 입력된 인덱스가 현재 최대 인덱스보다 크면 자동으로 다음 번호 부여
      if (maxIndexItem) {
        recommend.index = Math.min(inputIndex, maxIndexItem.recommend.index + 1)
      } else {
        recommend.index = 1
      }
    }

    const item = await Item.findById(itemId)
    if (!item) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' })
    }

    // 노출 설정을 해제하는 경우
    if (!recommend.recommend && item.recommend?.recommend) {
      const removedIndex = item.recommend.index
      
      // 해제된 인덱스보다 큰 인덱스를 가진 항목들의 인덱스를 1씩 감소
      await Item.updateMany(
        {
          _id: { $ne: itemId },
          'recommend.recommend': true,
          'recommend.index': { $gt: removedIndex }
        },
        { $inc: { 'recommend.index': -1 } }
      )
    }
    // 노출 설정을 추가하는 경우
    else if (recommend.recommend) {
      const targetIndex = Number(recommend.index)
      
      await Item.updateMany(
        {
          _id: { $ne: itemId },
          'recommend.recommend': true,
          'recommend.index': { $gte: targetIndex }
        },
        { $inc: { 'recommend.index': 1 } }
      )
    }

    item.recommend = {
      recommend: recommend.recommend,
      index: recommend.recommend ? Number(recommend.index) : null
    }

    await item.save()
    res.status(200).json({ message: '추천 상품 설정이 저장되었습니다.' })

  } catch (err) {
    console.error('추천 상품 설정 업데이트 중 오류:', err)
    res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
})

// 카테고리 조회
app.get('/get-categories', async (req, res) => {
    try {
        const categories = await Category.find().sort('index')
        res.status(200).json(categories)
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})

// 카테고리 추가
app.post('/add-category', async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({ error: '카테고리 이름은 필수입니다.' })
        }

        // 현재 최대 index 값 찾기
        const maxIndexCategory = await Category.findOne().sort('-index')
        const nextIndex = maxIndexCategory ? maxIndexCategory.index + 1 : 0

        const category = new Category({
            name,
            index: nextIndex
        })

        await category.save()
        res.status(200).json(category)
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})

// 카테고리 수정
app.put('/update-category', async (req, res) => {
    try {
        const { id, name } = req.body
        if (!name) {
            return res.status(400).json({ error: '카테고리 이름은 필수입니다.' })
        }

        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).json({ error: '카테고리를 찾을 수 없습니다.' })
        }

        category.name = name
        await category.save()
        res.status(200).json(category)
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})

// 카테고리 삭제
app.delete('/delete-category/:id', async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findById(id)
        
        if (!category) {
            return res.status(404).json({ error: '카테고리를 찾을 수 없습니다.' })
        }

        // 삭제된 카테고리보다 높은 index를 가진 카테고리들의 index를 1씩 감소
        await Category.updateMany(
            { index: { $gt: category.index } },
            { $inc: { index: -1 } }
        )

        await Category.findByIdAndDelete(id)
        res.status(200).json({ message: '카테고리가 삭제되었습니다.' })
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})

// 카테고리 순서 업데이트
app.post('/update-category-order', async (req, res) => {
    try {
        const { categories } = req.body
        
        // 벌크 업데이트를 위한 작업 배열
        const bulkOps = categories.map(({ id, index }) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { index } }
            }
        }))

        await Category.bulkWrite(bulkOps)
        res.status(200).json({ message: '카테고리 순서가 업데이트되었습니다.' })
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
})