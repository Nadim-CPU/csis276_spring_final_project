import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Alert, Box, Button, Card, CardContent, FormControl, Grid, InputLabel,
    MenuItem, Select, TextField, Typography,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { getExpense } from "../services/expense.service";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useExpenses } from "../../../stores/hooks/useExpenses";
import { useCategories } from "../../../stores/hooks/useCategories";
import { useAccounts } from "../../../stores/hooks/useAccounts";

const ExpenseForm = () => {
    const [form, setForm] = useState({
        expense_source: "",
        expense_amount: "",
        expense_date: "",
        category_expense_id: "",
        account_expense_id: "",
    });
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { saveExpense } = useExpenses();
    const { items: allCategories, loadCategories } = useCategories();
    const { items: accounts, loadAccounts } = useAccounts();
    const categories = allCategories.filter((category) => category.type === true);

    useEffect(() => {
        loadCategories(user.user_id);
        loadAccounts(user.user_id);
    }, [user, loadCategories, loadAccounts]);

    useEffect(() => {
        if (id) getExpense(id).then(data => setForm({
            ...data,
            expense_date: data.expense_date ? data.expense_date.slice(0, 10) : "",
        }));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await saveExpense({ ...form, user_id: user.user_id }, id);
            navigate("/expenses");
        } catch (err) {
            setError(err.message || "Failed to save expense");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{ bgcolor: "indianred", color: "white", p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                    <TrendingDownIcon />
                    <Typography variant="h5" fontWeight="bold">
                        {id ? "Edit" : "Add"} Expense
                    </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label="Source"
                                    placeholder="Expense Source"
                                    fullWidth required
                                    value={form.expense_source}
                                    onChange={e => setForm({ ...form, expense_source: e.target.value })}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Amount" type="number"
                                    fullWidth required
                                    value={form.expense_amount}
                                    onChange={e => setForm({ ...form, expense_amount: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Date" type="date"
                                    fullWidth required
                                    value={form.expense_date}
                                    onChange={e => setForm({ ...form, expense_date: e.target.value })}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        label="Category"
                                        value={form.category_expense_id}
                                        onChange={e => setForm({ ...form, category_expense_id: e.target.value })}
                                    >
                                        {categories.map(category => (
                                            <MenuItem key={category.category_id} value={category.category_id}>
                                                {category.category_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Account</InputLabel>
                                    <Select
                                        label="Account"
                                        value={form.account_expense_id}
                                        onChange={e => setForm({ ...form, account_expense_id: e.target.value })}
                                    >
                                        {accounts.map(account => (
                                            <MenuItem key={account.account_id} value={account.account_id}>
                                                {account.account_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {error && (
                                <Grid size={12}>
                                    <Alert severity="error">{error}</Alert>
                                </Grid>
                            )}

                            <Grid size={12}>
                                <Button type="submit" variant="contained" sx={{ mt: 1, mr: 1, bgcolor: "indianred", "&:hover": { bgcolor: "firebrick" } }}>
                                    {id ? "Update" : "Add"} Expense
                                </Button>
                                <Button variant="outlined" sx={{ mt: 1 }} onClick={() => navigate("/expenses")}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ExpenseForm;
