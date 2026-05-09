import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, Grid, MenuItem, Select, Typography, Divider, Alert} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { buildReceiptData } from "../services/receipt.service";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useExpenses } from "../../../stores/hooks/useExpenses";
import { useIncomes } from "../../../stores/hooks/useIncomes";

const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

const ReceiptList = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const { user } = useAuth();
    const { items: expenses, loadExpenses } = useExpenses();
    const { items: incomes, loadIncomes } = useIncomes();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            loadExpenses(user.user_id);
            loadIncomes(user.user_id);
        }
    }, [user, loadExpenses, loadIncomes]);

    const { availableYears, byYear } = useMemo(
        () => buildReceiptData(expenses, incomes),
        [expenses, incomes],
    );

    const year = useMemo(() => {
        if (selectedYear !== null) return selectedYear;
        if (availableYears.length === 0) return null;
        const currentYear = new Date().getFullYear();
        return availableYears.includes(currentYear) ? currentYear : availableYears[0];
    }, [selectedYear, availableYears]);

    const summary = year ? byYear[year] : [];
    const totalYearProfit = summary.reduce((sum, monthData) => sum + Number(monthData.profit), 0);
    const monthsCount = summary.length || 1;
    const avgMonthlyProfit = totalYearProfit / monthsCount;
    

    if (availableYears.length === 0) {
        return (
            <Box>
                <Typography variant="h4" sx={{ mb: 3 }}>Yearly Receipts</Typography>
                <Alert severity="info">
                    No receipts yet. Add some expenses or incomes to see them here.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>Yearly Receipts</Typography>

            <Card sx={{
                bgcolor: "darkslategray",
                color: "white",
                p: 3,
                mb: 3,
                borderRadius: 3,
            }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                }}>
                    <Box>
                        <Typography variant="body2" sx={{ color: "lightgray" }}>
                            Annual Net Profit
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            ${totalYearProfit.toLocaleString()}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" sx={{ color: "lightgray" }}>
                            Average Monthly Profit
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            ${avgMonthlyProfit.toLocaleString()}
                        </Typography>
                    </Box>
                </Box>
            </Card>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Select a Month to View Receipt
                </Typography>
                <Select size="small" value={year || ""} onChange={e => setSelectedYear(e.target.value)}>
                    {availableYears.map(y => (
                        <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                </Select>
            </Box>

            <Grid container spacing={2}>
                {summary.map(monthData => {
                    const profit = Number(monthData.profit);
                    const income = Number(monthData.income);
                    const expenses = Number(monthData.expenses);
                    const isProfit = profit >= 0;
                    const bg = isProfit ? "honeydew" : "mistyrose";
                    const border = isProfit ? "lightgreen" : "lightpink";
                    const accent = isProfit ? "seagreen" : "indianred";

                    return (
                        <Grid size={{ xs: 6, md: 4, lg: 3 }} key={monthData.month}>
                            <Card sx={{ bgcolor: bg, border: 2, borderColor: border, borderRadius: 3, "&:hover": { transform: "scale(1.05)" }, }}>
                                <CardActionArea onClick={() => navigate(`/receipts/${year}/${monthData.month}`)}>
                                    <CardContent>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                            <Typography sx={{ fontWeight: "bold", color: accent }}>
                                                {MONTHS[monthData.month - 1]}
                                            </Typography>
                                            {isProfit ? <CheckCircleIcon sx={{ color: "seagreen" }} /> : <CancelIcon sx={{ color: "indianred" }} />}
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Typography variant="caption" sx={{ color: "dimgray" }}>Income</Typography>
                                                <Typography variant="caption" sx={{ color: "seagreen", fontWeight: "bold" }}>
                                                    ${income.toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Typography variant="caption" sx={{ color: "dimgray" }}>Expenses</Typography>
                                                <Typography variant="caption" sx={{ color: "indianred", fontWeight: "bold" }}>
                                                    ${expenses.toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ borderColor: border }} />

                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2 }}>
                                            <Typography variant="caption" sx={{ fontWeight: "bold", color: "darkslategray" }}>
                                                Net Profit
                                            </Typography>
                                            <Typography sx={{ fontWeight: "bold", color: accent }}>
                                                {isProfit ? "+" : "-"}${Math.abs(profit).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

        </Box>
    );
}

export default ReceiptList;
