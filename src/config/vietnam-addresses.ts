import type { VietnamProvince } from '@/modules/customer/contracts/address';

export const vietnamAddressOptions: VietnamProvince[] = [
  {
    code: 'hcm',
    districts: [
      {
        code: 'q1',
        name: 'Quận 1',
        wards: [
          { code: 'bn', name: 'Bến Nghé' },
          { code: 'bt', name: 'Bến Thành' },
        ],
      },
      {
        code: 'tpd',
        name: 'Thành phố Thủ Đức',
        wards: [
          { code: 'atd', name: 'An Thới Đông' },
          { code: 'thaodien', name: 'Thảo Điền' },
        ],
      },
    ],
    name: 'TP. Hồ Chí Minh',
  },
  {
    code: 'hn',
    districts: [
      {
        code: 'hk',
        name: 'Hoàn Kiếm',
        wards: [
          { code: 'hangbai', name: 'Hàng Bài' },
          { code: 'trangtien', name: 'Tràng Tiền' },
        ],
      },
      {
        code: 'cg',
        name: 'Cầu Giấy',
        wards: [
          { code: 'dichvong', name: 'Dịch Vọng' },
          { code: 'maidich', name: 'Mai Dịch' },
        ],
      },
    ],
    name: 'Hà Nội',
  },
  {
    code: 'dn',
    districts: [
      {
        code: 'hc',
        name: 'Hải Châu',
        wards: [
          { code: 'thachthang', name: 'Thạch Thang' },
          { code: 'hoa-thuan', name: 'Hòa Thuận' },
        ],
      },
    ],
    name: 'Đà Nẵng',
  },
];
