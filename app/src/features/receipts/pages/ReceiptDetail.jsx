import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Typography, Divider, Button, Stack } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { buildMonthDetail } from "../services/receipt.service";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useExpenses } from "../../../stores/hooks/useExpenses";
import { useIncomes } from "../../../stores/hooks/useIncomes";

const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

const ReceiptDetail = () => {
    const { year, month } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items: expenses, loadExpenses } = useExpenses();
    const { items: incomes, loadIncomes } = useIncomes();

    const y = Number(year);
    const m = Number(month);

    useEffect(() => {
        if (user) {
            loadExpenses(user.user_id);
            loadIncomes(user.user_id);
        }
    }, [user, loadExpenses, loadIncomes]);

    const data = useMemo(
        () => buildMonthDetail(expenses, incomes, y, m),
        [expenses, incomes, y, m],
    );

    const totalIncome = data.incomes.reduce((sum, income) => sum + Number(income.income_amount), 0);
    const totalExpenses = data.expenses.reduce((sum, expense) => sum + Number(expense.expense_amount), 0);
    const netProfit = totalIncome - totalExpenses;
    const isProfit = netProfit >= 0;
    const monthVisual = m < 10 ? `0${m}` : `${m}`;

    return (
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/receipts")}
                sx={{ mb: 2 }}
            >
                Back to Yearly Receipts
            </Button>

            <Card sx={{ bgcolor: "darkslategray", color: "white", p: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                            <ReceiptLongIcon />
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                Monthly Receipt
                            </Typography>
                        </Box>
                        <Typography sx={{ color: "lightgray" }}>
                            {MONTHS[m - 1]} {y}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" sx={{ color: "lightgray", display: "block" }}>
                            Date
                        </Typography>
                        <Typography variant="h6">
                            {y}-{monthVisual}
                        </Typography>
                    </Box>
                </Box>
            </Card>

            <Card sx={{ borderRadius: 0, p: 4, boxShadow: "none" }}>
                {/* Income container */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{
                        display: "flex", alignItems: "center", gap: 1,
                        pb: 1, mb: 2, borderBottom: 2, borderColor: "lightgray",
                    }}>
                        <ArrowCircleUpIcon sx={{ color: "seagreen" }} />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Income Sources
                        </Typography>
                    </Box>
                    <Stack spacing={1}>
                        {data.incomes.length === 0 && (
                            <Typography variant="body2" sx={{ color: "gray", fontStyle: "italic" }}>
                                No incomes for this month.
                            </Typography>
                        )}
                        {data.incomes.map(income => (
                            <Box key={income.income_id} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography>{income.income_source}</Typography>
                                <Typography sx={{ fontWeight: "bold", color: "seagreen" }}>
                                    +${income.income_amount}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                    <Divider sx={{ mt: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}>
                        <Typography sx={{ fontWeight: "bold" }}>Total Income</Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "seagreen" }}>
                            ${totalIncome}
                        </Typography>
                    </Box>
                </Box>
                {/* Expense container */}
                <Box>
                    <Box sx={{
                        display: "flex", alignItems: "center", gap: 1,
                        pb: 1, mb: 2, borderBottom: 2, borderColor: "lightgray",
                    }}>
                        <ArrowCircleDownIcon sx={{ color: "indianred" }} />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Expenses
                        </Typography>
                    </Box>
                    <Stack spacing={1}>
                        {data.expenses.length === 0 && (
                            <Typography variant="body2" sx={{ color: "gray", fontStyle: "italic" }}>
                                No expenses for this month.
                            </Typography>
                        )}
                        {data.expenses.map(expense => (
                            <Box key={expense.expense_id} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography>
                                    {expense.category.category_name || expense.expense_source}
                                </Typography>
                                <Typography sx={{ fontWeight: "bold", color: "indianred" }}>
                                    -${expense.expense_amount}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                    <Divider sx={{ mt: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}>
                        <Typography sx={{ fontWeight: "bold" }}>Total Expenses</Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "indianred" }}>
                            ${totalExpenses}
                        </Typography>
                    </Box>
                </Box>
            </Card>
            
            {/* Net Profit Section*/}
            <Card sx={{ bgcolor: isProfit ? "seagreen" : "indianred", color: "white", p: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Typography variant="body2">
                            Net Profit/Loss
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                            {isProfit ? "+" : "-"}${Math.abs(netProfit)}
                        </Typography>
                    </Box>
                    {isProfit
                        ? <ArrowCircleUpIcon sx={{ fontSize: 64 }} />
                        : <ArrowCircleDownIcon sx={{ fontSize: 64 }} />}
                </Box>
            </Card>
        </Box>
    );
};

export default ReceiptDetail;
