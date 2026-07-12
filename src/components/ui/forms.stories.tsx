import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from './checkbox';
import { Combobox } from './combobox';
import { FormField, FormMessage } from './form-field';
import { Input } from './input';
import { Radio } from './radio';
import { Select } from './select';
import { Switch } from './switch';
import { Textarea } from './textarea';

function FormsShowcase({ disabled = false, error = false, long = false }) {
  const messageId = 'full-name-message';
  return (
    <form
      className="grid w-[min(32rem,calc(100vw-2rem))] gap-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <FormField htmlFor="full-name" label="Họ và tên người nhận" required>
        <Input
          aria-describedby={messageId}
          autoComplete="name"
          disabled={disabled}
          id="full-name"
          isInvalid={error}
          name="fullName"
          placeholder="Ví dụ: Nguyễn Minh Anh…"
        />
        <FormMessage id={messageId} tone={error ? 'error' : 'help'}>
          {error
            ? 'Nhập họ và tên để tiếp tục.'
            : long
              ? 'Tên này sẽ được dùng để liên hệ khi giao những sản phẩm thời trang thủ công có mô tả dài.'
              : 'Dùng tên trên giấy tờ nhận hàng.'}
        </FormMessage>
      </FormField>
      <FormField htmlFor="province" label="Tỉnh hoặc thành phố" required>
        <Select
          autoComplete="address-level1"
          disabled={disabled}
          id="province"
          name="province"
        >
          <option value="">Chọn tỉnh hoặc thành phố…</option>
          <option value="hcm">Thành phố Hồ Chí Minh</option>
        </Select>
      </FormField>
      <FormField htmlFor="note" label="Ghi chú giao hàng">
        <Textarea
          disabled={disabled}
          id="note"
          name="note"
          placeholder="Ví dụ: Gọi trước khi giao…"
        />
      </FormField>
      <Combobox
        disabled={disabled}
        errorMessage={error ? 'Chọn một chất liệu.' : undefined}
        label="Chất liệu"
        name="material"
        onChange={() => undefined}
        options={[
          { label: 'Linen', value: 'linen' },
          { label: 'Lyocell', value: 'lyocell' },
          { label: 'Tencel', value: 'tencel' },
        ]}
      />
      <fieldset>
        <legend className="mb-2 text-sm font-medium">
          Phương thức liên hệ
        </legend>
        <Radio label="Điện thoại" name="contact" value="phone" />
        <Radio label="Email" name="contact" value="email" />
      </fieldset>
      <Checkbox label="Tôi đồng ý nhận thông tin giao dịch cần thiết" />
      <Switch label="Nhận thông tin bộ sưu tập mới" />
    </form>
  );
}

const meta = {
  title: 'UI/Forms/Foundation',
  component: FormsShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof FormsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = { args: { error: true } };
export const Disabled: Story = { args: { disabled: true } };
export const LongVietnameseText: Story = { args: { long: true } };
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
