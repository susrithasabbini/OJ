import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
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
} from "@nextui-org/react";
import { Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/problems`, {
          withCredentials: true,
        });
        setProblems(response.data.problems);
      } catch (error) {
        toast.error("Failed to fetch problems");
      }
      setLoading(false);
    };

    fetchProblems();
  }, []);

  const handleEdit = (slug) => {
    navigate(`/admin/edit-problem/${slug}/description`);
  };

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState(null);

  const handleModalOpen = async (id) => {
    onOpen();
    setDeleteId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/v1/problems/${id}`, {
        withCredentials: true,
      });
      setProblems(problems.filter((problem) => problem._id !== id));
      toast.success("Problem deleted successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to delete problem");
      onClose();
    }
  };

  // Get current problems
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center my-40 text-2xl">Loading...</div>;
  }

  return (
    <div className="p-6 h-fit w-full">
      <h1 className="text-xl font-bold mb-4 text-gray-700">Problems</h1>
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Difficulty</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {currentProblems.map((problem, index) => (
              <TableRow
                key={problem._id}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <TableCell className="py-1.5 px-4 border-b border-gray-200">
                  {indexOfFirstProblem + index + 1}
                </TableCell>
                <TableCell className="py-1.5 px-4 border-b border-gray-200">
                  {problem.title}
                </TableCell>
                <TableCell className="py-1.5 px-4 border-b border-gray-200">
                  <Chip
                    variant="flat"
                    color={
                      problem.difficulty === "Easy"
                        ? "success"
                        : problem.difficulty === "Medium"
                        ? "warning"
                        : problem.difficulty === "Hard"
                        ? "danger"
                        : "default"
                    }
                  >
                    {problem.difficulty}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-x-3">
                    <Eye
                      size={18}
                      color="#3b82f6"
                      onClick={() => handleEdit(problem.slug)}
                      className="cursor-pointer"
                    />
                    <Trash
                      color="#ef4444"
                      size={18}
                      onClick={() => {
                        handleModalOpen(problem._id);
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        problemsPerPage={problemsPerPage}
        totalProblems={problems.length}
        paginate={paginate}
      />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Are you sure?
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this problem?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={() => handleDelete(deleteId)}>
                Delete
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};

const Pagination = ({ problemsPerPage, totalProblems, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProblems / problemsPerPage); i++) {
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

export default AdminProblemsPage;
