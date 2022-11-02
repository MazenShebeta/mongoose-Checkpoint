const person = require('../controllers/person')
const Router = require('express').Router()
const express = require('express')



Router.post('/login' ,function(req, res){
    person.login(req, res)
})

Router.post('/register', function(req, res){
    person.register(req, res)
})

// Router.post('/account', person.verifyToken, person.showAccount)

// Router.post('/logout', person.logout)


module.exports = Router;