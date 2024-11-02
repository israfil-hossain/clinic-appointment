// import { NextApiRequest, NextApiResponse } from 'next';
// import dbConnect from '../../utils/dbConnect';
// import Appointment from '../../models/Appointment';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();

//   switch (req.method) {
//     case 'GET':
//       try {
//         const appointments = await Appointment.find(req.query).populate('location');
//         res.status(200).json({ success: true, data: appointments });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;
//     case 'POST':
//       try {
//         const appointment = await Appointment.create(req.body);
//         res.status(201).json({ success: true, data: appointment });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;
//     case 'PUT':
//       try {
//         const { id } = req.query;
//         const appointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
//         res.status(200).json({ success: true, data: appointment });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;
//     case 'DELETE':
//       try {
//         const { id } = req.query;
//         await Appointment.findByIdAndDelete(id);
//         res.status(200).json({ success: true });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;
//     default:
//       res.status(405).end();
//       break;
//   }
// }
