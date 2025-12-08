import React, { useEffect, useState } from "react";
import StatsCards from "../components/StatsCards";
import TimelineChart from "../components/TimelineChart";
import LogsTable from "../components/LogsTable";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [logsToShow, setLogsToShow] = useState(5);

  useEffect(() => {
    fetchStats();
    fetchTimeline();
    fetchLogs();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get("/api/moderation/stats");
    setStats(res.data);
  };

  const fetchTimeline = async () => {
    const res = await axios.get("/api/moderation/timeline");
    setTimeline(res.data);
  };

  const fetchLogs = async () => {
    const res = await axios.get("/api/moderation/logs?limit=25");
    setLogs(res.data);
  };

  const handleAction = async (log, newAction) => {
    try {
      await axios.post("/api/moderation/update", {
        id: log.id,
        action: newAction,
      });

      setLogs((prevLogs) =>
        prevLogs.map((item) =>
          item.id === log.id ? { ...item, action: newAction } : item
        )
      );

      fetchStats();
      fetchTimeline();
    } catch (err) {
      console.error("Failed to update action:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <StatsCards stats={stats} />

      {/* Moderation Timeline and Logs side by side */}
      <div className="flex items-start gap-6">
        <div style={{ flex: 1, height: '340px', background: '#fff', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2rem', overflow: 'auto' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#000' }}>Moderation Timeline</h2>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {showLogs ? "Hide Logs" : "Show Logs"}
            </button>
          </div>
          <TimelineChart data={timeline} />
        </div>
        {showLogs && (
          <div style={{ flex: 1, minWidth: '340px', maxWidth: '500px' }}>
            <LogsTable logs={logs.slice(0, logsToShow)} />
            {logsToShow < logs.length && (
              <button
                className="mt-4 px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 w-full"
                onClick={() => setLogsToShow(logsToShow + 5)}
              >
                Show More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
