import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  create(email: string, password: string) {
    const account = this.accountRepository.create({email, password});
    return this.accountRepository.save(account);
  }

  async findOne(id: number): Promise<Account> {
// try{
//     const payload = {
//       name: 'גל',
//       active: true,
//       email: null,
//       contactPerson: 'dk',
//       labels: [],
//       taxId: null
//     };

//     const response = await axios.post(
//       `https://api.greeninvoice.co.il/api/v1/clients/search`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer e1a25375-702f-4790-83a0-6ce28a98ddf3`,
//           'Content-Type': 'application/json',
//         },
//       },
//     );
//   }catch(e){
//     console.log(e);
    
//   }
    



    return this.accountRepository.findOneBy({ id });
  }

  async findByEmail(email: string) {    
    return await this.accountRepository.findOneBy({email});
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
