import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = '/models';
let modelsLoaded = false;

const loadModels = async () => {
    if (modelsLoaded) return;
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
};

const FaceCapture = ({ onCapture, captureLabel = 'Capture face' }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const start = async () => {
            try {
                setStatus('loading');
                await loadModels();
                if (cancelled) return;

                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (cancelled) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
                setStatus('ready');
            } catch (err) {
                setError(err.message || 'Could not access camera');
                setStatus('error');
            }
        };

        start();

        return () => {
            cancelled = true;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }
        };
    }, []);

    const handleCapture = async () => {
        if (!videoRef.current) return;
        setError('');
        setStatus('detecting');
        try {
            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection?.descriptor) {
                setError('No face detected. Make sure your face is visible and well-lit.');
                setStatus('ready');
                return;
            }

            onCapture(Array.from(detection.descriptor));
            setStatus('captured');
        } catch (err) {
            setError(err.message || 'Capture failed');
            setStatus('ready');
        }
    };

    return (
        <Stack spacing={2} alignItems="center">
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    aspectRatio: '4/3',
                    bgcolor: 'black',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {status === 'loading' && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <CircularProgress size={32} sx={{ color: 'white' }} />
                        <Typography variant="caption">Loading camera & models…</Typography>
                    </Box>
                )}
            </Box>

            {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

            <Button
                variant="contained"
                onClick={handleCapture}
                disabled={status !== 'ready' && status !== 'detecting'}
                fullWidth
            >
                {status === 'detecting' ? <CircularProgress size={24} /> : captureLabel}
            </Button>
        </Stack>
    );
};

export default FaceCapture;
