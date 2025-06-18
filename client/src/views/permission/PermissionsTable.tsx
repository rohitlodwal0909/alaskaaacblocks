import React, { useState } from 'react';
import {  Dropdown } from "flowbite-react";
import { Icon } from "@iconify/react";
import { IconDots} from "@tabler/icons-react";
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
// Define the type for a user and their permissions
interface UserPermission {
  id: string;
  name: string;
  isCurrentUser: boolean;
  create: boolean;
  query: boolean;
  resize: boolean;
  terminate: boolean;
}

const PermissionsTable: React.FC = () => {
  const [permissions, setPermissions] = useState<UserPermission[]>([
    {
      id: '1',
      name: 'William Ford',
      submodule:"Randall Boone",
      isCurrentUser: true,
      create: true,
      query: true,
      resize: true,
      terminate: true,
    },
    {
      id: '2',
      name: 'Betty Cooper',
       submodule:"Peter Horton",
      isCurrentUser: false,
      create: true,
      query: true,
      resize: false,
      terminate: false,
    },
    {
      id: '3',
      name: 'Peter Horton',
       submodule:"Betty Cooper",
      isCurrentUser: false,
      create: true,
      query: false,
      resize: true,
      terminate: false,
    },
    {
      id: '4',
      name: 'Randall Boone',
       submodule:"William Ford",
      isCurrentUser: false,
      create: false,
      query: true,
      resize: false,
      terminate: false,
    },
  ]);

  const handleToggleChange = (userId: string, permissionType: keyof Omit<UserPermission, 'id' | 'name' | 'isCurrentUser'>) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((user) =>
        user.id === userId ? { ...user, [permissionType]: !user[permissionType] } : user
      )
    );
  };

  const renderToggle = (userId: string, permissionType: keyof Omit<UserPermission, 'id' | 'name' | 'isCurrentUser'>, isChecked: boolean) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={isChecked}
        onChange={() => handleToggleChange(userId, permissionType)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <>
     <BreadcrumbComp    items={[{ title: "Permission", to: "/" }]}
        title="Permission"/>
    
    <div className="p-4 bg-white rounded-sm shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800"> Permissions</h2>
        <div>
   
          <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Save changes</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200  table table-hover">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
 Module              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sub Module
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
              Add
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
              View
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
               Edit
              </th>
               <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
Delete
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {permissions.map((user) => (
              <tr key={user.id} className='hover:bg-gray-50 transition duration-150 ease-in-out'>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* Placeholder for avatar - you'd likely use an image here */}
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm ${
                        user.name.includes('William') ? 'bg-purple-600' :
                        user.name.includes('Betty') ? 'bg-orange-400' :
                        user.name.includes('Peter') ? 'bg-purple-800' :
                        user.name.includes('Randall') ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4 text-sm font-medium text-gray-900">
                      {user.name} {user.isCurrentUser && <span className="text-gray-500 text-xs">(You)</span>}
                    </div>
                  </div>
                </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                 {user.submodule}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderToggle(user.id, 'create', user.create)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderToggle(user.id, 'query', user.query)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderToggle(user.id, 'resize', user.resize)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderToggle(user.id, 'terminate', user.terminate)}
                </td>
              
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default PermissionsTable;