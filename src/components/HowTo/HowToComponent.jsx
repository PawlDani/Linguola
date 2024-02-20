import './HowTo.scss';

const HowTo = () => {
  return (
    <div className="howTo">
      <div className="howTo_header">
        <div className="howTo_header_text">
          <h2>Jak się uczyć?</h2>
        </div>
        <div className="howTo_header_image">
          <img src="/src/assets/images/3.svg" alt="user" />
        </div>
      </div>
      <div className="howTo_section">
        <div className="howTo_container">
          <div className="howTo_item">
            <img src="/src/assets/images/learn.png" alt="Step 1" />
            <p>
              Przejrzyj fiszki i postaraj się je zapamiętać. Kiedy stwierdzisz, że znasz dane pojęcie, zaznacz je na
              zielono. Po zaznaczeniu wszystkich pojęć kolorem zielonym, przejdź do modułu &quot;Dopasowanie&quot;.
            </p>
          </div>
          <div className="arrow"></div>
          <div className="howTo_item">
            <img src="/src/assets/images/cards.png" alt="Step 2" />
            <p>
              Ćwicz słownictwo poprzez dopasowywanie pojęć do ich definicji. Zagraj tyle rund, ile potrzebujesz, aż
              będziesz czuł, że masz opanowany ten zestaw.
            </p>
          </div>
          <div className="arrow"></div>
          <div className="howTo_item">
            <img src="/src/assets/images/write.png" alt="Step 3" />
            <p>
              Sprawdź swoją wiedzę w trybie pisania. Tu należy przetłumaczyć pojęcia z języka polskiego na język,
              którego się uczysz. Uzyskaj 100% z tego modułu i ciesz się nabytą wiedzą.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
