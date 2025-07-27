import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const SideBar = () => {
    const pathname = usePathname();
    const menuItems = [
        { name: 'Tambah Produk', path: '/kantek', icon: assets.add_icon },
        { name: 'Daftar Produk', path: '/kantek/product-list', icon: assets.product_list_icon },
        { name: 'Pesanan', path: '/kantek/orders', icon: assets.order_icon },
    ];

    return (
        <div className='md:w-64 w-16 border-r border-gray-200 dark:border-gray-700 min-h-screen text-base py-2 flex flex-col sticky top-0 h-screen bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/20'>
            {menuItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            className={
                                `flex items-center py-3 px-4 gap-3 transition-all duration-300 ease-in-out cursor-pointer group ${
                                    isActive
                                        ? "border-r-4 md:border-r-[6px] bg-[#479c26]/10 border-[#479c26] dark:bg-[#479c26]/20 dark:border-[#479c26] text-[#479c26] dark:text-[#479c26]"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                }`
                            }
                        >
                            <Image
                                src={item.icon}
                                alt={`${item.name.toLowerCase()}_icon`}
                                className={`w-7 h-7 transition-all duration-300 filter ${
                                    isActive 
                                        ? 'brightness-0 saturate-100' 
                                        : 'brightness-0 saturate-100 opacity-70 group-hover:opacity-100'
                                } ${
                                    isActive 
                                        ? 'dark:brightness-0 dark:invert dark:sepia dark:saturate-[10000%] dark:hue-rotate-[60deg]' 
                                        : 'dark:brightness-0 dark:invert dark:opacity-70 dark:group-hover:opacity-100'
                                }`}
                                style={{
                                    filter: isActive 
                                        ? 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(100deg) brightness(97%) contrast(97%)'
                                        : undefined
                                }}
                            />
                            <p className={`md:block hidden text-center font-medium transition-all duration-300 ease-in-out ${
                                isActive 
                                    ? 'text-[#479c26] dark:text-[#479c26] font-semibold' 
                                    : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                            }`}>
                                {item.name}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
