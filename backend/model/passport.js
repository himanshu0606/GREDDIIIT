const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const User = require("./userModel.js");

const GOOGLE_CLIENT_ID = "185955227319-ut7kfvkt3v9splhgbjhlntnshedkce7f.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback",
    //scope:["profile","email"],
},
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            email: profile.emails[0].value,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            username: "",
            age: "",
            contact: "",
            password: "",
            follower: [],
            following: [],
            savedPost: [],
        }
        try {
            let user_find = await User.findOne({ email: profile.emails[0].value });
            
            if (user_find) {
                done(null, user_find);
            } else {
                let user_find = await User.create(newUser);
                done(null, user_find);
            }
        } catch (err) {
            console.error(err);
        }
        done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    done(null, id);
})