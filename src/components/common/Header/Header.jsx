import './Header.scss';

const Header = () => {
  return (
    <header>
      <div className="logo-container">
        <a href="/" className="logo-link">
          Linguola {/*do zmiany*/}
        </a>
      </div>
      <nav>
        <ul>
          <li>
            <a href="/faq">FAQ</a>
          </li>{' '}
          {/*do zmiany*/}
          <li>
            <a href="/about">About Me</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
