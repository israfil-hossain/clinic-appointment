// pdfUtils.ts
import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = ({
  data,
  location,
  day,
  date,
}: {
  data: any[];
  location: string;
  day: any;
  date: any;
}) => {
  const doc = new jsPDF();
  const tableColumns = [
    "Time prezent",
    "Nume",
    "Prenume",
    "Department",
    "Telefon",
    "Doctor",
    "Notes",
  ];
  const tableRows: string[][] = [];

  // Prepare data for the table
  data?.forEach((appointment: any) => {
    const row = [
      appointment.time,
      appointment.patientName,
      appointment.patientSurname,
      appointment.testType,
      appointment.phoneNumber,
      appointment.doctorName,
      appointment.notes,
    ];
    tableRows.push(row);
  });

  // Add title with custom styles
  doc.setFont("Arial", "bold"); // Set font to Helvetica and make it bold
  doc.setFontSize(14); // Set font size
  doc.setTextColor(40, 40, 100); // Set text color (RGB format)
  doc.text(`Appointments List for ${location} - ${day}, ${date}`, 12, 10);
  // Add the table
  doc.autoTable({
    head: [tableColumns],
    body: tableRows,
    startY: 20,
  });

  // Save the PDF
  doc.save("appointments.pdf");
};
