import bcrypt from "bcrypt";
import dbConnect from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  await dbConnect();
  const { email, password } = await request.json();

  try {
    if (!email || !password) {
      return NextResponse.json(
        { message: "Please Provide Credentials !" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found!" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
   
    if(isPasswordValid){
      const tokenData = {
        id:user._id,
        email:user.email,
        username:user.username
      }
  
      const token = jwt.sign(tokenData,process.env.SECRET!,{expiresIn:'7d'})
      
  
      const userResponse = {
        username: user.username,
        email: user.email,
        role: user.role,
        access: user.accessSection,
      };
  
      const loginResponse = NextResponse.json(
        { message: "Login Successfull !", user: userResponse, token },
        { status: 200 }
      );
  
      loginResponse.cookies.set('token',token,{httpOnly:true})
      return loginResponse
    }
    else{
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
