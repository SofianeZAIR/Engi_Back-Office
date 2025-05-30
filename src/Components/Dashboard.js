import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableContainer,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

import { useNavigate } from "react-router-dom";
import { exportToCSV } from "../utils/exportToCSV";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [sortByDate, setSortByDate] = useState(null);
  const [sortByStatus, setSortByStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/leads?page=${page}`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setTotalItems(data?.totalItems);
          setUsers(data?.leads || []);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
      }
    };

    fetchUsers();
  }, [navigate, page]);

  const toggleSortByDate = () => {
    setSortByDate((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
  };

  const toggleSortByStatus = () => {
    setSortByStatus((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/leads/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  const sortedUsers = useMemo(() => {
    let sorted = [...users];

    if (sortByDate) {
      sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortByDate === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    const statusOrder = {
      valide: 0,
      en_attente: 1,
      invalide: 2,
    };

    if (sortByStatus) {
      sorted.sort((a, b) => {
        const statusA = a.status || "";
        const statusB = b.status || "";

        const orderA = statusOrder[statusA] ?? 99;
        const orderB = statusOrder[statusB] ?? 99;

        return sortByStatus === "asc" ? orderA - orderB : orderB - orderA;
      });
    }

    return sorted;
  }, [users, sortByDate, sortByStatus]);

  const handleExportCSV = () => {
    const validatedUsers = users.filter((user) => user.status === "valide");

    if (validatedUsers.length === 0) {
      alert("Aucun lead valide à exporter.");
      return;
    } else {
      exportToCSV(validatedUsers);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 15 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Leads
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleExportCSV}
          sx={{
            backgroundColor: "#00BFFF",
            color: "white",
            "&:hover": { backgroundColor: "#009ACD" },
          }}
        >
          Exporter CSV
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          border: "3px solid #00BFFF",
          borderRadius: 2,
          minWidth: "150Opx",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#E0F7FA" }}>
              <TableCell
                onClick={toggleSortByDate}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Date</Typography>
                {sortByDate === "asc" ? (
                  <ArrowDropUpIcon fontSize="small" />
                ) : sortByDate === "desc" ? (
                  <ArrowDropDownIcon fontSize="small" />
                ) : (
                  <UnfoldMoreIcon fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                <Typography variant="h6">Nom</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Email</Typography>
              </TableCell>
              <TableCell
                onClick={toggleSortByStatus}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Status</Typography>
                {sortByStatus === "asc" ? (
                  <ArrowDropUpIcon fontSize="small" />
                ) : sortByStatus === "desc" ? (
                  <ArrowDropDownIcon fontSize="small" />
                ) : (
                  <UnfoldMoreIcon fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                <Typography variant="h6">Facture</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedUsers.map((user, index) => {
              const date = new Date(user?.createdAt).toLocaleDateString(
                "fr-FR",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }
              );

              return (
                <TableRow
                  key={user?.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#F9F9F9" : "#FFFFFF",
                    "&:hover": { backgroundColor: "#f0f8ff" },
                  }}
                >
                  <TableCell>
                    {" "}
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {user?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select
                        value={user?.status || ""}
                        onChange={(e) =>
                          handleStatusChange(user?.id, e.target.value)
                        }
                        sx={{
                          width: "100%",
                          "& .MuiSelect-select": {
                            padding: "8px 12px",
                          },
                          color:
                            user?.status === "valide"
                              ? "green"
                              : user?.status === "en_attente"
                              ? "orange"
                              : "red",
                        }}
                      >
                        <MenuItem value="en_attente" sx={{ color: "orange" }}>
                          En attente
                        </MenuItem>
                        <MenuItem value="valide" sx={{ color: "green" }}>
                          Valide
                        </MenuItem>
                        <MenuItem value="invalide" sx={{ color: "red" }}>
                          Invalide
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => window.open(user?.facture, "_blank")}
                    >
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {totalItems > 0 && (
        <Stack spacing={2} alignItems="flex-end" sx={{ mt: 3 }}>
          <Pagination
            count={Math.ceil(totalItems / 10)}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="#000000"
            sx={{
              "& .Mui-selected": {
                backgroundColor: "#00BFFF",
                color: "#000000",
              },
            }}
          />
        </Stack>
      )}
    </Container>
  );
}
