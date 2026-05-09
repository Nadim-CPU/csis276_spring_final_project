import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Alert, Box, Button, Card, CardContent, FormControl, Grid, InputLabel,
    MenuItem, Select, TextField, Typography,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getIncome } from "../services/income.service";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useIncomes } from "../../../stores/hooks/useIncomes";
import { useCategories } from "../../../stores/hooks/useCategories";
import { useAccounts } from "../../../stores/hooks/useAccounts";

const IncomeForm = () => {
    const [form, setForm] = useState({
        income_source: "",
        income_amount: "",
        income_date: "",
        category_income_id: "",
        account_income_id: "",
    });
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { saveIncome } = useIncomes();
    const { items: allCategories, loadCategories } = useCategories();
    const { items: accounts, loadAccounts } = useAccounts();
    const categories = allCategories.filter((category) => category.type === false);

    useEffect(() => {
        loadCategories(user.user_id);
        loadAccounts(user.user_id);
    }, [user, loadCategories, loadAccounts]);

    useEffect(() => {
        if (id) getIncome(id).then(data => setForm({
            ...data,
            income_date: data.income_date ? data.income_date.slice(0, 10) : "",
        }));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await saveIncome({ ...form, user_id: user.user_id }, id);
            navigate("/incomes");
        } catch (err) {
            setError(err.message || "Failed to save income");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{ bgcolor: "seagreen", color: "white", p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                    <TrendingUpIcon />
                    <Typography variant="h5" fontWeight="bold">
                        {id ? "Edit" : "Add"} Income
                    </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label="Source"
                                    placeholder="Income Source"
                                    fullWidth required
                                    value={form.income_source}
                                    onChange={e => setForm({ ...form, income_source: e.target.value })}
                                />
                            </Grid>

                            <Grid size={{ xs: 8, sm: 6 }}>
                                <TextField
                                    label="Amount" type="number"
                                    fullWidth required
                                    value={form.income_amount}
                                    onChange={e => setForm({ ...form, income_amount: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6 }}>
                                <TextField
                                    label="Date" type="date"
                                    fullWidth required
                                    value={form.income_date}
                                    onChange={e => setForm({ ...form, income_date: e.target.value })}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        label="Category"
                                        value={form.category_income_id}
                                        onChange={e => setForm({ ...form, category_income_id: e.target.value })}
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
                                        value={form.account_income_id}
                                        onChange={e => setForm({ ...form, account_income_id: e.target.value })}
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
                                <Button type="submit" variant="contained" sx={{ mt: 1, mr: 1, bgcolor: "seagreen", "&:hover": { bgcolor: "darkgreen" } }}>
                                    {id ? "Update" : "Add"} Income
                                </Button>
                                <Button variant="outlined" sx={{ mt: 1 }} onClick={() => navigate("/incomes")}>
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

export default IncomeForm;
