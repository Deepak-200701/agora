import React from 'react';

function MessageBubble({ text, sender }) {
  const isMe = sender === 'me';

  const [messages, setMessages] = React.useState([
    { id: 1, sender: "Alice", content: "Hey there!" },
    { id: 2, sender: "You", content: "Hi Alice, how are you?" },
  ]);
  
  return (

    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
          <div
            className={`px-4 py-2 rounded-lg max-w-md ${msg.sender === "You"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-900"
              }`}
          >
            <strong className="block mb-1 text-sm">{msg.sender}</strong>
            <p>{msg.content}</p>
          </div>
        </div>
      ))}
    </div>

    // <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
    //   <div
    //     className={`px-4 py-2 rounded-lg max-w-xs ${
    //       isMe ? 'bg-green-200 text-right' : 'bg-white'
    //     }`}
    //   >
    //     {text}
    //   </div>
    // </div>

    // <ul role="list" className="divide-y divide-gray-100">
    //   <li key={"person.email"} className="flex justify-between gap-x-6 py-5">
    //     <div className="flex min-w-0 gap-x-4">
    //       <img alt="" src={"person.imageUrl"} className="size-12 flex-none rounded-full bg-gray-50" />
    //       <div className="min-w-0 flex-auto">
    //         <p className="text-sm/6 font-semibold text-gray-900">{"person.name"}</p>
    //         <p className="mt-1 truncate text-xs/5 text-gray-500">{"person.email"}</p>
    //       </div>
    //     </div>
    //     <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
    //       <p className="text-sm/6 text-gray-900">{"person.role"}</p>
    //       {true ? (
    //         <p className="mt-1 text-xs/5 text-gray-500">
    //           Last seen <time dateTime={"person.lastSeenDateTime"}>{"person.lastSeen"}</time>
    //         </p>
    //       ) : (
    //         <div className="mt-1 flex items-center gap-x-1.5">
    //           <div className="flex-none rounded-full bg-emerald-500/20 p-1">
    //             <div className="size-1.5 rounded-full bg-emerald-500" />
    //           </div>
    //           <p className="text-xs/5 text-gray-500">Online</p>
    //         </div>
    //       )}
    //     </div>
    //   </li>
    // </ul>
  );
}

export default MessageBubble;
