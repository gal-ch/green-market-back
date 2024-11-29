import { NotFoundException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  create(email: string, password: string) {
    const account = this.accountRepository.create({ email, password });
    return this.accountRepository.save(account);
  }

  async findPartialOneByUrl(accountUrl: string): Promise<Partial<Account>> {
    const account = await this.accountRepository.findOneBy({
      siteUrl: accountUrl,
    });
    console.log(account);
    

    return {
      id: account.id,
      settings: account.settings,
      siteUrl: account.siteUrl,
      email: account.email,
    };
  }

  async findAccountByUrl(accountUrl: string): Promise<Account> {
    const account = await this.accountRepository.findOneBy({
      siteUrl: accountUrl,
    });
    return account
  }

  async findOne(id: number): Promise<Account> {
    return this.accountRepository.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return await this.accountRepository.findOneBy({ email });
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.accountRepository.findOneBy({ id });
    if (!account) {
      throw new NotFoundException(`account with id ${id} not found`);
    }
    Object.assign(account, updateAccountDto);
    return this.accountRepository.save(account);
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}

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
