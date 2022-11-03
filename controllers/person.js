const mongoose = require('mongoose');
const Person = require('../models/personModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


require('../models/connections');


class person{
    // craete one person
    static async save(name, email, password, age, favoriteFoods){
        await bcrypt.hash(password, 9, (err, hash)=>{
            if(err) return console.error(err);
            let person = new Person({
                name: name,
                email: email,
                password: hash,
                age: age,
                favoriteFoods: favoriteFoods
            });
            person.save((err, data)=>{
                if(err) return console.error(err);
                console.log(data);
            });
        });
    }

    //create multiple people
    static async create(arrayOfPeople){
        await Person.create(arrayOfPeople, (err, data)=>{
            if(err) return console.error(err);
            console.log(data);
        });
    }
    //find a person by name
    static async searchForPerson(personName){
        try{
            let data = await Person.find({name: personName});
            console.log(data)
        }
        catch(err){
            console.error(err)
        }
        
    }
    //find a person by favorite food
    static async findOne(favoriteFood){
        await Person.findOne({favoriteFoods: favoriteFood}, (err, data)=>{
            if(err) return console.error(err);
            console.log(data);
        });
    }
    //find a person by id
    static async findById(personId){
        await Person.findById(personId, (err, data)=>{
                if(err) return console.error(err);
                console.log(data);
            }
        );
    }
    //find a person by id and update
    static async findOneAndUpdate(personId, personName){
        await Person.findById(personId, (err, data)=>{
            if(err) return console.error(err);
            data.name = personName;
            data.save((err, data)=>{
                if(err) return console.error(err);
                console.log(data);
            });
        });
    }

    //find a person by id and delete
    static async findByIdAndRemove(personId){
        await Person.findByIdAndRemove(personId, (err, data)=>{
            if(err) return console.error(err);
            console.log(data);
        }
    );
    }
    //find people and delete
    static async remove(arrayOfPeople){
        await Person.remove({name: arrayOfPeople}, (err, data)=>{
            if(err) return console.error(err);
            console.log(data);
        });
    }
    static async chainSearchQuery(){
        let chain = await Person.find({favoriteFoods:"pizza"}).sort({name:1}).limit(2).select('name favoriteFoods')
        console.log(chain)
    }
    static async checkCredentials(email, password){
        //return id of person
        let user = await Person.findOne({email: email})
        console.log("user: " + user)
        if(user){
            let match = await bcrypt.compare(password, user.password)
            console.log("match: " + match)
            if(match){
                return user._id
            }
            else{
                return console.error("password does not match")
            }
        }
        else{
            return console.error("user not found")
        }
    }

    static verifyToken(req, res, next){
        const bearerHeader = req.headers['authorization']
        if(typeof bearerHeader !== 'undefined'){
            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[1]
            req.token = bearerToken
            next()
        }
        else{
            res.sendStatus(403)
        }
    }

    static async showAccount(req, res){
        const id = jwt.verify(req.token, 'secretkey').id
        await person.findById(id, (err, data)=>{
            if(err) return console.error(err);
            res.json(data);
        });
    }

    static async register(req, res){
        try{
            await person.save(req.body.name, req.body.email, req.body.password, req.body.age, req.body.favoriteFoods)
            res.send("user created")
            
        }
        catch(err){
            res.send(err.message)
        }
    }

    static async login(req, res){
        try{
            const userID = await person.checkCredentials(req.body.email, req.body.password)
            console.log("login userID"+userID)
            let token = jwt.sign({id:userID}, 'secretkey')
            try{
                let response = await person.addTokenToDatabase(userID, token)
                res.send(response)
                
            }
            catch(err){
                res.send(err.message)
            }
        }

        catch(err){
            res.send(err.message)
        }
    
    }

    static async addTokenToDatabase(id, token){
        try{
            const user = await Person.findOne({_id:id})
            console.log("id: "+id)
            console.log(user)
            if(user){
                user.tokens = await user.tokens.concat({token})
                await user.save()
                return user
            }
            else{
                return("user not found")
            }
        }
        catch(err){
            console.log(err.message)
        }
        
    }

    static async getAll(req, res){
        try{
            const users = await Person.find({})
            res.send(users)
        }
        catch(err){
            res.send(err.message)
        }
    }

    static async update(req, res){
        try{
            let user = await Person.findOne({_id:req.params.id})
            if(user){
                user.name = req.body.name
                user.age = req.body.age
                user.favoriteFoods = req.body.favoriteFoods
                await user.save()
                res.send(user)
            }
            else{
                res.send("user not found")
            }
        }
        catch(err){
            res.send(err.message)
        }
    }

    static async delete(req, res){
        try{
            let user = await Person.findOne({_id:req.params.id})
            if(user){
                await user.remove()
                res.send("user deleted")
            }
            else{
                res.send("user not found")
            }
        }
        catch(err){
            res.send(err.message)
        }
    }
    
}





// //add a person
// person.save('Shebeta',"mazen@mail.com","PrettyStrongPassword4321*", 23, ['Spagetti', 'Molokhya']);
// // add multiple people
// person.create([{name: 'Jake', age: 27, favoriteFoods: ['pizza', 'burger']}, {name: 'Jane', age: 30, favoriteFoods: ['pizza', 'burger']}]);
// //find a person by name
// person.searchForPerson('John');
// //find a person by favorite food
// person.findOne('pizza');
// //find a person by id
// person.findById('635abf72e92865dc8e19a53e');
// //find a person by id and update
// person.findOneAndUpdate('635abf72e92865dc8e19a53e', 'John Doe');
// //find a person by id and delete
// person.findByIdAndRemove('635abf72e92865dc8e19a53e');
// //find people and delete
// person.remove(['Jake', 'Jane']);
// person.chainSearchQuery();
// person.login('mazen@mail.com', 'PrettyStrongPassword4321*')



//export logIn

module.exports = person;

