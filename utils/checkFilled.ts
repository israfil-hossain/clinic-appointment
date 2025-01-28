export const checkIfFilled = (appointmentData: any, scheduleData: any, ) => {
  //  console.log("Appointment Data ", appointmentData)
    const defaultAppointmentsCount = appointmentData?.filter((appointment: any) => {
      return appointment?.isDefault === true;
    }).length;
    const availableSlotsCount = scheduleData?.filter((slot: any) => slot?.date === "00:00:00").length;
    return defaultAppointmentsCount === availableSlotsCount;
  };