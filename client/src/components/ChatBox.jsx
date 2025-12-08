// // import React, { useEffect, useRef, useState } from "react";
// // import { useAppContext } from "../context/AppContext";
// // import { assets } from "../assets/assets";
// // import Message from "./Message";
// // import toast from "react-hot-toast";

// // const ChatBox = () => {
// //   const containerRef = useRef(null);

// //   const { selectedChat, theme, user, token } = useAppContext();

// //   const [messages, setMessages] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [prompt, setPrompt] = useState("");
// //   const [mode, setMode] = useState("text");
// //   const [isPublished, setIsPublished] = useState(false);

// //   const onSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!user) return toast("Login to send message");

// //     const promptCopy = prompt.trim();
// //     if (!promptCopy) return;

// //     // Show user message immediately
// //     setMessages(prev => [
// //       ...prev,
// //       {
// //         role: "user",
// //         content: promptCopy,
// //         timestamp: Date.now()
// //       }
// //     ]);

// //     setLoading(true);
// //     setPrompt("");

    

// //     try {
// //       const res = await fetch("http://localhost:8000/v1/message", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json"
// //         },
// //         body: JSON.stringify({
// //           user_id: user?._id || user?.id,
// //           message: promptCopy
// //         })
// //       });

// //       let data;
// //       try {
// //         data = await res.json();
// //       } catch {
// //         toast.error("Server returned no JSON");
// //         return;
// //       }

// //       if (data.blocked) {
// //         setMessages(prev => [
// //           ...prev,
// //           {
// //             role: "assistant",
// //             blocked: true,
// //             type: data.block_type,
// //             content: data.message || "Request blocked for safety",
// //             reason: data.output_warning,
// //             timestamp: Date.now()
// //           }
// //         ]);

// //         toast.error(data.output_warning || "Blocked by safety");
// //         return;
// //       }

// //       if (data.output_warning) {
// //         toast(data.output_warning);
// //       }

// //       if (data.llm_text) {
// //         setMessages(prev => [
// //           ...prev,
// //           {
// //             role: "assistant",
// //             content: data.llm_text,
// //             timestamp: Date.now(),
// //             type: "normal"
// //           }
// //         ]);
// //       }
// //     } catch (error) {
// //       toast.error(error?.message || "Network error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };



// //   useEffect(() => {
// //     if (selectedChat) {
// //       setMessages(selectedChat.messages || []);
// //     }
// //   }, [selectedChat]);

// //   useEffect(() => {
// //     if (containerRef.current) {
// //       containerRef.current.scrollTo({
// //         top: containerRef.current.scrollHeight,
// //         behavior: "smooth",
// //       });
// //     }
// //   }, [messages]);

// //   return (
// //     <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
// //       {/* CHAT MESSAGES */}
// //       <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
// //         {messages.length === 0 && (
// //           <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
// //             <img
// //               src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
// //               alt=""
// //               className="w-full max-w-56 sm:max-w-68"
// //             />
// //             <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
// //               Ask me anything.
// //             </p>
// //           </div>
// //         )}

// //         {messages.map((m, i) => (
// //           <Message key={i} message={m} />
// //         ))}

// //         {loading && (
// //           <div className="loader flex items-center gap-1.5">
// //             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
// //             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
// //             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
// //           </div>
// //         )}
// //       </div>

// //       {mode === "image" && (
// //         <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
// //           <p className="text-xs">Publish Generated Image to Community</p>
// //           <input
// //             type="checkbox"
// //             checked={isPublished}
// //             onChange={(e) => setIsPublished(e.target.checked)}
// //           />
// //         </label>
// //       )}

// //       {/* INPUT FORM */}
// //       <form
// //         onSubmit={onSubmit}
// //         className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
// //       >
// //         <select
// //           className="text-sm pl-3 pr-2 outline-none"
// //           value={mode}
// //           onChange={(e) => setMode(e.target.value)}
// //         >
// //           <option value="text">Text</option>
// //           <option value="image">Image</option>
// //         </select>

// //         <input
// //           className="flex-1 w-full text-sm outline-none"
// //           type="text"
// //           value={prompt}
// //           onChange={(e) => setPrompt(e.target.value)}
// //           placeholder="Type your prompt here..."
// //           required
// //         />

