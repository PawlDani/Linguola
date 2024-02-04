const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: 'Dashboard', id: 'Dashboard' },
    { name: 'Wordsets', id: 'Wordsets' },
    { name: 'Progress', id: 'Progress' },
    { name: 'How To', id: 'HowTo' },
    // Add more tabs here as needed
  ];

  return (
    <div className="side_bar">
      <div className="side_bar_bottom">
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
              <a href="#">
                <span className="icon"></span> {/* Add icon logic here */}
                <span className="title">{tab.name}</span>
              </a>
              {activeTab === tab.id && (
                <>
                  <div className="top_curve"></div>
                  <div className="bottom_curve"></div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
