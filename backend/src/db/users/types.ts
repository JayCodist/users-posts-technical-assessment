export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
}

export interface UserAddress {
  street: string;
  state: string;
  city: string;
  zipcode: string;
}

export type Pagination = {
  pageNumber: number;
  pageSize: number;
  totalUsers: number;
};