// //         <button disabled={loading}>
// //           <img
// //             src={loading ? assets.stop_icon : assets.send_icon}
// //             className="w-8 cursor-pointer"
// //             alt=""
// //           />
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default ChatBox;
// // // // import React, { useEffect, useRef, useState } from "react";
// // // // import { useAppContext } from "../context/AppContext";
// // // // import { assets } from "../assets/assets";
// // // // import Message from "./Message";
// // // // import toast from "react-hot-toast";

// // // // const ChatBox = () => {
// // // //   const containerRef = useRef(null);
// // // //   const { selectedChat, theme, user, token } = useAppContext();

// // // //   const [messages, setMessages] = useState([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [prompt, setPrompt] = useState("");
// // // //   const [mode, setMode] = useState("text");
// // // //   const [isPublished, setIsPublished] = useState(false);

// // // //   const onSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!user) return toast("Login to send message");

// // // //     const promptCopy = prompt.trim();
// // // //     if (!promptCopy) return;

// // // //     setLoading(true);
// // // //     setPrompt("");

// // // //     // Show user message instantly
// // // //     setMessages((prev) => [
// // // //       ...prev,
// // // //       {
// // // //         role: "user",
// // // //         content: promptCopy,
// // // //         timestamp: Date.now(),
// // // //         isImage: false,
// // // //       },
// // // //     ]);

// // // //     const endpoint =
// // // //       mode === "text"
// // // //         ? "http://localhost:3000/api/message/text"
// // // //         : "http://localhost:3000/api/message/image";

// // // //     try {
// // // //       const res = await fetch(endpoint, {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: `Bearer ${token}`,
// // // //         },
// // // //         body: JSON.stringify({
// // // //           chatId: selectedChat?._id,
// // // //           userId: user?._id || user?.id,
// // // //           prompt: promptCopy,
// // // //           isPublished,
// // // //         }),
// // // //       });

// // // //       let data;

// // // //       // Always try to parse JSON, even for errors
// // // //       try {
// // // //         data = await res.json();
// // // //       } catch {
// // // //         toast.error("Server returned invalid response");
// // // //         setLoading(false);
// // // //         return;
// // // //       }

// // // //       // Handle blocked messages
// // // //       if (data.blocked) {
// // // //         setMessages((prev) => [
// // // //           ...prev,
// // // //           {
// // // //             role: "assistant",
// // // //             blocked: true,
// // // //             reason: data.reason || data.message || "Request blocked for safety",
// // // //             timestamp: Date.now(),
// // // //           },
// // // //         ]);
// // // //         toast.error(data.reason || data.message || "Request blocked for safety");
// // // //         setLoading(false);
// // // //         return;
// // // //       }

// // // //       // Handle non-200 errors that are not blocked
// // // //       if (!res.ok) {
// // // //         toast.error(data.message || "Something went wrong");
// // // //         setLoading(false);
// // // //         return;
// // // //       }

// // // //       // Handle normal messages
// // // //       if (data.reply) {
// // // //         setMessages((prev) => [...prev, data.reply]);
// // // //       }

// // // //       // Handle user warnings
// // // //       if (data.userWarning?.message) {
// // // //         toast(data.userWarning.message);
// // // //       }

// // // //       // Handle any other unsuccessful responses
// // // //       if (data.success === false) {
// // // //         toast.error(data.message || "Something went wrong");
// // // //       }
// // // //     } catch (error) {
// // // //       toast.error(error?.message || "Error sending message");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     if (selectedChat) setMessages(selectedChat.messages || []);
// // // //   }, [selectedChat]);

// // // //   useEffect(() => {
// // // //     if (containerRef.current) {
// // // //       containerRef.current.scrollTo({
// // // //         top: containerRef.current.scrollHeight,
// // // //         behavior: "smooth",
// // // //       });
// // // //     }
// // // //   }, [messages]);

// // // //   return (
// // // //     <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
// // // //       <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
// // // //         {messages.length === 0 && (
// // // //           <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
// // // //             <img
// // // //               src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
// // // //               alt=""
// // // //               className="w-full max-w-56 sm:max-w-68"
// // // //             />
// // // //             <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
// // // //               Ask me anything.
// // // //             </p>
// // // //           </div>
// // // //         )}

// // // //         {messages.map((m, i) => (
// // // //           <Message key={i} message={m} />
// // // //         ))}

