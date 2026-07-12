export type CustomerSession = {
  customerId: string;
  expiresAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
  returnTo?: string;
};
