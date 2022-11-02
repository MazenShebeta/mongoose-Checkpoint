const mongoose = require('mongoose');
const validator = require('validator')
const { passwordStrength } = require('check-password-strength')
const bcrypt = require('bcrypt')



const personSchema = new mongoose.Schema({
    name: {type : String, required: true, unique: true},
    
    email: {type: String, required: true, unique: true, lowerCase: true, validate(val){
        if(!validator.isEmail(val)){
            throw new Error("invalid E-mail")
        }
    }},

    password: {type: String,
        validate(val){
        if(passwordStrength(val).value !="Strong")
        {
            
            throw new Error("try a stronger password")}
    }},

    age: Number ,

    favoriteFoods: [String],
    
    tokens: [{
        token: {
            type: String
            // max: 5 //max tokens per user
        }
    }]



});

personSchema.pre('save', async function(){
    if(this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 9)
})


personSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

//export
module.exports = mongoose.model('Person', personSchema);