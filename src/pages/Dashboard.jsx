import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import { Search, Bell, ArrowUpRight } from "lucide-react";
import {
  Zap,
  CircleCheck,
  Activity,
  CircleX,
} from "lucide-react";
import WeeklyRunsChart from '../components/WeeklyRunsChart';

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-container">
        <div className="header">
          <h3>Dashboard</h3>
          <div className="searchbar">
            <Search id="search-icon" />
            <input placeholder="Search..."
              type="text" />
          </div>
          <Bell id="bell" />
        </div>
        <div className="analytics">
          <div className="upper-cards">
            <div className="card">
              <Zap id="upper-icons" size={40} color="#a3e635" />
              <h1>6</h1>
              <p>Total Automations</p>
            </div>
            <div className="card">
              <CircleCheck id="upper-icons" size={40} color="green" />
              <h1>5</h1>
              <p>Enabled</p>
            </div>
            <div className="card">
              <Activity id="upper-icons" size={40} color="purple" />
              <h1>47</h1>
              <p>Last 24h Runs</p>
            </div>
            <div className="card">
              <CircleX id="upper-icons" size={40} color="red" />
              <h1>3</h1>
              <p>Failed Runs</p>
            </div>
          </div>
          <div className="middle-cards">
            <div className="card1">
              <h1>Runs this week</h1>
              <p>Total executions over the last 7 days</p>
              <WeeklyRunsChart />
            </div>
            <div className="card2">
              <div className="activity-header">
                <h2>Recent Activity</h2>

                <button className="view-all-btn">
                  View all <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="activity-list">

                <div className="activity-row">
                  <div className="activity-left">
                    <span className="status-dot success-dot"></span>
                    <span className="activity-title">
                      WhatsApp Customer Support
                    </span>
                  </div>

                  <span className="activity-time">10:23 AM</span>

                  <span className="activity-status success">
                    Success
                  </span>
                </div>

                <div className="activity-row">
                  <div className="activity-left">
                    <span className="status-dot success-dot"></span>
                    <span className="activity-title">
                      Lead Qualification
                    </span>
                  </div>

                  <span className="activity-time">11:45 AM</span>

                  <span className="activity-status success">
                    Success
                  </span>
                </div>

                <div className="activity-row">
                  <div className="activity-left">
                    <span className="status-dot fail-dot"></span>
                    <span className="activity-title">
                      Slack Notification
                    </span>
                  </div>

                  <span className="activity-time">Jun 18</span>

                  <span className="activity-status failed">
                    Failed
                  </span>
                </div>

              </div>
            </div>  
          </div>
          <div className="lower-cards">
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Dashboard;
