import { NavLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../../stores/hooks/useAuth";

const NavBar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
        navigate("/");
    };

    const linkStyle = ({ isActive }) => ({
        color: isActive ? "white" : "lightgray",
        backgroundColor: isActive ? "steelblue" : "transparent",
        textDecoration: "none",
        padding: "6px 12px",
        borderRadius: 6,
        fontWeight: 500,
        fontSize: 14,
    });

    return (
        <AppBar position="static" sx={{ bgcolor: "gray" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {user ? (
                        <>
                            <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
                            <NavLink to="/categories" style={linkStyle}>Categories</NavLink>
                            <NavLink to="/expenses" style={linkStyle}>Expenses</NavLink>
                            <NavLink to="/incomes" style={linkStyle}>Incomes</NavLink>
                            <NavLink to="/receipts" style={linkStyle}>Receipts</NavLink>
                            <NavLink to="/accounts" style={linkStyle}>Accounts</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/" style={linkStyle}>Home</NavLink>
                            <NavLink to="/about" style={linkStyle}>About</NavLink>
                        </>
                    )}
                </Box>

                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {user ? (
                        <>
                            <Typography variant="body2" sx={{ color: "whitesmoke", mr: 1 }}>
                                {user.user_first_name} {user.user_last_name}
                            </Typography>
                            <Button
                                variant="contained" size="small"
                                onClick={handleSignOut}
                                sx={{ color: "white", borderColor: "darkgray" }}
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/register" style={linkStyle}>Register</NavLink>
                            <NavLink to="/login" style={linkStyle}>Login</NavLink>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