// // // //         {loading && (
// // // //           <div className="loader flex items-center gap-1.5">
// // // //             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
// // // //             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
// // // //             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {mode === "image" && (
// // // //         <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
// // // //           <p className="text-xs">Publish Generated Image to Community</p>
// // // //           <input
// // // //             type="checkbox"
// // // //             checked={isPublished}
// // // //             onChange={(e) => setIsPublished(e.target.checked)}
// // // //           />
// // // //         </label>
// // // //       )}

// // // //       <form
// // // //         onSubmit={onSubmit}
// // // //         className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
// // // //       >
// // // //         <select
// // // //           className="text-sm pl-3 pr-2 outline-none"
// // // //           value={mode}
// // // //           onChange={(e) => setMode(e.target.value)}
// // // //         >
// // // //           <option value="text">Text</option>
// // // //           <option value="image">Image</option>
// // // //         </select>

// // // //         <input
// // // //           className="flex-1 w-full text-sm outline-none"
// // // //           type="text"
// // // //           value={prompt}
// // // //           onChange={(e) => setPrompt(e.target.value)}
// // // //           placeholder="Type your prompt here..."
// // // //           required
// // // //         />

// // // //         <button disabled={loading}>
// // // //           <img
// // // //             src={loading ? assets.stop_icon : assets.send_icon}
// // // //             className="w-8 cursor-pointer"
// // // //             alt=""
// // // //           />
// // // //         </button>
// // // //       </form>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ChatBox;
// // // import React, { useEffect, useRef, useState } from "react";
// // // import { useAppContext } from "../context/AppContext";
// // // import { assets } from "../assets/assets";
// // // import Message from "./Message";
// // // import toast from "react-hot-toast";

// // // const ChatBox = () => {
// // //   const containerRef = useRef(null);
// // //   const { selectedChat, theme, user, token } = useAppContext();

// // //   const [messages, setMessages] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [prompt, setPrompt] = useState("");
// // //   const [mode, setMode] = useState("text");
// // //   const [isPublished, setIsPublished] = useState(false);

// // //   const onSubmit = async (e) => {
// // //     e.preventDefault();
// // //     if (!user) return toast("Login to send message");

// // //     const promptCopy = prompt.trim();
// // //     if (!promptCopy) return;

// // //     // 🔥 Frontend blocking
// // //     const lower = promptCopy.toLowerCase();
// // //     const blockedPatterns = [
// // //       "ignore the above directions",
// // //       "translate as",
// // //       "bypass",
// // //       "jailbreak",
// // //       "do anything now",
// // //     ];
// // //     const isBlocked = blockedPatterns.some((pattern) => lower.includes(pattern));
// // //     if (isBlocked) {
// // //       setMessages((prev) => [
// // //         ...prev,
// // //         {
// // //           role: "assistant",
// // //           blocked: true,
// // //           reason: "Prompt blocked by proxy server safety rules",
// // //           timestamp: Date.now(),
// // //         },
// // //       ]);
// // //       toast.error("Prompt blocked for safety");
// // //       setPrompt("");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setPrompt("");

// // //     // Show user message instantly
// // //     setMessages((prev) => [
// // //       ...prev,
// // //       {
// // //         role: "user",
// // //         content: promptCopy,
// // //         timestamp: Date.now(),
// // //         isImage: false,
// // //       },
// // //     ]);

// // //     const endpoint =
// // //       mode === "text"
// // //         ? "http://localhost:3000/api/message/text"
// // //         : "http://localhost:3000/api/message/image";

// // //     try {
// // //       const res = await fetch(endpoint, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify({
// // //           chatId: selectedChat?._id,
// // //           userId: user?._id || user?.id,
// // //           prompt: promptCopy,
// // //           isPublished,
// // //         }),
// // //       });

// // //       let data;
// // //       try {
// // //         data = await res.json();
// // //       } catch {
// // //         toast.error("Server returned invalid response");
// // //         setLoading(false);
// // //         return;
// // //       }

// // //       // Backend blocks
// // //       if (data.blocked) {
// // //         setMessages((prev) => [
// // //           ...prev,
// // //           {
// // //             role: "assistant",
// // //             blocked: true,
// // //             reason: data.reason || data.message || "Request blocked for safety",
// // //             timestamp: Date.now(),
// // //           },
// // //         ]);
// // //         toast.error(data.reason || data.message || "Request blocked for safety");
// // //         setLoading(false);
// // //         return;
// // //       }

