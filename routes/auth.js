const express = require('express')
const {body} = require('express-validator');
const AuthController = require('../controller/auth');
const passport = require('passport')
require('../middleware/Passport-Config');
const IsAuth = require('../middleware/isAuth');



const Router = express.Router();

// Google setup
Router.get('/google',passport.authenticate('google'));

Router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/login',session:false}),AuthController.CallbackGoogle);


//normal setups
Router.post('/signUp',[
    body('name')
    .trim()
    .isLength({min:3})
    .withMessage('Empty/Not enough character.'),
    body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is invalid'),
    body('password')
    .trim()
    .isLength({min:8})
    .withMessage('Pass not long enough.'),
    body("confirmPassword")
    .trim()
    .custom((value,{req})=>{
        if(value !== req.body.password){
            const error = new Error('Mismatched password')
            error.statusCode = 422;
            throw error;
        }
        return true
    })
],AuthController.SingUp);

Router.post('/login',[
    body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is invalid'),
    body('password')
    .trim()
    .isLength({min:8})
    .withMessage('Pass not long enough.')
],AuthController.LogIn)

Router.post('/logout',IsAuth,AuthController.Logout);

module.exports = Router