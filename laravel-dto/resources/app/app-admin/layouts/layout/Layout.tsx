import {useState} from 'react';
import {Outlet} from 'react-router-dom';

import {cn} from '@/utils/index';
import {SvgIcon} from '@/atoms/index';

function Layout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const menuList = [
    {
      key: 'couponList',
      title: '優惠券列表',
    },
    {
      key: 'dataManagement',
      title: '數據後台',
      children: [
        {
          key: 'couponData',
          title: '優惠券數據',
        },
        {
          key: 'memberClicks',
          title: '會員中心點擊數',
        },
        {
          key: 'giftRedemptionStatus',
          title: '好禮中心兌換情況',
        },
      ],
    },
    {
      key: 'memberData',
      title: '會員資料查詢',
    },
    {
      key: 'taskManagement',
      title: '任務管理',
    },
    {
      key: 'giftCenterManagement',
      title: '好禮中心管理',
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn('z-200 fixed inset-y-0 hidden h-screen w-64 bg-cBlack py-4 md:block md:translate-x-0', {
          'hidden': !isSidebarVisible,
          'block translate-x-0': isSidebarVisible,
        })}>
        {/* Logo */}
        <div className="m-auto mt-4 h-9 w-40">
          <img src={window.assetUrl('/storage/images/logo.png')} alt="" />
        </div>

        {/* Menu List */}
        <nav className="mt-6 flex w-full flex-col flex-wrap py-6 ps-6">
          <ul className="space-y-1.5">
            {menuList.map((menu) => {
              return (
                <li key={menu.key}>
                  <div
                    className={cn('hover:text-primary cursor-pointer px-4 py-2 text-gray-500', {
                      'bg-primary relative text-white before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-white before:content-[""] hover:text-white':
                        menu.key === 'dataManagement',
                    })}>
                    {menu.title}
                  </div>

                  {/* 子菜單 */}
                  {menu.children && (
                    <div className="mt-2">
                      <ul className="space-y-1.5">
                        {menu?.children?.map((child) => {
                          return (
                            <li
                              key={child.key}
                              className={cn(
                                'hover:text-primary hover:before:bg-primary relative ml-6 cursor-pointer px-4 py-2 text-gray-500 before:absolute before:left-0 before:top-1/2 before:size-1 before:-translate-y-1/2 before:transform before:rounded-full before:bg-gray-500',
                                {
                                  'text-white before:bg-white hover:text-white hover:before:bg-white': child.key === 'couponData',
                                },
                              )}>
                              {child.title}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="hover:text-primary fixed bottom-0 left-1/2 flex w-56 -translate-x-1/2 cursor-pointer items-center justify-center gap-2 border-t border-gray-200 p-4 text-white md:hidden">
          <SvgIcon iconName="SignOut" size={20} />
          <span>登出</span>
        </div>
      </div>

      <div className="flex h-screen flex-col p-4 md:ml-64">
        {/* Header */}
        <header className="flex justify-between border-b border-gray-200 p-2">
          {/* Breadcrumbs */}
          <div className="text-gray-500">優惠券列表</div>
          {/* Logout */}
          <div className="hover:text-primary hidden cursor-pointer items-center gap-2 text-gray-500 md:flex">
            <SvgIcon iconName="SignOut" size={20} />
            <span>登出</span>
          </div>
          {/* Hamburger */}
          <button className="hover:border-primary hover:text-primary rounded-lg border border-gray-200 p-1 md:hidden" onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
            <SvgIcon iconName="List" size={20} />
          </button>
        </header>
        {/* Content */}
        <div className="flex-1 p-2">
          <Outlet />
        </div>
      </div>
      {/* Mask */}
      <div
        className={cn('z-100 bg-mask fixed inset-0 md:hidden', {
          'hidden': !isSidebarVisible,
          'block': isSidebarVisible,
        })}
        onClick={() => setIsSidebarVisible(false)}
      />
    </>
  );
}

export default Layout;
