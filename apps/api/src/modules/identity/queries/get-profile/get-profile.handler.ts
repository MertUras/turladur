import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { IdentityService } from '../../services/identity.service';
import { GetProfileQuery } from './get-profile.query';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {
  constructor(private readonly identityService: IdentityService) {}

  execute(query: GetProfileQuery) {
    return this.identityService.getProfile(query.userId);
  }
}
