import dbConnect from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import AppointmentModel from "@/models/Appointment";
import { verifyJWT } from "@/utils/jwtUtils";


export async function GET(request: NextRequest) {
    await dbConnect();
    
    // Retrieve query parameters for filters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const location = searchParams.get("location");
    const testType = searchParams.get("testType");
    const doctorName = searchParams.get("doctorName");
  
    try {
      // Validate JWT token
      const token = request.cookies.get("authToken")?.value;
      if (!token) {
        return NextResponse.json(
          { message: "Authentication required!" },
          { status: 401 }
        );
      }
  
      // Decode and verify JWT token
      const decoded = await verifyJWT(token);
      if (!decoded) {
        return NextResponse.json(
          { message: "Invalid or expired token!" },
          { status: 401 }
        );
      }
  
      // Build filter criteria
      const filter: any = {};
      if (date) filter.date = new Date(date);
      if (location) filter.location = location;
      if (testType) filter.testType = testType;
      if (doctorName) {
        filter.$or = [
          { patientName: doctorName },
          { patientSurname: doctorName },
        ];
      }
  
      // Fetch filtered appointments
      const appointments = await AppointmentModel.find(filter).sort({ date: 1 });
      return NextResponse.json({ success: true, data: appointments }, { status: 200 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
  }