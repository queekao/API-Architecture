import {useFormContext} from 'react-hook-form';

import {cn} from '@/utils/index';
import {SvgIcon} from '@/atoms/index';

interface SelectProps {
  name: string;
  label: string;
  size?: 'sm' | 'md';
  required?: boolean;
  options: {key: string; value: string}[];
}

function Select({name, label, size = 'sm', required, options}: SelectProps) {
  const {
    register,
    formState: {errors},
  } = useFormContext();
  return (
    <div className="relative">
      <label htmlFor={name} className="mb-1 block">
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          className={cn(
            'w-full appearance-none rounded-lg pe-6 ps-3 outline outline-1 outline-gray-200',
            {'py-1': size === 'sm', 'py-2': size === 'md'},
            {
              'outline-danger focus:ring-danger focus:outline-none focus:ring-1': !!errors[name]?.message,
            },
          )}
          {...register(name, {
            required: required ? `${label}為必填` : false,
          })}>
          <option value="" disabled>{`請選擇${label}`}</option>
          {options.map((option) => (
            <option key={option.key} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>

        <SvgIcon
          iconName="CaretDown"
          weight="fill"
          className={cn('absolute right-1 top-1/2 -translate-y-1/2', {
            'text-danger': !!errors[name]?.message,
          })}
        />
      </div>
      {errors[name]?.message && <span className="text-danger absolute bottom-[-16px] text-xs">{String(errors[name]?.message)}</span>}
    </div>
  );
}

export default Select;
