import {useFormContext} from 'react-hook-form';

import {cn} from '@/utils/index';

interface InputProps {
  name: string;
  type: 'text' | 'password' | 'email';
  placeholder?: string;
  label: string;
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  size?: 'sm' | 'md';
}

function Input({name, type, placeholder, label, required, pattern, minLength = 1, maxLength = 1000, size = 'md'}: InputProps) {
  const {
    register,
    formState: {errors},
  } = useFormContext();
  return (
    <div>
      <label htmlFor={name} className="relative flex flex-col">
        <span className="mb-1 block">{label}</span>
        <input
          type={type}
          placeholder={placeholder ? placeholder : `請輸入${label}`}
          id={name}
          className={cn(
            'w-full rounded-lg px-3 outline outline-1 outline-gray-200 placeholder:text-sm',
            {'py-1': size === 'sm', 'py-2': size === 'md'},
            {
              'outline-danger focus:ring-danger focus:outline-none focus:ring-1': !!errors[name]?.message,
            },
          )}
          {...register(name, {
            required: required ? `${label}為必填` : false,
            pattern: pattern ? {value: pattern, message: label} : undefined,
            minLength: {value: minLength, message: `長度不可小於於${minLength}個字元`},
            maxLength: {value: maxLength, message: `長度不可大於${maxLength}個字元`},
          })}
        />
        {errors[name]?.message && <span className="text-danger absolute bottom-[-16px] text-xs">{String(errors[name]?.message)}</span>}
      </label>
    </div>
  );
}

export default Input;
