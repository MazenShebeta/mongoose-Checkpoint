const person = require('../controllers/person')
const Router = require('express').Router()
const express = require('express')



Router.post('/login' ,function(req, res){
    person.login(req, res);
})

Router.post('/register', function(req, res){
    person.register(req, res);
})

Router.get('/users', function(req,res){
    person.getAll(req, res);
})

Router.put('/update/:id', function(req, res){
    person.update(req, res);
})

Router.delete('/delete/:id', function(req, res){
    person.delete(req, res);
})

// Router.post('/account', person.verifyToken, person.showAccount)

// Router.post('/logout', person.logout)


module.exports = Router;