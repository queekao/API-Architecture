import {cn} from '@/utils/index';

interface TabsProps {
  options: {key: string; value: string}[];
  selectedTabs: string;
  setSelectedTabs: (key: string) => void;
}

function Tabs({options, selectedTabs, setSelectedTabs}: TabsProps) {
  return (
    <nav className="inline-flex space-x-4 border-b border-gray-200">
      {options.map((option) => {
        return (
          <button
            key={option.key}
            type="button"
            className={cn('hover:text-primary inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 border-transparent px-2 pb-2 pt-4 text-gray-500', {
              'text-primary border-primary': option.key === selectedTabs,
            })}
            onClick={() => setSelectedTabs(option.key)}>
            {option.value}
          </button>
        );
      })}
    </nav>
  );
}

export default Tabs;
