
export interface User {
    id: number;
    username: string;
    email: string;
    profilePicture: string;
    bio: string;
    website: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
    isFollowing: boolean;
  }