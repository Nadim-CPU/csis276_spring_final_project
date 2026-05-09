import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Box, Button, Card, IconButton, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../../stores/hooks/useAuth";
import { useCategories } from "../../../stores/hooks/useCategories";


const CategoryList = () => {
    const { user } = useAuth();
    const { items: categories, loadCategories, deleteCategory } = useCategories();
    const navigate = useNavigate();

    useEffect(() => {
        loadCategories(user.user_id);
    }, [user, loadCategories]);

    const handleDelete = async (id) => {
        await deleteCategory(id);
    }

    return (
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{
                    bgcolor: "slategray",
                    color: "white", p: 3,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CategoryIcon />
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Categories
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate("/categories/new")}
                        sx={{
                            bgcolor: "white", color: "slategray",
                            textTransform: "none", fontWeight: "bold", borderRadius: 2,
                            "&:hover": { bgcolor: "lightgray" },
                        }}
                    >
                        + New Category
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map(category => (
                                <TableRow key={category.category_id} hover>
                                    <TableCell>{category.category_name}</TableCell>
                                    <TableCell>{category.type ? "Expense" : "Income"}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            component={Link}
                                            to={`/categories/${category.category_id}/edit`}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(category.category_id)}
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
        </Box>
    )
}
export default CategoryList;
