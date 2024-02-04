import maxLogo from '/src/assets/images/max-logo.png'; // Ścieżka do logo

// Komponent paska bocznego
const Sidebar = ({ activeTab, setActiveTab }) => {
  // Przyjmuje dwa propsy: activeTab oraz setActiveTab. setActiveTab to funkcja, ktora zmienia activeTab
  // Definicja zakładek w pasku bocznym
  const tabs = [
    { name: 'Dashboard', id: 'Dashboard', iconClass: 'fa-solid fa-house' },
    { name: 'Wordsets', id: 'Wordsets', iconClass: 'fa-solid fa-folder' },
    { name: 'Progress', id: 'Progress', iconClass: 'fa-solid fa-bars-progress' },
    { name: 'How To', id: 'HowTo', iconClass: 'fa-solid fa-compass' },

    // Wiecej zakladek bede dodawal tutaj
  ];

  // Renderowanie paska bocznego
  return (
    <div className="sidebar">
      <div className="sidebar_top">
        <div className="sidebar_logo">
          <img src={maxLogo} alt="logo" />
        </div>
      </div>
      <div className="sidebar_bottom">
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
              {/* Klikniecie na zakladke zmienia activeTab na id tej zakladki */}
              <a href="#">
                <span className={`icon ${tab.iconClass}`}></span> {/* Ikona dla kazdego tab */}
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
