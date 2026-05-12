import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Alert, Box, Button, Card, IconButton, Snackbar, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useAccounts } from "../../../stores/hooks/useAccounts";


const AccountList = () => {
    const { user } = useAuth();
    const { items: accounts, loadAccounts, deleteAccount } = useAccounts();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        loadAccounts(user.user_id);
    }, [user, loadAccounts]);

    const handleDelete = async (id) => {
        try {
            await deleteAccount(id);
        } catch (err) {
            setErrorMsg(err?.message || "Failed to delete account.");
        }
    }

    return (
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{
                    bgcolor: "steelblue",
                    color: "white", p: 3,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <AccountBalanceWalletIcon />
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Accounts
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate("/accounts/new")}
                        sx={{
                            bgcolor: "white", color: "steelblue",
                            textTransform: "none", fontWeight: "bold", borderRadius: 2,
                            "&:hover": { bgcolor: "lightgray" },
                        }}
                    >
                        + New Account
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Balance</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accounts.map(account => (
                                <TableRow key={account.account_id} hover>
                                    <TableCell>{account.account_name}</TableCell>
                                    <TableCell>{account.account_type}</TableCell>
                                    <TableCell>${Number(account.account_balance).toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            component={Link}
                                            to={`/accounts/${account.account_id}/edit`}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(account.account_id)}
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
export default AccountList;
