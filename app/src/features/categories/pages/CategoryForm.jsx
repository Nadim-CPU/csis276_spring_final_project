import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Alert, Box, Button, Card, CardContent, FormControl, Grid, InputLabel,
    MenuItem, Select, TextField, Typography,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import { getCategory } from "../services/category.service";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useCategories } from "../../../stores/hooks/useCategories";

const CategoryForm = () => {
    const [form, setForm] = useState({ category_name: "", type: "" });
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { saveCategory } = useCategories();

    useEffect(() => {
        if (id) {
            getCategory(id).then(setForm);
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await saveCategory({ ...form, user_id: user.user_id }, id);
            navigate("/categories");
        } catch (err) {
            setError(err.message || "Failed to save category");
        }
    };

    return (
        
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{
                    bgcolor: "slategray",
                    color: "white", p: 3,
                    display: "flex", alignItems: "center", gap: 2,
                }}>
                    <CategoryIcon />
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {id ? "Edit" : "Add"} Category
                    </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label="Category Name"
                                    placeholder="Category Name"
                                    fullWidth
                                    required
                                    value={form.category_name}
                                    onChange={e => setForm({ ...form, category_name: e.target.value })}
                                />
                            </Grid>

                            <Grid size={12}>
                                <FormControl fullWidth required disabled={Boolean(id)}>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        label="Type"
                                        value={form.type === "" ? "" : String(form.type)}
                                        onChange={e => setForm({ ...form, type: e.target.value === "true" })}
                                    >
                                        <MenuItem value="false">Income</MenuItem>
                                        <MenuItem value="true">Expense</MenuItem>
                                    </Select>
                                </FormControl>
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
                                        {id ? "Update" : "Add"} Category
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate("/categories")}
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

export default CategoryForm;
