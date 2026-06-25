export const getUserAvatarUrl = (user: any) => {
    if (!user) return null;
    
    // Priority 1: User selected profile picture
    if (user.profilePicturePreference === 'selected' && user.userPhoto) {
        if (user.userPhoto.startsWith('http') || user.userPhoto.startsWith('data:') || user.userPhoto.startsWith('/')) {
            return user.userPhoto.startsWith('/uploads') ? `http://localhost:5000${user.userPhoto}` : user.userPhoto;
        }
        return `http://localhost:5000/uploads/${user.userPhoto}`;
    }

    // Priority 2: Google profile picture
    if (user.googleProfilePhoto) {
        return user.googleProfilePhoto;
    }

    // Fallback profileImage
    if (user.profileImage) {
        if (user.profileImage.startsWith('http') || user.profileImage.startsWith('data:') || user.profileImage.startsWith('/')) {
            return user.profileImage.startsWith('/uploads') ? `http://localhost:5000${user.profileImage}` : user.profileImage;
        }
        return `http://localhost:5000/uploads/${user.profileImage}`;
    }

    return null;
};
