// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import * as fs from 'fs';
// import csvParser from 'csv-parser';
// import axios from 'axios';

// @Injectable()
// export class InvoiceService {
//   private readonly apiUrl = process.env.API_URL;
//   private readonly apiToken = process.env.API_TOKEN;

//   async parseCsvAndCreateInvoices(filePath: string): Promise<void> {
//     const orders = await this.parseCsv(filePath);
//     for (const order of orders) {
//       await this.createInvoice(order);
//     }
//   }

//   async searchClient(clientName: string): Promise<any> {
//     const payload = {
//       name: 'גל',
//       active: true,
//       email: null,
//       contactPerson: 'dk',
//       labels: [],
//       taxId: null,
//       page: 1,
//       pageSize: 20,
//     };

//     const response = await axios.post(
//       `https://api.greeninvoice.co.il/api/v1/clients/search}/invoices`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${this.apiToken}`,
//           'Content-Type': 'application/json',
//         },
//       },
//     );
//     console.log(response);
    
//   }

//   private async parseCsv(filePath: string): Promise<any[]> {
//     return new Promise((resolve, reject) => {
//       const results = [];
//       fs.createReadStream(filePath)
//         .pipe(csvParser())
//         .on('data', (row) => results.push(row))
//         .on('end', () => resolve(results))
//         .on('error', (error) => reject(error));
//     });
//   }

//   private async createInvoice(order: any): Promise<void> {
//     const payload = {
//       client: {
//         name: order.clientName,
//         email: order.clientEmail,
//         address: order.clientAddress,
//       },
//       items: [
//         {
//           description: order.itemDescription,
//           quantity: Number(order.quantity),
//           price: Number(order.price),
//         },
//       ],
//       date: new Date().toISOString(),
//       currency: 'ILS',
//     };

//     try {
//       const response = await axios.post(`${this.apiUrl}/invoices`, payload, {
//         headers: {
//           Authorization: `Bearer ${this.apiToken}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       console.log(`Invoice created for ${order.clientName}:`, response.data);
//     } catch (error) {
//       console.error(
//         `Failed to create invoice for ${order.clientName}:`,
//         error || error,
//       );
//       throw new HttpException(
//         'Failed to create some invoices',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }
