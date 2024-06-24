import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner"; // Assuming this is a custom toast library
import { url } from "../../config";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react"; // Adjust this import to match your UI framework
import { Eye, Trash } from "lucide-react"; // Assuming these are icons from a specific icon library
import { useNavigate } from "react-router-dom";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/users`, {
          withCredentials: true,
        });

        setUsers(response.data.users);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    // Modify this based on your route structure for editing users
    navigate(`/admin/edit-user/${userId}`);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState(null);

  const handleModalOpen = (userId) => {
    onOpen();
    setDeleteId(userId);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${url}/api/v1/users/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to delete user");
      onClose();
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUserPage = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center my-40 text-2xl">Loading...</div>;
  }

  return (
    <div className="p-6 h-fit w-full">
      <h1 className="text-xl font-bold mb-4 text-gray-700">Users</h1>
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="min-w-full bg-white">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Verification</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {currentUserPage.map((user, index) => (
                <TableRow
                  key={user._id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <TableCell className="py-1.5 px-4 border-b border-gray-200">
                    {indexOfFirstUser + index + 1}
                  </TableCell>
                  <TableCell className="py-1.5 px-4 border-b border-gray-200">
                    {user.username}
                  </TableCell>
                  <TableCell className="py-1.5 px-4 border-b border-gray-200">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-1.5 px-4 border-b border-gray-200">
                    {user.isVerified ? (
                      <Chip variant="flat" color="success">
                        Verified
                      </Chip>
                    ) : (
                      <Chip variant="flat" color="danger">
                        Not verified
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-x-3">
                      <Eye
                        size={18}
                        color="#3b82f6"
                        onClick={() => handleEdit(user._id)}
                        className="cursor-pointer"
                      />
                      <Trash
                        color="#ef4444"
                        size={18}
                        onClick={() => handleModalOpen(user._id)}
                        className="cursor-pointer"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center my-40 text-2xl text-red-500 font-semibold">
          No users found!
        </div>
      )}
      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={users.length}
        paginate={paginate}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Are you sure?
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this user?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={onClose}>
                Close
              </Button>
              <Button color="primary" onClick={() => handleDelete(deleteId)}>
                Delete
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};

const Pagination = ({ usersPerPage, totalUsers, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="flex justify-center">
        {pageNumbers.map((number) => (
          <li key={number} className="mx-1">
            <Button
              onClick={() => paginate(number)}
              variant="flat"
              color="primary"
              size="sm"
            >
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminUsersPage;
