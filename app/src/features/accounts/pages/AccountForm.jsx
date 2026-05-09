import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Alert, Box, Button, Card, CardContent, FormControl, Grid, InputLabel,
    MenuItem, Select, TextField, Typography,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { getAccount } from "../services/account.service";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useAccounts } from "../../../stores/hooks/useAccounts";

const AccountForm = () => {
    const [form, setForm] = useState({ account_name: "", account_type: "", account_balance: "" });
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { saveAccount } = useAccounts();

    useEffect(() => {
        if (id) {
            getAccount(id).then(setForm);
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await saveAccount({ ...form, user_id: user.user_id }, id);
            navigate("/accounts");
        } catch (err) {
            setError(err.message || "Failed to save account");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{
                    bgcolor: "steelblue",
                    color: "white", p: 3,
                    display: "flex", alignItems: "center", gap: 2,
                }}>
                    <AccountBalanceWalletIcon />
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {id ? "Edit" : "Add"} Account
                    </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label="Account Name"
                                    placeholder="Account Name"
                                    fullWidth
                                    required
                                    value={form.account_name}
                                    onChange={e => setForm({ ...form, account_name: e.target.value })}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth required disabled={Boolean(id)}>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        label="Type"
                                        value={form.account_type}
                                        onChange={e => setForm({ ...form, account_type: e.target.value })}
                                    >
                                        <MenuItem value="savings">Savings</MenuItem>
                                        <MenuItem value="credit card">Credit Card</MenuItem>
                                        <MenuItem value="cash">Cash</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField disabled={Boolean(id)}
                                    label="Balance"
                                    type="number"
                                    fullWidth
                                    required
                                    value={form.account_balance}
                                    onChange={e => setForm({ ...form, account_balance: e.target.value })}
                                />
                            </Grid>

                            {error && (
                                <Grid size={12}>
                                    <Alert severity="error">{error}</Alert>
                                </Grid>
                            )}

                            <Grid size={12}>
                                <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2, px: 4 }}
                                    >
                                        {id ? "Update" : "Add"} Account
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate("/accounts")}
                                        sx={{ textTransform: "none", borderRadius: 2 }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AccountForm;
