import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Divider, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { login, loginWithFace } from '../services/auth.service';
import FaceCapture from '../components/FaceCapture';
import { useAuth } from '../../../stores/hooks/useAuth';

const Login = () => {
    const [form, setForm] = useState({ user_email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showFaceCamera, setShowFaceCamera] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSuccess = (data) => {
        signIn({ user: data.user, accessToken: data.access_token });
        navigate('/dashboard');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { ok, data } = await login(form);
            if (ok && data.authenticated) {
                onSuccess(data);
            } else {
                setError((data && data.message) || 'Login failed.');
            }
        } catch (err) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFaceCapture = async (descriptor) => {
        setError('');
        setLoading(true);
        try {
            const { ok, data } = await loginWithFace({ user_email: form.user_email, descriptor });
            if (ok && data.authenticated) {
                onSuccess(data);
            } else {
                setError((data && data.message) || 'Face login failed.');
                setShowFaceCamera(false);
            }
        } catch (err) {
            setError(err.message || 'Face login failed.');
            setShowFaceCamera(false);
        } finally {
            setLoading(false);
        }
    };

    const startFaceLogin = () => {
        if (!form.user_email) {
            setError('Enter your email first.');
            return;
        }
        setError('');
        setShowFaceCamera(true);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Paper sx={{ p: 3, width: 450 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Login
                </Typography>

                <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        name="user_email"
                        type="email"
                        value={form.user_email}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required={!showFaceCamera}
                        fullWidth
                    />

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>

                    <Divider>or</Divider>

                    {!showFaceCamera ? (
                        <Button variant="outlined" onClick={startFaceLogin} disabled={loading}>
                            Login with Face
                        </Button>
                    ) : (
                        <FaceCapture
                            captureLabel="Scan face"
                            onCapture={handleFaceCapture}
                        />
                    )}

                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Link component={RouterLink} to="/register">
                            Register
                        </Link>
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Login;
