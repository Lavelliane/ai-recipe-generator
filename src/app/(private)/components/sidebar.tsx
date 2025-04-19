'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  HeartIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Meal Plans',
      href: '/meal-plans',
      icon: DocumentTextIcon,
    },
    {
      name: 'Favorite',
      href: '/favorite',
      icon: HeartIcon,
    },
    {
      name: 'Community',
      href: '/community',
      icon: UserGroupIcon,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <Link href="/" className="text-xl font-semibold text-gray-900">
          RecipeCraft
        </Link>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-primary-dark bg-primary-light/30' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <item.icon 
                    className={`h-5 w-5 mr-3 ${
                      isActive ? 'text-primary-dark' : 'text-gray-400'
                    }`} 
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}