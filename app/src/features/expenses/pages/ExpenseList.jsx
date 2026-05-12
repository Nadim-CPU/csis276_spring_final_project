import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Alert, Box, Button, Card, IconButton, Snackbar, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useExpenses } from "../../../stores/hooks/useExpenses";


const ExpenseList = () => {
    const { user } = useAuth();
    const { items: expenses, loadExpenses, deleteExpense } = useExpenses();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        loadExpenses(user.user_id);
    }, [user, loadExpenses]);

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
        } catch (err) {
            setErrorMsg(err?.message || "Failed to delete expense.");
        }
    }

    return (
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{
                    bgcolor: "indianred",
                    color: "white", p: 3,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <TrendingDownIcon />
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Expenses
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate("/expenses/new")}
                        sx={{
                            bgcolor: "white", color: "indianred",
                            textTransform: "none", fontWeight: "bold", borderRadius: 2,
                            "&:hover": { bgcolor: "lightgray" },
                        }}
                    >
                        + New Expense
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
                            {expenses.map(expense => (
                                <TableRow key={expense.expense_id} hover>
                                    <TableCell>{expense.expense_source}</TableCell>
                                    <TableCell>${Number(expense.expense_amount).toLocaleString()}</TableCell>
                                    <TableCell>{expense.category.category_name}</TableCell>
                                    <TableCell>{expense.account.account_name}</TableCell>
                                    <TableCell>{new Date(expense.expense_date).toDateString()}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            component={Link}
                                            to={`/expenses/${expense.expense_id}/edit`}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(expense.expense_id)}
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
export default ExpenseList;
