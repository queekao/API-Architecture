import {cn} from '@/utils/index';

interface StepperProps {
  items: {key: string; value: string}[];
  currentStep: number;
}

function Stepper({items, currentStep}: StepperProps) {
  return (
    <ul className="flex space-x-2">
      {items.map((item, index) => {
        const isCurrent = index === currentStep - 1;
        const isLast = index === items.length - 1;
        return (
          <li key={item.key}>
            <div className="flex items-center space-x-2">
              <div
                className={cn('flex size-7 items-center justify-center rounded-full bg-gray-200', {
                  'bg-primary text-white': isCurrent,
                })}>
                {index + 1}
              </div>
              <div>{item.value}</div>
              {isLast ? null : <div className="h-px w-44 flex-1 bg-gray-200"></div>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default Stepper;
