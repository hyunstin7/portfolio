import { connectDB } from "@/util/db"



export default async function Handler(req,res){
    let {name , comment} = await req.body
    const info = {name, comment,}
    const db = (await connectDB).db('4rum')
    try {
        if(req.method == 'POST') {
           
                if(!name || name.trim() === ''){
                 res.status(403).json('이름을 입력해주세요')
                }
            else if (!comment || comment.trim() === ''){
                 res.status(403).json('내용을 입력해주세요')
             }
             else{
             console.log('작성완료')
                 await db.collection('portfolio-comment').insertOne(info)
                 const commentArr = await db.collection('portfolio-comment').find().toArray()
                 return res.status(200).json(commentArr)    
             }
             
          
         }else if(req.method == 'GET'){
                const commentArr = await db.collection('portfolio-comment').find().toArray()
                 return res.status(200).json(commentArr)   
         }
    } catch (error) {
        console.error(error); // 서버 로그에 에러 기록
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}