import { IUser } from "../../../types";

export interface IUpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface IUpdateProfileResponse {
  errors?: string;
  user?: IUser;
  message?: string;
}

export interface IDeleteResponse {
  success: boolean;
  user?: IUser;
  message?: string;
}
