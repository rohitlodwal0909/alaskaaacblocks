import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

import { AppDispatch } from "src/store";
import {
  deleteUser,
  GetUsermodule,
} from "src/features/usermanagment/UsermanagmentSlice";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";

import Deleteusermodal from "./Deleteusermodal";
import Editusermodal from "./Editusermodal";

import s1 from "../../../src/assets/images/profile/user-1.jpg";
import noData from "../../../src/assets/images/svgs/no-data.webp";

export interface PaginationTableType {
  id?: string;
  avatar?: string | any;
  username?: string;
  email?: string;
  status?: any;
  password?: string;
  role_id?: any;
  code?: string;
}

function PaginationTable() {
  const users = useSelector((state: any) => state.usermanagement.userdata);
  const dispatch = useDispatch<AppDispatch>();

  const [data, setData] = useState<PaginationTableType[]>(users);
  const [selectedRow, setSelectedRow] = useState<PaginationTableType | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  let modalPlacement = "center";

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    setEditModal(true);
  };

  const handleDelete = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    setIsOpen(true);
  };

  const handleConfirmDelete = async (
    userToDelete: PaginationTableType | null
  ) => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteUser(userToDelete?.id)).unwrap();
      const updatedData = data.filter((user) => user.id !== userToDelete.id);
      setData(updatedData);
      toast.success("User deleted successfully");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) {
        toast.error("User not found.");
      } else if (error?.response?.status === 500) {
        toast.error("Server error. Try again later.");
      } else {
        toast.error("Failed to delete user.");
      }
    }
  };

  const handleupdateuser = async () => {
    // placeholder if needed later
  };

  useEffect(() => {
    setData(users);
  }, [users]);

  useEffect(() => {
    const fetchUserModules = async () => {
      try {
        await dispatch(GetUsermodule()).unwrap();
      } catch (error) {
        toast.error("Failed to fetch user modules");
        console.error("Error fetching user modules:", error);
      }
    };

    fetchUserModules();
  }, [dispatch]);

  return (
    <>
      <div className="border rounded-md border-ld overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">
                  User
                </th>
                <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">
                  Status
                </th>
                <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">
                  Role
                </th>
                <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">
                  Code
                </th>
                <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((user, index) => (
                  <tr key={index} className="bg-white dark:bg-gray-900">
                    <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                      <div className="flex gap-3 items-center">
                        <img
                          src={s1}
                          width={50}
                          height={50}
                          alt="icon"
                          className="h-10 w-10 rounded-md"
                        />
                        <div className="truncate line-clamp-2 max-w-56">
                          <h6 className="text-base">{user.username}</h6>
                          <p className="text-sm text-darklink dark:text-bodytext">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                      <Badge color={`lightprimary`} className="capitalize">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                      {user.role_id === 1
                        ? "Manager"
                        : user.role_id === 2
                        ? "Employee"
                        : user.role_id === 3
                        ? "Guard"
                        : "Unknown"}
                    </td>
                    <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                      {user.code ?? "N/A"}
                    </td>
                    <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                      <div className="flex justify-start gap-2">
                        <Tooltip content="Edit" placement="bottom">
                          <Button
                            size="sm"
                            className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                            onClick={() => handleEdit(user)}
                          >
                            <Icon icon="solar:pen-outline" height={18} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete" placement="bottom">
                          <Button
                            size="sm"
                            color="lighterror"
                            className="p-0"
                            onClick={() => handleDelete(user)}
                          >
                            <Icon
                              icon="solar:trash-bin-minimalistic-outline"
                              height={18}
                            />
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 px-4">
                    <div className="flex flex-col items-center">
                      <img
                        src={noData}
                        alt="No data"
                        height={100}
                        width={100}
                        className="mb-4"
                      />
                      <p className="text-gray-500 dark:text-gray-400">
                        No data available
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <Button
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Deleteusermodal
        handleConfirmDelete={handleConfirmDelete}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedUser={selectedRow}
      />
      <Editusermodal
        setEditModal={setEditModal}
        editModal={editModal}
        selectedUser={selectedRow}
        modalPlacement={modalPlacement}
        onUpdateUser={handleupdateuser}
      />
    </>
  );
}

export default PaginationTable;
