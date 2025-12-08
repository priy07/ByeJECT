import React from "react";

const actionColors = {
  accept: "text-green-600 bg-green-100 border-green-300",
  alter: "text-blue-600 bg-blue-100 border-blue-300",
  warning: "text-yellow-700 bg-yellow-100 border-yellow-300",
  reject: "text-red-600 bg-red-100 border-red-300",
  block: "text-red-700 bg-red-200 border-red-400",
};

const LogsTable = ({ logs = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-auto">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Moderation Logs
      </h2>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b bg-black text-white">
            <th className="p-3 text-left">Action</th>
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">Prompt</th>
            <th className="p-3 text-left">Altered</th>
            <th className="p-3 text-left">Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, idx) => {
            const actionKey = log?.action?.toLowerCase() || "accept";
            const colorClass = actionColors[actionKey] || actionColors.accept;

            const displayedReason =
              log.reason && log.reason.trim() !== ""
                ? log.reason
                : actionKey === "warning"
                ? "Potential sensitive content"
                : "Safe";

            const promptText =
              log.altered && log.sanitized_prompt
                ? log.sanitized_prompt
                : log.prompt;

            const formattedTime =
              log.timestamp && !log.timestamp.includes("Invalid")
                ? new Date(log.timestamp).toLocaleString()
                : "Unknown";

            return (
              <tr
                key={log.id || log.request_id || idx}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm border ${colorClass}`}
                  >
                    {actionKey}
                  </span>
                </td>

                <td className="p-3 w-64 text-sm text-gray-700">
                  {displayedReason}
                </td>

                <td className="p-3 w-80 text-sm text-gray-600 line-clamp-2">
                  {promptText}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      log.altered
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {log.altered ? "Yes" : "No"}
                  </span>
                </td>

                <td className="p-3 text-sm text-gray-500">{formattedTime}</td>
              </tr>
            );
          })}

          {logs.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="p-6 text-center text-gray-500 text-sm"
              >
                No logs available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable;
