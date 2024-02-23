const express = require('express')
const {body} = require('express-validator');
const ToDoController = require('../controller/ToDo');
const IsAuth = require('../middleware/isAuth');



const Router = express.Router();

Router.get('/todos',IsAuth,ToDoController.GetUserToDo);

Router.post('/todo/create',IsAuth,[
    body('title')
    .trim()
    .isLength({min:2})
    .withMessage('Not Enough characters.'),
    body('dueTime')
    .isDate()
    .withMessage('Not an Date.')
],ToDoController.CreateTodo)

Router.put('/todo/edit/todoId:',IsAuth,[
    body('title')
    .trim()
    .isLength({min:2})
    .withMessage('Not Enough characters.'),
    body('dueTime')
    .isDate()
    .withMessage('Not an Date.')
],ToDoController.EditTodo)


Router.delete('/delete/todoId:',IsAuth,ToDoController.DeleteTodo);




module.exports = Router;