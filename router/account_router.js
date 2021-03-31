const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())
// 注册用户
router.post('/reguser', (req, res) => {
    //  获取用户名和密码 
    console.log(req.body)
    const { username, password } = req.body
    // 验证名字有没有被占用
    const sqlStrSelect = `select username from users where username="${username}"`
    conn.query(sqlStrSelect, (err, result) => {
        // 说明查询出错
        if (err) {
            console.log(err)
            res.json({ status: 500, msg: "服务器错误" })
            return
        }
        console.log(result)
        // 名字被占用了
        if (result.length > 0) {
            res.json({ status: 1, msg: "注册失败，名字占用了" })
            return
        }
        // 没有占用，继续做添加
        const sqlStr = `insert into users (username,password) values ("${username}","${password}")`
        // console.log(sqlStr)
        // 执行sql操作数据库
        conn.query(sqlStr, (err, result) => {
            console.log(err)
            console.log(result)
            if (err) {
                res.json({ status: 500, msg: "服务器错误" })
                return
            }
            // 根据操作结果，做不同的响应
            res.json({ status: 0, msg: '注册成功' })
        })
    })
})


// 2.0 登录接口
router.post('/login', (req, res) => {
    // 1. 接收参数
    console.log('收到的参数是', req.body)
    const { username, password } = req.body
    // 2. 拼接sql字符串, 思路:根据用户名和密码去做查询，如果查找到了，说明登陆成功，
    //                       查不到，说明错误
    const sqlStr = `select * from users where username="${username}" and password="${password}"`
    // 3. 执行sql
    conn.query(sqlStr, (err, result) => {
        // 4. 根据结果进行返回 
        if (err) {
            console.log(err)
            res.json({ msg: '服务器错误', status: 500 })
            return
        }
        console.log("查询结果", result)
        if (result.length > 0) {
            // 查找到了，说明登陆成功
            //   const token ='Bearer '+ jwt.sign(
            const token = jwt.sign(
                { name: username },
                'gz61',  // 加密的密码，要与express-jwt中的验证密码一致
                { expiresIn: 2 * 60 * 60 } // 过期时间，单位是秒
            )
            res.json({ msg: "登陆成功", status: 0, token })
        } else {
            res.json({ msg: "登陆失败，用户名密码不对", status: 1 })
        }
    })
})

module.exports = router