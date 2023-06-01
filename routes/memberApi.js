var express = require('express');
var router = express.Router();
const db = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res, next) =>{
    let result = {
        msg : '',
        code : 200,
        data : null
    }
    let userData = {email, name, telephone, password} = req.body;
    try {
        let encryptedPassword = await bcrypt.hash(userData.password, 12);
        userData.password = encryptedPassword;
        let user = await db.Member.create(userData);

        result.code = 200;
        result.msg = '회원가입 성공';
        result.data = user;
    }catch (err){
        result.msg = '회원가입 실패';
        result.code = 500;
    }
    res.json({result});
})

router.post('/login', async (req, res, next) =>{
    let result = {
        msg : '',
        code : 200,
        data : null
    }
    let userData = {email, password} = req.body;
    try {
        const user = await db.Member.findOne({where : {email : userData.email}});
        if(user == null){
            result.msg = '로그인 실패';
            result.code = 500;
            return res.json({result});
        }

        const match = await bcrypt.compare(userData.password, user.password);
        if(!match){
            result.msg = '패스워드 불일치';
            result.code = 400;
            return res.json({result});
        }
        const token = await jwt.sign({member_id : user.member_id , email : user.email, name : user.name, telephone : user.telephone}, process.env.JWT_KEY, {expiresIn : '1h', issuer : 'jiSoo'});
        result.msg = '로그인 성공';
        result.data = token;


    }catch (err){
        result.msg = '로그인 실패';
        result.code = 500;
    }

    res.json({result});
})


module.exports = router;