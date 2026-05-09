export const defaultAvatar =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80";

export const getAvatar = (user) => user?.avatar || defaultAvatar;