// // //       if (!res.ok) {
// // //         toast.error(data.message || "Something went wrong");
// // //         setLoading(false);
// // //         return;
// // //       }

// // //       if (data.reply) setMessages((prev) => [...prev, data.reply]);
// // //       if (data.userWarning?.message) toast(data.userWarning.message);
// // //       if (data.success === false) toast.error(data.message || "Something went wrong");
// // //     } catch (error) {
// // //       toast.error(error?.message || "Error sending message");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (selectedChat) setMessages(selectedChat.messages || []);
// // //   }, [selectedChat]);

// // //   useEffect(() => {
// // //     if (containerRef.current) {
// // //       containerRef.current.scrollTo({
// // //         top: containerRef.current.scrollHeight,
// // //         behavior: "smooth",
// // //       });
// // //     }
// // //   }, [messages]);

// // //   return (
// // //     <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
// // //       <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
// // //         {messages.length === 0 && (
// // //           <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
// // //             <img
// // //               src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
// // //               alt=""
// // //               className="w-full max-w-56 sm:max-w-68"
// // //             />
// // //             <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
// // //               Ask me anything.
// // //             </p>
// // //           </div>
// // //         )}

// // //         {messages.map((m, i) => (
// // //           <Message key={i} message={m} />
// // //         ))}

// // //         {loading && (
// // //           <div className="loader flex items-center gap-1.5">
// // //             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
// // //             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
// // //             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
// // //           </div>
// // //         )}
// // //       </div>

// // //       {mode === "image" && (
// // //         <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
// // //           <p className="text-xs">Publish Generated Image to Community</p>
// // //           <input
// // //             type="checkbox"
// // //             checked={isPublished}
// // //             onChange={(e) => setIsPublished(e.target.checked)}
// // //           />
// // //         </label>
// // //       )}

// // //       <form
// // //         onSubmit={onSubmit}
// // //         className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
// // //       >
// // //         <select
// // //           className="text-sm pl-3 pr-2 outline-none"
// // //           value={mode}
// // //           onChange={(e) => setMode(e.target.value)}
// // //         >
// // //           <option value="text">Text</option>
// // //           <option value="image">Image</option>
// // //         </select>

// // //         <input
// // //           className="flex-1 w-full text-sm outline-none"
// // //           type="text"
// // //           value={prompt}
// // //           onChange={(e) => setPrompt(e.target.value)}
// // //           placeholder="Type your prompt here..."
// // //           required
// // //         />

// // //         <button disabled={loading}>
// // //           <img
// // //             src={loading ? assets.stop_icon : assets.send_icon}
// // //             className="w-8 cursor-pointer"
// // //             alt=""
// // //           />
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // };

// // // export default ChatBox;
// import React, { useEffect, useRef, useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import Message from "./Message";
// import toast from "react-hot-toast";

// const ChatBox = () => {
//   const containerRef = useRef(null);

//   const { selectedChat, theme, user } = useAppContext();

//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [prompt, setPrompt] = useState("");

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) return toast.error("Login to send message");

//     const promptCopy = prompt.trim();
//     if (!promptCopy) return;

//     // Show user message immediately
//     setMessages((prev) => [
//       ...prev,
//       {
//         role: "user",
//         content: promptCopy,
//         timestamp: Date.now(),
//       },
//     ]);

//     setLoading(true);
//     setPrompt("");

//     try {
//       const res = await fetch("http://localhost:8000/v1/message", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: user?._id || user?.id,
//           message: promptCopy,
//         }),
//       });

//       let data;
//       try {
//         data = await res.json();
//       } catch {
//         toast.error("Invalid server response");
//         return;
//       }

//       // -------------------------------
//       // 🔥 BLOCKED RESPONSE HANDLING
//       // -------------------------------
//       if (data.blocked) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             blocked: true,
//             type: data.block_type,
//             content: data.message || "Request blocked for safety.",
//             reason: data.reason || data.block_type,
//             timestamp: Date.now(),
//           },
//         ]);

//         toast.error(data.message || "Blocked for safety");
//         return;
//       }

//       // -------------------------------
//       // 🔥 USER WARNING FROM INPUT_ANALYSIS
//       // -------------------------------
//       if (data.user_notification) {
//         toast(data.user_notification.message);
//       }

