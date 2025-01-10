import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, updatePassword } from "../../features/auth/profileSlice.ts";
import { RootState } from "../../store";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state: RootState) => state.profile);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    bio: user?.bio || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleUpdateProfile = () => {
    dispatch(updateProfile(profileData));
  };

  const handleUpdatePassword = () => {
    dispatch(updatePassword(passwordData));
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div>
        <h2>Update Profile</h2>
        <input
          type="text"
          placeholder="Name"
          value={profileData.name}
          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Username"
          value={profileData.username}
          onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
        />
        <textarea
          placeholder="Bio"
          value={profileData.bio}
          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
        ></textarea>
        <button onClick={handleUpdateProfile} disabled={loading}>
          Update Profile
        </button>
      </div>

      <div>
        <h2>Update Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          value={passwordData.currentPassword}
          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
        />
        <input
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
        />
        <button onClick={handleUpdatePassword} disabled={loading}>
          Update Password
        </button>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProfilePage;
