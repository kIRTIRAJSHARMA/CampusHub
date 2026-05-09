import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiInbox, FiMessageCircle, FiSend } from "react-icons/fi";
import JsonAnimation from "../../components/animations/JsonAnimation";
import SectionHeader from "../../components/common/SectionHeader";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { getAvatar } from "../../utils/avatar";
import emptyStateAnimation from "../../assets/animations/emptyState.json";

const getUserId = (user) => user?.id || user?._id;

const getListing = (conversation) => conversation.product || conversation.room;

const getOtherUser = (conversation, userId) => {
  const senderId = conversation.sender?._id || conversation.sender?.id;
  return senderId?.toString() === userId?.toString() ? conversation.receiver : conversation.sender;
};

const formatTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const Messages = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(searchParams.get("thread") || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const userId = getUserId(user);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedId) || conversations[0],
    [conversations, selectedId]
  );

  const loadConversations = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/inquiries");
      setConversations(data);
      const requestedThread = searchParams.get("thread");
      if (requestedThread && data.some((item) => item._id === requestedThread)) {
        setSelectedId(requestedThread);
      } else if (!selectedId && data[0]?._id) {
        setSelectedId(data[0]._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, searchParams]);

  useEffect(() => {
    const thread = searchParams.get("thread") || "";
    if (thread) setSelectedId(thread);
  }, [searchParams]);

  useEffect(() => {
    if (!selectedConversation?._id) return;

    const selectedHasUnread = selectedConversation.unreadFor?.some((id) => (id?._id || id)?.toString() === userId);
    if (selectedHasUnread) {
      api.put(`/inquiries/${selectedConversation._id}/read`)
        .then(({ data }) => {
          setConversations((current) => current.map((item) => item._id === data._id ? data : item));
        })
        .catch(() => {});
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [selectedConversation?._id, selectedConversation?.messages?.length, userId]);

  const selectConversation = (id) => {
    setSelectedId(id);
    setSearchParams({ thread: id });
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const cleanMessage = message.trim();
    if (!cleanMessage || !selectedConversation?._id) return;

    setSending(true);
    try {
      const { data } = await api.post(`/inquiries/${selectedConversation._id}/messages`, { message: cleanMessage });
      setConversations((current) => {
        const withoutUpdated = current.filter((item) => item._id !== data._id);
        return [data, ...withoutUpdated];
      });
      setSelectedId(data._id);
      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send message");
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container-page py-10">
        <div className="card mx-auto max-w-xl p-8 text-center">
          <JsonAnimation animation={emptyStateAnimation} size="h-40 w-full" />
          <FiMessageCircle className="mx-auto text-4xl text-blue-600" />
          <h1 className="mt-4 text-2xl font-extrabold">Login to view messages</h1>
          <p className="mt-2 text-sm text-slate-600">Your buyer and seller conversations appear here after you contact a listing.</p>
          <Link to="/login" className="btn-primary mt-6">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <SectionHeader title="Messages" description="Buyer and seller conversations for products, rooms, bookings, and listing questions." />

      <div className="grid min-h-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft lg:grid-cols-[360px_1fr]">
        <aside className="border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h2 className="font-extrabold text-slate-950">Inbox</h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">{conversations.length} chats</span>
          </div>

          <div className="max-h-[620px] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm font-bold text-slate-500">Loading conversations...</div>
            ) : conversations.length ? conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation, userId);
              const listing = getListing(conversation);
              const unread = conversation.unreadFor?.some((id) => (id?._id || id)?.toString() === userId);
              const active = selectedConversation?._id === conversation._id;

              return (
                <button
                  key={conversation._id}
                  onClick={() => selectConversation(conversation._id)}
                  className={`grid w-full grid-cols-[44px_1fr] gap-3 border-b border-slate-200 p-4 text-left transition ${active ? "bg-white" : "hover:bg-white"} ${unread ? "font-extrabold" : ""}`}
                >
                  <img src={getAvatar(otherUser)} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <span className="min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-slate-950">{otherUser?.name || "CampusHub user"}</span>
                      {unread && <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />}
                    </span>
                    <span className="mt-1 block truncate text-xs font-bold text-blue-600">{listing?.title || "CampusHub listing"}</span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{conversation.lastMessage || conversation.message}</span>
                  </span>
                </button>
              );
            }) : (
              <div className="grid place-items-center p-8 text-center">
                <JsonAnimation animation={emptyStateAnimation} size="h-40 w-full" />
                <FiInbox className="text-4xl text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-600">No conversations yet</p>
                <p className="mt-1 text-xs text-slate-500">Contact a seller from a product or room page to start chatting.</p>
              </div>
            )}
          </div>
        </aside>

        <section className="flex min-h-[680px] flex-col">
          {selectedConversation ? (
            <>
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button onClick={() => setSelectedId("")} className="rounded-xl border border-slate-200 p-2 lg:hidden" aria-label="Back to inbox">
                    <FiArrowLeft />
                  </button>
                  <img src={getAvatar(getOtherUser(selectedConversation, userId))} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <div className="min-w-0">
                    <h2 className="truncate font-extrabold text-slate-950">{getOtherUser(selectedConversation, userId)?.name || "CampusHub user"}</h2>
                    <p className="truncate text-sm text-slate-500">{getListing(selectedConversation)?.title || "CampusHub listing"}</p>
                  </div>
                </div>
                {(selectedConversation.product?._id || selectedConversation.room?._id) && (
                  <Link
                    to={selectedConversation.product ? `/products/${selectedConversation.product._id}` : `/rooms/${selectedConversation.room._id}`}
                    className="hidden rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 sm:inline-flex"
                  >
                    View Listing
                  </Link>
                )}
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
                {(selectedConversation.messages?.length ? selectedConversation.messages : [{ sender: selectedConversation.sender, body: selectedConversation.message, createdAt: selectedConversation.createdAt }]).map((chatMessage, index) => {
                  const senderId = chatMessage.sender?._id || chatMessage.sender?.id || chatMessage.sender;
                  const mine = senderId?.toString() === userId;

                  return (
                    <div key={chatMessage._id || `${selectedConversation._id}-${index}`} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${mine ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>
                        <p className="text-sm leading-6">{chatMessage.body}</p>
                        <p className={`mt-2 text-[11px] ${mine ? "text-blue-100" : "text-slate-400"}`}>{formatTime(chatMessage.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="border-t border-slate-200 bg-white p-4">
                <div className="flex gap-3">
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage(event);
                      }
                    }}
                    className="input-field min-h-12 resize-none"
                    placeholder="Type your message..."
                    required
                  />
                  <button type="submit" disabled={sending || !message.trim()} className="btn-primary px-4 disabled:cursor-not-allowed disabled:opacity-60">
                    <FiSend />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-center">
              <div>
                <JsonAnimation animation={emptyStateAnimation} size="h-44 w-full" />
                <FiMessageCircle className="mx-auto text-5xl text-slate-300" />
                <h2 className="mt-4 text-xl font-extrabold">Select a conversation</h2>
                <p className="mt-2 text-sm text-slate-500">Messages with buyers and sellers will open here.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Messages;