//       // -------------------------------
//       // 🔥 OUTPUT WARNING
//       // -------------------------------
//       if (data.output_warning) {
//         toast(data.output_warning.message);
//       }

//       // -------------------------------
//       // 🔥 NORMAL ASSISTANT MESSAGE
//       // -------------------------------
//       if (data.llm_text) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content: data.llm_text,
//             timestamp: Date.now(),
//             type: "normal",
//           },
//         ]);
//       }
//     } catch (err) {
//       toast.error(err?.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load chat history when a chat is selected
//   useEffect(() => {
//     if (selectedChat) {
//       setMessages(selectedChat.messages || []);
//     }
//   }, [selectedChat]);

//   // Auto-scroll
//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollTo({
//         top: containerRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages]);

//   return (
//     <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">

//       {/* CHAT MESSAGES */}
//       <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
//         {messages.length === 0 && (
//           <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
//             <img
//               src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
//               alt=""
//               className="w-full max-w-56 sm:max-w-68"
//             />
//             <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
//               Ask me anything.
//             </p>
//           </div>
//         )}

//         {messages.map((m, i) => (
//           <Message key={i} message={m} />
//         ))}

//         {loading && (
//           <div className="loader flex items-center gap-1.5">
//             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
//             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
//             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
//           </div>
//         )}
//       </div>

//       {/* INPUT FORM */}
//       <form
//         onSubmit={onSubmit}
//         className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
//       >
//         <input
//           className="flex-1 w-full text-sm outline-none"
//           type="text"
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Type your prompt here..."
//           required
//         />

//         <button disabled={loading}>
//           <img
//             src={loading ? assets.stop_icon : assets.send_icon}
//             className="w-8 cursor-pointer"
//             alt=""
//           />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBox;
import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const ChatBox = () => {
  const containerRef = useRef(null);
  const { selectedChat, theme, user, token } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast("Login to send message");

    const promptCopy = prompt.trim();
    if (!promptCopy) return;

    // ------------------ 🔴 FRONTEND SAFETY BLOCKING ------------------
    const normalized = promptCopy.toLowerCase();

    const jailbreakTriggers = [
      "ignore previous instructions",
      "ignore all instructions",
      "system prompt",
      "override safety",
      "do anything now",
      "jailbreak",
      "bypass",
      "break free"
    ];

    const isJailbreak = jailbreakTriggers.some(trigger =>
      normalized.includes(trigger)
    );

    if (isJailbreak) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          blocked: true,
          type: "block",
          content: "This request is blocked to prevent policy manipulation attempts.",
          reason: "Detected jailbreak manipulation attempt",
          timestamp: Date.now()
        }
      ]);
      toast.error("Blocked by safety rules");
      setPrompt("");
      return;
    }
    // ----------------------------------------------------------------

    setLoading(true);
    setPrompt("");

    // Show the user message in UI instantly
    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: promptCopy,
        timestamp: Date.now()
      }
    ]);

    const endpoint =
      mode === "text"
        ? "http://localhost:3000/api/message/text"
        : "http://localhost:3000/api/message/image";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          chatId: selectedChat?._id,
          userId: user?._id || user?.id,
          prompt: promptCopy,
          isPublished
        })
      });

      let data;
      try {
        data = await res.json();
      } catch {
        toast.error("Invalid server response");
        setLoading(false);
        return;
      }

      if (data.blocked) {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            blocked: true,
            type: "backend-block",
            content: data.message || "Blocked for safety",
            reason: data.reason,
            timestamp: Date.now()
          }
        ]);
        toast.error(data.reason || "Blocked by server safety");
        setLoading(false);
        return;
      }

      if (data.reply) {
        setMessages(prev => [...prev, data.reply]);
      }

      if (data.userWarning?.message) toast(data.userWarning.message);
      if (data.success === false) toast.error(data.message || "Something went wrong");

    } catch (err) {
      toast.error(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) setMessages(selectedChat.messages || []);
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt=""
              className="w-full max-w-56 sm:max-w-68"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me anything.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <Message key={i} message={m} />
        ))}

        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <select
          className="text-sm pl-3 pr-2 outline-none"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>

        <input
          className="flex-1 w-full text-sm outline-none"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          required
        />

        <button disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            className="w-8 cursor-pointer"
            alt=""
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
