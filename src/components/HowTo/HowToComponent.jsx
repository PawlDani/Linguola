import './HowTo.scss';
import learn from '/src/assets/images/learn.png';
import cards from '/src/assets/images/cards.png';
import write from '/src/assets/images/write.png';
import books from '/src/assets/images/3.svg';

const HowTo = () => {
  return (
    <div className="howTo">
      <div className="howTo_header">
        <div className="howTo_header_text">
          <h2>Jak się uczyć?</h2>
        </div>
        <div className="howTo_header_image">
          <img src={books} alt="Books" />
        </div>
      </div>
      <div className="howTo_section">
        <div className="howTo_container">
          <div className="howTo_item">
            <img src={learn} alt="learn" />
            <p>
              Przejrzyj fiszki i postaraj się je zapamiętać. Kiedy stwierdzisz, że znasz dane pojęcie, zaznacz je na
              zielono. Po zaznaczeniu wszystkich pojęć kolorem zielonym, przejdź do modułu &quot;Dopasowanie&quot;.
            </p>
          </div>
          {/* <div className="arrow"></div> */}
          <div className="howTo_item">
            <img src={cards} alt="cards" />
            <p>
              Ćwicz słownictwo poprzez dopasowywanie pojęć do ich definicji. Zagraj tyle rund, ile potrzebujesz, aż
              będziesz czuł, że masz opanowany ten zestaw.
            </p>
          </div>
          {/* <div className="arrow"></div> */}
          <div className="howTo_item">
            <img src={write} alt="write" />
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
