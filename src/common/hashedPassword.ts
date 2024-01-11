import bcrypt, { genSaltSync } from 'bcryptjs';

export const hashedPassword = async (password: string)=>{
    const salt = genSaltSync(10);
    const hasshedPass =  bcrypt.hashSync(password, salt);

    return hasshedPass
}

export const comparedPassword = async (inputPassword: string, dbPassword: string): Promise<boolean>=>{
   
      return await  bcrypt.compare(inputPassword, dbPassword);
      

}