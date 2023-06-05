var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{ title: 'express' });
});

router.get('/chat', function(req, res, next) {
  res.render('chat');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

// JWT token 형식 웹페이지
router.get('/token', function(req, res, next) {
  res.render('token');
});

// JWT token 생성 라우팅 메소드
router.post('/token', function(req, res, next) {
  let userData = {email, name, telephone, usertype} = req.body
  const token = jwt.sign(userData,process.env.JWT_KEY , {expiresIn: '1h', issuer:'jiSoo'});
  res.json({token});
});

router.get('/verify', function(req, res, next) {
  let token = req.query.token;

  let result = {
    msg : '',
    data : null
  }
  try{
    const userData = jwt.verify(token, process.env.JWT_KEY);
    result.msg = 'success';
    result.data = userData;
  }catch (err){
    result.msg = err.message
    console.log(err);
  }
    res.json({result});
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
});

module.exports = router;
