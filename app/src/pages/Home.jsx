import { Box, Typography, Container, Grid } from "@mui/material";
import trackerImg from "../assets/tracker.webp";
import moneyImg from "../assets/money.webp";

const Home = () => {
    return (
        <>
            <Box sx={{
                bgcolor: "seagreen",
                color: "white",
                py: 8,
                textAlign: "center",
            }}>
                <Container maxWidth="md">
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                        Cheque Me
                    </Typography>
                    <Typography variant="h5" sx={{ fontStyle: "italic" }}>
                        "Time is money. And Money is what saves you time."
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={6} alignItems="center" sx={{ mb: 8 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            component="img"
                            src={trackerImg}
                            alt="Track your spending"
                            sx={{ width: "100%", borderRadius: 3 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                            Track Your Spending
                        </Typography>
                        <Typography variant="body1" sx={{ color: "gray" }}>
                            Know exactly where your money goes by categorizing your expenses
                            and incomes. Manage your accounts and ensure when to save and when
                            to spend. Our dashboards will give you detailed overviews on your biggest expenses
                            and incomes!
                        </Typography>
                    </Grid>
                </Grid>

                
                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                            Manage Your Income and Expenses
                        </Typography>
                        <Typography variant="body1" sx={{ color: "gray" }}>
                            Have every income and expense logged through our receipts feature!
                            Track what your net profits/losses are per month and per year!
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            component="img"
                            src={moneyImg}
                            alt="Manage your income and expenses"
                            sx={{ width: "100%", borderRadius: 3 }}
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* Da Footer */}
            <Box sx={{
                bgcolor: "gray",
                color: "white",
                py: 3,
                textAlign: "center",
            }}>
                <Typography variant="body2">
                   Copyright &copy; Nadim 2026
                </Typography>
            </Box>
        </>
    );
};

export default Home;
