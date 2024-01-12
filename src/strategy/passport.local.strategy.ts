import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../model/User.model';                              
import { comparedPassword } from '../common/hashedPassword';

export const PassportStrategy = (passport: any)=> {
  
    passport.use(
      new LocalStrategy(
        {usernameField: 'userName'},
        async (userName, password, done) => {
        try {
         const user = await User.findOne({userName: userName})
         if (!user) {
          return done(null, false)
         }
         //check if password matched
         if (await comparedPassword(password, user.password) === false) {
         return done(null, false, {message: "password do not matched"})
         }
         //return the user that is loggd in
         return done(null, user)
        } catch (error) {
          return done(error);
        }
      })
    );


    ///use the serialize and deserialized function here
    passport.serializeUser((user: any, done: any)=>{
     done(null, user.id)
    });

    passport.deserializeUser(async (id:any, done: any): Promise<any>=>{
      try {
        const user = await User.findById(id);
        done(null, user)
      } catch (error) {
        done(error)
      }
    })
  };
