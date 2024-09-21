import {useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';

import {Button, Input, Select, SvgIcon, Tag} from '@/atoms/index';
import {Tabs, Stepper} from '@/components/index';
import {cn} from '@/utils/index';

// TODO: 路由設定後，再繼續完成sidebar功能

const selectOptions = [
  {key: '1', value: 'Option 1'},
  {key: '2', value: 'Option 2'},
  {key: '3', value: 'Option 3'},
];

const tabs = [
  {key: '1', value: '點數歷程'},
  {key: '2', value: '發票登錄'},
  {key: '3', value: '優惠票卷'},
  {key: '4', value: '活動票卷'},
  {key: '5', value: '好禮兌換'},
];

const steppers = [
  {key: '1', value: '基本設定'},
  {key: '2', value: 'Flex msg'},
];

function ExamplePage() {
  const [selectedTabs, setSelectedTabs] = useState(tabs[0].key);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(true);

  const methods = useForm({
    mode: 'onChange',
  });

  const searchMethods = useForm({
    mode: 'onChange',
  });

  const handleTabContent = () => {
    switch (selectedTabs) {
      case '1':
        return '點數歷程';
      case '2':
        return '發票登錄';
      case '3':
        return '優惠票卷';
      case '4':
        return '活動票卷';
      case '5':
        return '好禮兌換';
      default:
        return '點數歷程';
    }
  };

  const handleStepperContent = () => {
    switch (currentStep) {
      case 1:
        return '基本設定';
      case 2:
        return 'Flex msg';
      default:
        return '基本設定';
    }
  };

  const onSubmit = () => {};

  return (
    <div className="space-y-4">
      {/* Buttons */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex space-x-2">
            <Button size="sm" color="primary" style="solid" text="sm" icon="Plus" />
            <Button size="sm" color="primary" style="outline" text="sm" />
          </div>
          <div className="space-x-2">
            <Button size="md" color="primary" style="solid" text="md" />
            <Button size="md" color="primary" style="outline" text="md" />
          </div>
        </div>
        <Button size="md" color="primary" style="solid" text="md" isFull />
      </div>
      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex items-end gap-4">
            <Input name="input" type="text" label="Input" size="sm" required />
            <Select name="select" label="Select" options={selectOptions} required />
            <Button size="sm" color="primary" style="solid" text="送出" type="submit" />
          </div>
        </form>
      </FormProvider>
      {/* Tabs */}
      <Tabs options={tabs} selectedTabs={selectedTabs} setSelectedTabs={setSelectedTabs} />
      <div>{handleTabContent()}</div>
      {/* Stepper */}
      <div className="space-y-4">
        <Stepper items={steppers} currentStep={currentStep} />
        <div>{handleStepperContent()}</div>
        <div className="flex gap-2">
          <Button size="sm" color="primary" style="outline" text="返回" onClick={() => setCurrentStep((pre) => pre - 1)} />
          <Button size="sm" color="primary" style="solid" text="下一步" onClick={() => setCurrentStep((pre) => pre + 1)} />
        </div>
      </div>
      {/* Search Area */}
      <div className="inline-flex rounded-lg p-4 shadow">
        <FormProvider {...searchMethods}>
          <form onSubmit={searchMethods.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-end gap-4">
              <Input name="1" type="text" label="UID" size="sm" />
              <Input name="2" type="text" label="姓" size="sm" />
              <Input name="3" type="text" label="名" size="sm" />
              <Select name="4" label="城市" options={selectOptions} />
              <button type="button" className="rounded-lg bg-gray-200 p-2 hover:text-primary" onClick={() => setIsSearchCollapsed(!isSearchCollapsed)}>
                <SvgIcon iconName="CaretDoubleDown" className={cn({'rotate-180': isSearchCollapsed})} />
              </button>
              <Button size="sm" color="primary" style="solid" text="搜尋" type="submit" />
            </div>

            <div
              className={cn('flex gap-4', {
                'hidden': !isSearchCollapsed,
              })}>
              <Input name="5" type="text" label="點數" size="sm" />
              <Input name="6" type="text" label="Email" size="sm" />
              <Input name="7" type="text" label="手機號碼" size="sm" />
              <Input name="7" type="text" label="註冊時間" size="sm" />
            </div>
          </form>
        </FormProvider>
      </div>
      {/* Tables */}
      <div className="overflow-hidden rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 bg-neutral-100 px-6 py-3 text-center font-medium uppercase text-gray-500">
                  優惠券ID
                </th>
                <th className="bg-neutral-100 px-6 py-2 text-center font-medium uppercase text-gray-500">類型</th>
                <th className="bg-neutral-100 px-6 py-2 text-center font-medium uppercase text-gray-500">標題</th>
                <th className="bg-neutral-100 px-6 py-2 text-center font-medium uppercase text-gray-500">發放時間</th>
                <th className="bg-neutral-100 px-6 py-2 text-center font-medium uppercase text-gray-500">兌換期限</th>
                <th className="bg-neutral-100 px-6 py-2 text-center font-medium uppercase text-gray-500">已使用數量</th>
                <th className="bg-neutral-100 px-6 py-2 text-start font-medium uppercase text-gray-500">狀態</th>
                <th className="bg-neutral-100 px-6 py-2 text-center font-medium uppercase text-gray-500">編輯</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="sticky left-0 bg-white px-4 py-3 text-center">00002123213</td>
                <td className="px-4 py-3 text-center">折價券</td>
                <td className="px-4 py-3 text-center">9折卷</td>
                <td className="px-4 py-3 text-center">2024.06.25 18:00</td>
                <td className="px-4 py-3 text-center">2024.06.25 ~ 2024.12.25</td>
                <td className="px-4 py-3 text-center">200</td>
                <td className="flex items-center justify-center gap-2 px-4 py-3 text-center">
                  <Tag tagState="publishStates" stateValue="draft" />
                  <SvgIcon iconName="CaretDown" className="cursor-pointer" />
                </td>
                <td className="px-4 py-3 text-center">編輯</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-full border-t border-gray-200 px-4 py-3">Pagination</div>
      </div>
    </div>
  );
}

export default ExamplePage;
