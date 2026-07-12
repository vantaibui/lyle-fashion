export type CommunicationPreferences = {
  marketingEmail: boolean;
  marketingSms: boolean;
  newCollections: boolean;
  orderCommunication: true;
};

export type CustomerProfile = {
  email: string;
  fullName: string;
  id: string;
  phone: string;
  preferences: CommunicationPreferences;
};

export type CustomerAddress = {
  deliveryNote?: string;
  districtCode: string;
  districtName: string;
  fullName: string;
  id: string;
  isDefaultShipping: boolean;
  phone: string;
  provinceCode: string;
  provinceName: string;
  streetAddress: string;
  wardCode: string;
  wardName: string;
};
