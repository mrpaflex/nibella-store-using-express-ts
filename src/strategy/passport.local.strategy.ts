import { Strategy as LocalStrategy } from 'passport-local';
import { IUser, User } from '../model/User.model';                              
import { comparedPassword } from '../common/hashedPassword';



export const PassportStrategy = async (passport: any)=> {
  
    passport.use(
      new LocalStrategy(
        {usernameField: 'userName'},
        async (userName, password, done) => {
        try {
         const user = await User.findOne({userName: userName})
         if (!user) {
          return done(null, false, {message: "1"})
         }
         //check if password matched
         if (await comparedPassword(password, user.password) === false) {
         return done(null, false, {message: "2"})
         }
         //return the user that is loggd in
         return done(null, user)
        } catch (error) {
          return done(error);
        }
      })
    );

    passport.serializeUser((user: IUser, done: any) => {
      done(null, user._id);
    });
    

    passport.deserializeUser(async (id: string, done: any) => {
      try {
        const user = await User.findById(id);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    });
    
  };


  

//   export {}
// declare global {
//   namespace Express {
//     interface Request {
//       user?: User | undefined;
//     }
//   }
// }