import { useEffect, useMemo } from "react";
import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useExpenses } from "../../../stores/hooks/useExpenses";
import { useIncomes } from "../../../stores/hooks/useIncomes";
import { buildDashboardData } from "../services/dashboard.service";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

const Dashboard = () => {
    const { user } = useAuth();
    const { items: expenses, loadExpenses } = useExpenses();
    const { items: incomes, loadIncomes } = useIncomes();

    useEffect(() => {
        if (user) {
            loadExpenses(user.user_id);
            loadIncomes(user.user_id);
        }
    }, [user, loadExpenses, loadIncomes]);

    const data = useMemo(
        () => (expenses.length || incomes.length ? buildDashboardData(expenses, incomes) : null),
        [expenses, incomes],
    );

    if (!data) {
        return (
            <Box>
                <Typography variant="h4">Dashboard</Typography>
                <Typography sx={{ mt: 2 }}>Loading...</Typography>
            </Box>
        );
    }

    const monthLabel = `${MONTH_NAMES[data.currentMonth]} ${data.currentYear}`;
    const welcome = user && user.user_first_name ? `Welcome, ${user.user_first_name}.` : "Welcome.";
    const isProfit = data.currentMonthProfit > 0;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
                {welcome}
            </Typography>

            <Box sx={{ bgcolor: "lightgray", borderRadius: 3, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
                    {monthLabel}
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ bgcolor: "steelblue", color: "white", borderRadius: 3, p: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography sx={{ color: "aliceblue" }}>Total Income</Typography>
                                <AttachMoneyIcon sx={{ color: "lightblue" }} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                ${data.totalIncome.toLocaleString()}
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ bgcolor: "indianred", color: "white", borderRadius: 3, p: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography sx={{ color: "mistyrose" }}>Total Expenses</Typography>
                                <CreditCardIcon sx={{ color: "lightpink" }} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                ${data.totalExpenses.toLocaleString()}
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ bgcolor: isProfit ? "seagreen" : "indianred", color: "white", borderRadius: 3, p: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography sx={{ color: "honeydew" }}>Net Profit</Typography>
                                {isProfit ? <TrendingUpIcon sx={{ color: "palegreen" }} /> : <TrendingDownIcon sx={{ color: "lightpink" }} />}
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                ${data.currentMonthProfit.toLocaleString()}
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            Monthly Expenses Breakdown
                        </Typography>
                        {data.expenseByCategory.length === 0 ? (
                            <Typography sx={{ color: "gray" }}>No expenses this month.</Typography>
                        ) : (
                            <>
                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.expenseByCategory}
                                                cx="50%" cy="50%"
                                                innerRadius={60} outerRadius={100}
                                                paddingAngle={2} dataKey="value"
                                            >
                                                {data.expenseByCategory.map((entry, i) => (
                                                    <Cell key={i} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Grid container spacing={1} sx={{ mt: 2 }}>
                                    {data.expenseByCategory.slice(0, 4).map((entry, i) => (
                                        <Grid size={{ xs: 6 }} key={i}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: entry.color }} />
                                                <Typography variant="caption" sx={{ color: "dimgray" }}>{entry.name}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            Top 5 Expense Categories
                        </Typography>
                        {data.topExpenseCategories.length === 0 ? (
                            <Typography sx={{ color: "gray" }}>No expenses this month.</Typography>
                        ) : (
                            <Stack spacing={2}>
                                {data.topExpenseCategories.map((entry, i) => (
                                    <Box key={i} sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: "whitesmoke",
                                        "&:hover": { bgcolor: "gainsboro" },
                                    }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Box sx={{
                                                width: 32, height: 32, borderRadius: 2,
                                                bgcolor: "lightgray",
                                                display: "flex", justifyContent: "center", alignItems: "center",
                                                fontWeight: "bold", color: "darkslategray",
                                            }}>
                                                #{i + 1}
                                            </Box>
                                            <Typography sx={{ fontWeight: "bold" }}>{entry.name}</Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                            ${entry.value.toLocaleString()}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Income Sources</Typography>
                        {data.incomeByCategory.length === 0 ? (
                            <Typography sx={{ color: "gray" }}>No income this month.</Typography>
                        ) : (
                            <>
                                <Box sx={{ height: 250 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.incomeByCategory}
                                                cx="50%" cy="50%" outerRadius={90} dataKey="value"
                                            >
                                                {data.incomeByCategory.map((entry, i) => (
                                                    <Cell key={i} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Stack spacing={1} sx={{ mt: 2 }}>
                                    {data.incomeByCategory.map((entry, i) => (
                                        <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: entry.color }} />
                                                <Typography variant="caption" sx={{ color: "dimgray" }}>{entry.name}</Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                                                ${entry.value.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </>
                        )}
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Net Profits - {data.currentYear}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <ArrowUpwardIcon sx={{ color: "seagreen" }} fontSize="small" />
                            <Typography variant="body2" sx={{ color: "slategray" }}>Year Total:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                ${data.totalYearProfit.toLocaleString()}
                            </Typography>
                        </Box>
                        <Box sx={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.yearProfit}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="lightgray" />
                                    <XAxis dataKey="month" tick={{ fill: "slategray" }} />
                                    <YAxis
                                        tick={{ fill: "slategray" }}
                                        tickFormatter={(v) => `$${v / 1000}k`}
                                    />
                                    <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Net Profit"]} />
                                    <Area
                                        type="monotone" dataKey="profit"
                                        stroke="steelblue" fill="steelblue" fillOpacity={0.2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
