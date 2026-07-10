export interface SubUserPermissions {
  tours: boolean;
  reservations: boolean;
  customers: boolean;
  reports: boolean;
}

export interface PartnerSubUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: SubUserPermissions;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface CreateSubUserInput {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: SubUserPermissions;
}

export interface UpdateSubUserInput {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  permissions: SubUserPermissions;
  status?: string;
}

export interface PartnerUsersProvider {
  list(context: PartnerUsersContext): Promise<PartnerSubUser[]>;
  create(context: PartnerUsersContext, input: CreateSubUserInput): Promise<PartnerSubUser>;
  update(context: PartnerUsersContext, input: UpdateSubUserInput): Promise<PartnerSubUser>;
  delete(context: PartnerUsersContext, id: string): Promise<void>;
}

export type PartnerUsersContext = {
  operatorType: 'tour';
  tourOperatorId: string;
  userId: string;
};
