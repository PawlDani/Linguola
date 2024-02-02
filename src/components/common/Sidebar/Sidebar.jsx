// Komponent Sidebar zawiera liste zakladek, ktore sa dostepne w aplikacji.
// activeTab - aktualnie wybrana zakladka, setActiveTab - funkcja zmieniajaca aktualnie wybrana zakladke

const Sidebar = ({ activeTab, setActiveTab }) => {
  // lista zakladek
  const tabs = [
    { name: 'Dashboard', id: 'Dashboard' },
    { name: 'Wordsets', id: 'Wordsets' },
    { name: 'Progress', id: 'Progress' },
    { name: 'How To', id: 'HowTo' },
    // wiecej tabow bede dodawal tutaj w razie potrzeby
  ];

  return (
    <div className="sidebar">
      <ul>
        {tabs.map((tab, index) => (
          <li key={index} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
            {tab.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
