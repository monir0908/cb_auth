import { ApproveStatusEnum } from 'src/users/enum/user.enum';

export interface IUser {
  username: string;
  first_name: string;
  last_name: string;
  profile_pic_url?: string;
  password: string;
  is_active: boolean;
  is_verified: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  email: string;
}

export interface IUserUpdate {
  first_name?: string;
  last_name?: string;
  profile_pic_url?: string;
  is_active?: boolean;
  email?: string;
}

export interface IUserInformation {
  username: string;
  company_name: string;
  address: string;
  bin?: string;
  bin_no?: string;
  tin?: string;
  tin_no?: string;
  trade_licence?: string;
  trade_licence_no?: string;
  approved: ApproveStatusEnum;
}

export interface IAccessToken {
  username: string;
  first_name: string;
  last_name: string;
  exp: number;
  email: string;
  token_type: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface IAccessTokenObj {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface IRefreshToken {
  username: string;
  exp: number;
  token_type: string;
}

export interface IRefreshTokenObj {
  username: string;
}

export interface IPagination {
  username?: string;
  first_name?: string;
  email?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
  count?: number;
  next?: number;
  previous?: number;
}

export interface IPaginationMetaInfo {
  page_size: number;
  count: number;
  page: number;
  next: number | null;
  previous: number | null;
}
