import './Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard_top">
        <h2>Dashboard</h2>
        <p>Time</p>
      </div>
      <div className="dashboard_middle">
        <p>Welcome</p>
        <img src="https://via.placeholder.com/150" alt="user" />
      </div>
      <div className="dashboard_bottom">
        <h2>Recently Studied</h2>
      </div>
    </div>
  );
};

export default Dashboard;
