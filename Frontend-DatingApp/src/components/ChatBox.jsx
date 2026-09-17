export default function ChatBox() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-gray-200 p-2 rounded-lg w-fit mb-2">
          Hi 👋
        </div>
        <div className="bg-pink-500 text-white p-2 rounded-lg w-fit ml-auto">
          Hello ❤️
        </div>
      </div>

      <div className="p-4 flex">
        <input className="flex-1 border rounded-l px-3 py-2" />
        <button className="bg-pink-500 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}