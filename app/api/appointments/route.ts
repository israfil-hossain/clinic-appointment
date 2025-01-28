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
      const token = request.cookies.get("token")?.value;
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
          { patientName: doctorName }
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

export async function POST(request: NextRequest) {
  await dbConnect();
  const { location, date, time, patientName, testType, phoneNumber, isConfirmed, notes,doctorName } = await request.json();

  try {
    // Validate JWT token
    const token = request.cookies.get("token")?.value;
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

    // Create new appointment
    const newAppointment = new AppointmentModel({
      location,
      date,
      time,
      patientName,
      doctorName,
      testType,
      phoneNumber,
      isConfirmed,
      notes,
    });

    await newAppointment.save();
    return NextResponse.json(
      { message: "Appointment Created Successfully!", data: newAppointment },
      { status: 201 }
    );
  } catch(err) {
    // console.log(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Appointment ID is required!" },
        { status: 400 }
      );
    }

    // Parse the request body for updated data
    const updatedData = await request.json();

    // Validate JWT token
    const token = request.cookies.get("token")?.value;
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

    // Partially update the appointment by ID
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { $set: updatedData }, // Only update provided fields
      { new: true, runValidators: true } // Return updated document
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { message: "Appointment not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Appointment Updated Successfully!", data: updatedAppointment },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await dbConnect();

  try {
    // Get appointment ID from query parameters
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Appointment ID is required!" },
        { status: 400 }
      );
    }

    // Validate JWT token
    const token = request.cookies.get("token")?.value;
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

    // Delete the appointment by ID
    const deletedAppointment = await AppointmentModel.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return NextResponse.json(
        { message: "Appointment not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Appointment Deleted Successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
