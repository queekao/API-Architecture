interface TagProps {
  tagState: string;
  stateValue: string;
}

enum StatusColor {
  YELLOW = 'bg-[#FEF3C7] text-[#D8A863]',
  GREEN = 'bg-[#D0F2CF] text-[#6FD473]',
  RED = 'bg-[#F2CFCF] text-[#D46F6F]',
  GRAY = 'bg-neutral-100 text-gray-500',
}

interface StatusMapping {
  [key: string]: {color: StatusColor; text: string; value: string}[];
}

const statusMapping: StatusMapping = {
  publishStates: [
    {color: StatusColor.YELLOW, text: '草稿', value: 'draft'},
    {color: StatusColor.GREEN, text: '上架', value: 'published'},
    {color: StatusColor.RED, text: '下架', value: 'unpublished'},
  ],
  onlineStates: [
    {color: StatusColor.YELLOW, text: '草稿', value: 'draft'},
    {color: StatusColor.GREEN, text: '上線', value: 'online'},
    {color: StatusColor.RED, text: '下線', value: 'offline'},
  ],
};

function Tag({tagState, stateValue}: TagProps) {
  const matchedState = statusMapping[tagState] ? statusMapping[tagState].find((status: {value: string}) => status.value === stateValue) : null;
  const colorClasses = matchedState ? matchedState.color : StatusColor.GRAY;
  const text = matchedState ? matchedState.text : '未知';

  return <div className={`h-7 w-12 rounded-lg p-0.5 ${colorClasses}`}>{text}</div>;
}

export default Tag;
