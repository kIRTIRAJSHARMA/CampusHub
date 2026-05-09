import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiMessageCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const formatNotificationTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef(null);

  const loadNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const { data } = await api.get("/inquiries/notifications");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-xl border border-slate-200 p-3 text-slate-700 transition hover:bg-slate-50"
        aria-label="Notifications"
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-extrabold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <h2 className="font-extrabold text-slate-950">Notifications</h2>
            <Link to="/messages" onClick={() => setOpen(false)} className="text-xs font-bold text-blue-600">Open inbox</Link>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length ? notifications.map((notification) => (
              <Link
                key={notification.id}
                to={notification.href}
                onClick={() => setOpen(false)}
                className="grid grid-cols-[36px_1fr] gap-3 border-b border-slate-100 p-4 transition last:border-0 hover:bg-slate-50"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600">
                  <FiMessageCircle />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-extrabold text-slate-950">{notification.title}</span>
                    {notification.count > 1 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-extrabold text-white">
                        {notification.count}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block truncate text-xs font-bold text-blue-600">{notification.listingTitle}</span>
                  <span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-500">{notification.body}</span>
                  <span className="mt-2 block text-[11px] font-bold text-slate-400">{formatNotificationTime(notification.createdAt)}</span>
                </span>
              </Link>
            )) : (
              <div className="p-6 text-center">
                <FiBell className="mx-auto text-3xl text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-700">No new notifications</p>
                <p className="mt-1 text-xs text-slate-500">New buyer and seller messages will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
