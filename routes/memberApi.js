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

router.get('/profile', async (req, res, next) =>{
    let result = {
        msg : '',
        code : 200,
        data : null
    }

    try{
        const token =  req.headers.authorization.split('Bearer ')[1];
        if(token == undefined){
            return res.json({msg : '토큰이 없습니다', code : 404});
        }

        const userData = jwt.verify(token, process.env.JWT_KEY);
        if(userData == null){
            return res.json({msg : '토큰이 만료되었습니다'});
        }
        const email = userData.email;


        const memberData = await db.Member.findOne({where : {email : email}});
        if(memberData == null){
            return res.json({msg : '회원정보가 없습니다'});
        }

        memberData.password = null;
        result.msg = 'success';
        result.data = memberData;
        return res.json({result});
    }catch (err){
        result.msg = '서버 에러 발생';
        result.code = 500;
    }
})

router.get('/all', async (req, res, next) =>{
    let members = await db.Member.findAll();

    res.json({members});
})


module.exports = router;