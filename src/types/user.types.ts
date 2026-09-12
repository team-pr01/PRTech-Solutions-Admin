export type TUser = {
  userId?: string;
  _id: string;
  avatar?: string;
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  gender?: string;
  pinCode?: string;
  country?: string;
  city?: string;
  address?: string;
  pagesAssigned: string[];
  jobRole: string;
  whatsappNumber?: string;
  bank: {
    bankName: string;
    bankAccountNumber: string;
    ifscCode: string;
    bankPhoneNumber?: string;
  },
  panCardFrontImage?: string;
  panCardBackImage?: string;
  password: string;
  role: "user" | "admin" | "staff" | "client";
  isDeleted?: boolean;
  isSuspended?: boolean;
  createdAt: Date;
  updatedAt: Date;
  passwordChangedAt?: Date;
};