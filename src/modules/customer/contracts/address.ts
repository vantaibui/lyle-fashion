export type VietnamProvince = {
  code: string;
  districts: VietnamDistrict[];
  name: string;
};

export type VietnamDistrict = {
  code: string;
  name: string;
  wards: VietnamWard[];
};

export type VietnamWard = {
  code: string;
  name: string;
};

export type ShippingAddress = {
  districtCode: string;
  districtName: string;
  email: string;
  fullName: string;
  phone: string;
  provinceCode: string;
  provinceName: string;
  streetAddress: string;
  wardCode: string;
  wardName: string;
};
