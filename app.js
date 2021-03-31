// 创建express服务器并开启监听
const express = require("express")
const server = express()

server.use('/uploads', express.static('uploads'))
//通过路由中间件来 加载不同的路由
const accountRouter = require('./router/account_router.js')
server.use('/api', accountRouter)

const userRouter = require('./router/user_router.js')
server.use('/my', userRouter)

const cateRouter = require('./router/cate_router.js')
server.use('/my/article', cateRouter)

//  开启监听
server.listen(3000, () => {
    console.log("您的服务器已经在3000端口就绪了");
})