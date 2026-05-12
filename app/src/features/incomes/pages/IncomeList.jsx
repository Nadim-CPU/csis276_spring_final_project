import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Alert, Box, Button, Card, IconButton, Snackbar, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useIncomes } from "../../../stores/hooks/useIncomes";


const IncomeList = () => {
    const { user } = useAuth();
    const { items: incomes, loadIncomes, deleteIncome } = useIncomes();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        loadIncomes(user.user_id);
    }, [user, loadIncomes]);

    const handleDelete = async (id) => {
        try {
            await deleteIncome(id);
        } catch (err) {
            setErrorMsg(err?.message || "Failed to delete income.");
        }
    }

    return (
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{
                    bgcolor: "seagreen",
                    color: "white", p: 3,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <TrendingUpIcon />
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Incomes
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate("/incomes/new")}
                        sx={{
                            bgcolor: "white", color: "seagreen",
                            textTransform: "none", fontWeight: "bold", borderRadius: 2,
                            "&:hover": { bgcolor: "lightgray" },
                        }}
                    >
                        + New Income
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Source</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Account</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {incomes.map(income => (
                                <TableRow key={income.income_id} hover>
                                    <TableCell>{income.income_source}</TableCell>
                                    <TableCell>${Number(income.income_amount).toLocaleString()}</TableCell>
                                    <TableCell>{income.category.category_name}</TableCell>
                                    <TableCell>{income.account.account_name}</TableCell>
                                    <TableCell>{new Date(income.income_date).toDateString()}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            component={Link}
                                            to={`/incomes/${income.income_id}/edit`}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(income.income_id)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <Snackbar
                open={Boolean(errorMsg)}
                autoHideDuration={5000}
                onClose={() => setErrorMsg("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="error" variant="filled" onClose={() => setErrorMsg("")}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Box>
    )
}
export default IncomeList;
