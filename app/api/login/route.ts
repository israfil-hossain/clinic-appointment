import bcrypt from "bcrypt";
import dbConnect from "@/utils/mongodb";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";

const secret = process.env.SECRET;

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
        { message: "Invalid Credentials !" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 404 }
      );
    }

    const jwtSecret = new TextEncoder().encode(secret);
    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(jwtSecret);

    const userResponse = {
      username: user.username,
      email: user.email,
      role: user.role,
      access: user.accessSection,
    };

    const loginResponse = NextResponse.json(
      { message: "Login Successful !", user: userResponse, token },
      { status: 200 }
    );

    loginResponse.cookies.set({
      name: "authToken", 
      value: token, 
      path: "/",
      httpOnly: true, 
      maxAge: 3600, 
      secure: process.env.NODE_ENV === "production", 
    });

    return loginResponse;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
