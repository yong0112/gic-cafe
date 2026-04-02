import { injectable } from 'tsyringe';
import { IRequestHandler } from '@/mediator/mediator';
import { CafeRepository } from '@/repositories/CafeRepository';
import { GetCafesQuery } from '@/cafes/queries/GetCafesQuery';

export interface CafeResponse {
  id: string;
  name: string;
  description: string;
  employees: number;
  logo?: string;
  location: string;
}

@injectable()
export class GetCafesHandler implements IRequestHandler<GetCafesQuery, CafeResponse[]> {
  constructor(private readonly cafeRepository: CafeRepository) {}

  async handle(query: GetCafesQuery): Promise<CafeResponse[]> {
    const cafes = await this.cafeRepository.findAll(query.location);
    return cafes.map((cafe) => ({
      id: cafe.id,
      name: cafe.name,
      description: cafe.description,
      employees: cafe._count.employees,
      ...(cafe.logo ? { logo: cafe.logo } : {}),
      location: cafe.location,
    }));
  }
}
