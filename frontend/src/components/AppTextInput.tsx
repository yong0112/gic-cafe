import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { Form, Input } from 'antd';

interface AppTextInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  error?: FieldError;
}

export default function AppTextInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  error,
}: AppTextInputProps<T>) {
  return (
    <Form.Item
      label={label}
      validateStatus={error ? 'error' : ''}
      help={error?.message}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input {...field} placeholder={placeholder} />
        )}
      />
    </Form.Item>
  );
}
