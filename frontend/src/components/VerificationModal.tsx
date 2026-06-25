import React, { useState, useRef, useEffect } from 'react';
import { useVerificationModal } from '../context/VerificationModalContext';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    X, 
    Smartphone, 
    ShieldCheck, 
    Image as ImageIcon, 
    User as UserIcon, 
    CheckCircle2, 
    ArrowRight, 
    ArrowLeft, 
    Upload, 
    Loader2 
} from 'lucide-react';

export default function VerificationModal() {
    const { isOpen, closeVerification } = useVerificationModal();
    const { user } = useAuth();
    const { setUser } = useAuthStore();
    const overlayRef = useRef<HTMLDivElement>(null);

    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [mockOtpHint, setMockOtpHint] = useState('');

    // Aadhaar Card
    const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
    const [aadhaarPreview, setAadhaarPreview] = useState<string>('');
    const [aadhaarUrl, setAadhaarUrl] = useState<string>('');

    // User Photo
    const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null);
    const [userPhotoPreview, setUserPhotoPreview] = useState<string>('');
    const [userPhotoUrl, setUserPhotoUrl] = useState<string>('');
    const [makeProfilePic, setMakeProfilePic] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !user) return null;

    // Actions
    const handleSendOtp = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }
        const toastId = toast.loading('Sending OTP...');
        try {
            const res = await api.post('/auth/send-otp', { phoneNumber });
            toast.success('OTP sent successfully!', { id: toastId });
            setOtpSent(true);
            if (res.data.otp) {
                setMockOtpHint(res.data.otp);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send OTP', { id: toastId });
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 6) {
            toast.error('Please enter the 6-digit OTP');
            return;
        }
        const toastId = toast.loading('Verifying OTP...');
        try {
            await api.post('/auth/verify-otp', { phoneNumber, otp });
            toast.success('Mobile number verified!', { id: toastId });
            setOtpVerified(true);
            setStep(2);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid OTP', { id: toastId });
        }
    };

    const handleAadhaarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAadhaarFile(file);
        setAadhaarPreview(URL.createObjectURL(file));

        // Upload immediately
        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        const toastId = toast.loading('Uploading Aadhaar card photo...');
        try {
            const res = await api.post('/users/upload', formData);
            setAadhaarUrl(res.data.url);
            toast.success('Aadhaar photo uploaded securely!', { id: toastId });
        } catch (err: any) {
            toast.error('Aadhaar upload failed', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleUserPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUserPhotoFile(file);
        setUserPhotoPreview(URL.createObjectURL(file));

        // Upload immediately
        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        const toastId = toast.loading('Uploading your photo...');
        try {
            const res = await api.post('/users/upload', formData);
            setUserPhotoUrl(res.data.url);
            toast.success('Photo uploaded successfully!', { id: toastId });
        } catch (err: any) {
            toast.error('Photo upload failed', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleFinalConfirm = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading('Submitting verification details...');
        try {
            const preference = makeProfilePic ? 'selected' : (user.googleProfilePhoto ? 'google' : 'default');
            const res = await api.post(`/users/${user.id}/submit-verification`, {
                phoneNumber,
                aadhaarImage: aadhaarUrl,
                userPhoto: userPhotoUrl,
                profilePicturePreference: preference
            });

            // Update user in local storage / authStore
            setUser(res.data.user);
            toast.success('Identity verification complete! You now have full access.', { id: toastId });
            closeVerification();
            // Reset wizard state
            setStep(1);
            setPhoneNumber('');
            setOtp('');
            setOtpSent(false);
            setOtpVerified(false);
            setAadhaarFile(null);
            setAadhaarPreview('');
            setAadhaarUrl('');
            setUserPhotoFile(null);
            setUserPhotoPreview('');
            setUserPhotoUrl('');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Verification submission failed', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleNext = () => {
        if (step === 1 && !otpVerified) {
            toast.error('Please verify your phone number first');
            return;
        }
        if (step === 2 && !aadhaarUrl) {
            toast.error('Please upload your Aadhaar card photo');
            return;
        }
        if (step === 3 && !userPhotoUrl) {
            toast.error('Please upload your photo');
            return;
        }
        if (step < 4) setStep(step + 1);
    };

    return (
        <div
            ref={overlayRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 250,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(12px)',
                padding: '1rem',
                fontFamily: "'Inter', sans-serif",
                overflowY: 'auto'
            }}
            onClick={(e) => e.target === e.currentTarget && closeVerification()}
        >
            <div
                style={{
                    backgroundColor: 'var(--clr-modal-bg, #ffffff)',
                    color: 'var(--clr-foreground, #1e293b)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    maxWidth: '32rem',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    border: '1px solid var(--clr-border, #e2e8f0)',
                    transition: 'all 0.3s ease'
                }}
            >
                {/* Visual Glass Accent Orbs */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '10rem', height: '10rem', backgroundColor: 'rgba(249, 115, 22, 0.15)', borderRadius: '50%', filter: 'blur(50px)', marginRight: '-2rem', marginTop: '-2rem', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '10rem', height: '10rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '50%', filter: 'blur(50px)', marginLeft: '-2rem', marginBottom: '-2rem', pointerEvents: 'none' }}></div>

                {/* Header */}
                <div style={{ position: 'relative', zIndex: 10, padding: '1.5rem 2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--clr-border, #e2e8f0)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ea580c' }}>Identity Verification</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--clr-muted-foreground, #64748b)', margin: '0.1rem 0 0 0' }}>Required for full platform access</p>
                    </div>
                    <button
                        onClick={closeVerification}
                        style={{ padding: '0.5rem', backgroundColor: 'var(--clr-muted, #f1f5f9)', border: 'none', borderRadius: '50%', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Steps Bar indicator */}
                <div style={{ display: 'flex', padding: '0.75rem 2rem', gap: '0.5rem', backgroundColor: 'rgba(234, 88, 12, 0.05)', borderBottom: '1px solid var(--clr-border, #e2e8f0)' }}>
                    {[1, 2, 3, 4].map((s) => (
                        <div 
                            key={s} 
                            style={{ 
                                flex: 1, 
                                height: '4px', 
                                borderRadius: '2px', 
                                backgroundColor: step >= s ? '#ea580c' : '#cbd5e1',
                                transition: 'all 0.3s ease' 
                            }} 
                        />
                    ))}
                </div>

                {/* Step Content */}
                <div style={{ padding: '2rem', minHeight: '18rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
                    
                    {step === 1 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(234, 88, 12, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Step 1: Mobile Number</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--clr-muted-foreground, #64748b)', margin: 0 }}>We will send a 6-digit OTP code to verify your phone number</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Mobile Number</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="tel"
                                            disabled={otpSent && otpVerified}
                                            placeholder="e.g. 9876543210"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--clr-border, #e2e8f0)', outline: 'none', backgroundColor: 'var(--clr-input-bg)', color: 'var(--clr-foreground)', fontSize: '0.95rem' }}
                                        />
                                        {!otpVerified && (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                style={{ padding: '0.75rem 1.2rem', borderRadius: '12px', backgroundColor: '#ea580c', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                                            >
                                                {otpSent ? 'Resend' : 'Send'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {otpSent && !otpVerified && (
                                    <div className="form-group">
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Enter 6-Digit OTP</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                type="text"
                                                placeholder="Enter OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--clr-border, #e2e8f0)', outline: 'none', backgroundColor: 'var(--clr-input-bg)', color: 'var(--clr-foreground)', fontSize: '0.95rem', letterSpacing: '0.2em', textAlign: 'center', fontWeight: 'bold' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                style={{ padding: '0.75rem 1.2rem', borderRadius: '12px', backgroundColor: '#22c55e', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                                            >
                                                Verify OTP
                                            </button>
                                        </div>
                                        {mockOtpHint && (
                                            <p style={{ fontSize: '0.8rem', color: '#16a34a', margin: '0.5rem 0 0 0', fontWeight: 'medium' }}>
                                                💡 Test OTP: <strong>{mockOtpHint}</strong> (or enter 123456)
                                            </p>
                                        )}
                                    </div>
                                )}

                                {otpVerified && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem 1rem', borderRadius: '12px', color: '#16a34a' }}>
                                        <ShieldCheck size={18} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mobile Number Verified Successfully!</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(234, 88, 12, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                                    <ImageIcon size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Step 2: Aadhaar Card Photo</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--clr-muted-foreground, #64748b)', margin: 0 }}>Upload a clear photo of your Aadhaar card for ID verification</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '100%' }}>
                                    <label 
                                        style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            height: '9rem', 
                                            border: '2px dashed var(--clr-border, #cbd5e1)', 
                                            borderRadius: '16px', 
                                            cursor: isUploading ? 'not-allowed' : 'pointer',
                                            backgroundColor: 'var(--clr-upload-bg)',
                                            transition: 'all 0.2s',
                                            padding: '1rem',
                                            textAlign: 'center'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ea580c'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
                                    >
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleAadhaarUpload} 
                                            style={{ display: 'none' }} 
                                            disabled={isUploading}
                                        />
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="animate-spin text-orange-500 mb-2" size={28} />
                                                <span style={{ fontSize: '0.85rem', color: 'var(--clr-muted-foreground, #64748b)' }}>Uploading securely...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload style={{ color: '#ea580c', marginBottom: '0.5rem' }} size={28} />
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Click to upload Aadhaar card</span>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>PNG, JPG or JPEG up to 10MB</span>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {aadhaarPreview && (
                                    <div style={{ width: '100%', marginTop: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--clr-muted-foreground, #64748b)', display: 'block', marginBottom: '0.4rem' }}>Image Preview:</span>
                                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--clr-border, #cbd5e1)', height: '8rem', backgroundColor: 'var(--clr-muted, #f1f5f9)' }}>
                                            <img src={aadhaarPreview} alt="Aadhaar Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(234, 88, 12, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                                    <UserIcon size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Step 3: User Photo Upload</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--clr-muted-foreground, #64748b)', margin: 0 }}>Upload a clear passport-size photo or selfie of yourself</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '100%' }}>
                                    <label 
                                        style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            height: '9rem', 
                                            border: '2px dashed var(--clr-border, #cbd5e1)', 
                                            borderRadius: '16px', 
                                            cursor: isUploading ? 'not-allowed' : 'pointer',
                                            backgroundColor: 'var(--clr-upload-bg)',
                                            transition: 'all 0.2s',
                                            padding: '1rem',
                                            textAlign: 'center'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ea580c'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
                                    >
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleUserPhotoUpload} 
                                            style={{ display: 'none' }} 
                                            disabled={isUploading}
                                        />
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="animate-spin text-orange-500 mb-2" size={28} />
                                                <span style={{ fontSize: '0.85rem', color: 'var(--clr-muted-foreground, #64748b)' }}>Uploading securely...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload style={{ color: '#ea580c', marginBottom: '0.5rem' }} size={28} />
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Click to upload your photo</span>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>PNG, JPG or JPEG up to 10MB</span>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {userPhotoPreview && (
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', marginTop: '0.5rem' }}>
                                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #ea580c', flexShrink: 0, backgroundColor: 'var(--clr-muted, #f1f5f9)' }}>
                                            <img src={userPhotoPreview} alt="User Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-muted-foreground, #64748b)', display: 'block' }}>Photo Preview</span>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={makeProfilePic} 
                                                    onChange={(e) => setMakeProfilePic(e.target.checked)} 
                                                    style={{ width: '16px', height: '16px', accentColor: '#ea580c' }}
                                                />
                                                Make this my profile picture
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Step 4: Final Review</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--clr-muted-foreground, #64748b)', margin: 0 }}>Verify details before submitting</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--clr-review-bg)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--clr-border, #e2e8f0)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--clr-border, #f1f5f9)', paddingBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--clr-muted-foreground, #64748b)', fontWeight: 500 }}>Mobile Number</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <CheckCircle2 size={12} />
                                        +91 {phoneNumber}
                                    </span>
                                </div>
                                <div style={{ borderBottom: '1px solid var(--clr-border, #f1f5f9)', paddingBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--clr-muted-foreground, #64748b)', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Aadhaar Preview</span>
                                    <div style={{ height: '3.5rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--clr-border, #cbd5e1)', width: '6rem', backgroundColor: 'var(--clr-muted, #e2e8f0)' }}>
                                        <img src={aadhaarPreview} alt="Aadhaar final" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div style={{ borderBottom: '1px solid var(--clr-border, #f1f5f9)', paddingBottom: '0.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--clr-muted-foreground, #64748b)', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>User Photo</span>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #ea580c', backgroundColor: 'var(--clr-muted, #e2e8f0)' }}>
                                            <img src={userPhotoPreview} alt="User final" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--clr-muted-foreground, #64748b)', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Selected Profile Photo</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ea580c' }}>
                                            {makeProfilePic ? 'New Uploaded Photo' : (user.googleProfilePhoto ? 'Google Photo' : 'Initials Avatar')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Controls */}
                <div style={{ position: 'relative', zIndex: 10, padding: '1.25rem 2rem 1.5rem', borderTop: '1px solid var(--clr-border, #e2e8f0)', display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={handleBack}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '12px', border: '1px solid var(--clr-border, #e2e8f0)', color: 'inherit', fontWeight: 600, cursor: 'pointer', backgroundColor: 'var(--clr-muted, #f1f5f9)', transition: 'all 0.2s' }}
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.5rem', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', backgroundColor: '#ea580c', transition: 'all 0.2s' }}
                        >
                            Next Step
                            <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleFinalConfirm}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.5rem', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 800, cursor: isSubmitting ? 'not-allowed' : 'pointer', backgroundColor: '#22c55e', transition: 'all 0.2s', boxShadow: '0 8px 20px -4px rgba(34, 197, 94, 0.4)' }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={16} />
                                    Confirm &amp; Submit
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
            
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}
