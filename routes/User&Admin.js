const express = require('express')
const {body} = require('express-validator');
const UAController = require('../controller/User&Admin');
const {IsAdmin,IsAuth} = require('../middleware/isAuth');



const Router = express.Router();


Router.get('/userP',IsAuth,UAController.getUserP);

Router.put('/editProfile',IsAuth,[
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
    .withMessage('Pass not long enough.')
],UAController);

Router.get('/allUsers',IsAdmin,UAController.getAllUsers);

Router.put('/editUserProfile/:userId/:roll',IsAdmin,[
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
],UAController);

Router.put('/editTodo/:todoId',IsAdmin,[
    body('title')
    .trim()
    .isLength({min:2})
    .withMessage('Not Enough characters.'),
    body('dueTime')
    .isDate()
    .withMessage('Not an Date.')
],UAController);

Router.delete('/deleteUser/:userId',IsAdmin,UAController);

Router.delete('/deleteUserTodo/todoId',IsAdmin,UAController)

module.exports = Router