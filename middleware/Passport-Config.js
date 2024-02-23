const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const jwt = require('jsonwebtoken')


exports.GoogleConfig = passport.use(new GoogleStrategy({
    clientID:process.env.GCLIENT_ID,
    clientSecret:process.env.GCLIENT_SECRET,
    callbackURL:"http://localhost:4000/auth/google/callback",
    scope:['profile','email']
},async(accessToken,refreshToken,profile,done)=>{
    try{
        const payload = {
            email:profile.emails[0].value
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:accessToken.expires_in})
        const user = {
            name:profile.name,
            email:profile.emails[0].value,
            accessToken:accessToken
        }
        done(null,{user,token})
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        done(err,null);
    }
}))
