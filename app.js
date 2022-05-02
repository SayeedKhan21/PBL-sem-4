const express = require('express')
const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const { check, validationResult } = require('express-validator')
const app = express()
const bcrypt = require('bcrypt')
const PORT = process.env.PORT || 5000
const UserInfo = require('./models/signinmodel.js')
app.set('view engine', 'ejs')
// const JsonBookData=require('./public/general.json')


//add app.use here
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(cookieParser())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('signin')
})


app.post('/signin', [

    check('uname', "User Name must be 3 characters long ")
        .exists()
        .isLength({ min: 3 }),

    check('email', 'Invallid Email')
        .isEmail()
        .normalizeEmail() ,

    check('pass' , 'Invalid password')
      .isLength({min: 5}) 
      .equals('cpass') 


    
],
 (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        
        const alert = errors.array()
        res.render('signin', { alert })
    }
    else {
        var newUser = new UserInfo({

            UserName: req.body.uname,
            Email: req.body.email,
            Password: req.body.pass
            
        })

        
        newUser.save().then(data => {
            console.log(data);
            
            res.redirect('/index')
        })
        .catch(error => {
            res.json(error)
        })
    }
    
})

app.get('/index', (req, res) => {

    res.render('index')

})




app.listen(PORT, () => console.log(`Listening on ${PORT}`))