# AMG Miles — panel klienta

Jasny, klikalny projekt AMG Miles: od publicznego ekranu wejściowego i aktywacji kodem po stronę główną panelu i śledzenie zleceń.

**[Otwórz aktualny podgląd](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/)**

Przed wejściem do panelu publiczny ekran wyjaśnia program, jego trzy główne obszary i zasady korzyści w tej samej grafitowo-pomarańczowej identyfikacji. „Logowanie” otwiera dostępne okno do wpisania 6 cyfr: akceptuje wklejenie, usuwa znaki inne niż cyfry, pokazuje postęp i aktywuje przycisk dopiero po uzupełnieniu kodu. To wyłącznie demonstracja interfejsu — kod nie jest wysyłany ani sprawdzany w systemie, a poprawne 6 cyfr otwiera fikcyjne konto podglądowe. Karty podglądowe mają proste, równoległe krawędzie bez stałych obrotów i perspektywy.

Po aktywacji główne zakładki to **Start, Zlecenia, Faktury i Nagrody**. Nowy ekran startowy zastępuje dawną ciężką, żółto-grafitową prezentację programu pulpitem klienta w aktualnej identyfikacji: pokazuje najbliższą operację transportową, liczbę aktywnych zleceń, faktury do opłacenia, saldo punktów, ostatnią fakturę do opłacenia i postęp do wybranej nagrody. Każdy blok prowadzi bezpośrednio do właściwej części panelu.

Widok Zlecenia pokazuje „Dzień dobry!” i nazwę firmy oraz pełną listę aktywnych transportów, uporządkowaną według najbliższej niewykonanej operacji: załadunku albo rozładunku. Filtry „W realizacji”, „Zakończone” i „Wszystkie” oraz wyszukiwanie pozostają nad listą.

Nowy kierunek wizualny łączy grafitowy pasek górny, jasne karty i pomarańczowe przyciski AMG. Strona główna używa grafitowego hero z delikatną siatką i ciepłym akcentem zamiast starego wielkiego logo oraz żółtego panelu. Karta zlecenia pokazuje numer klienta, duże kody pocztowe poprzedzone krajem, miasta, towar, wagę, liczbę palet, rejestrację i rodzaj pojazdu. Powiększone napisy i ikony podkreślają dane operacyjne. Załadunek i rozładunek mają osobne godziny dojazdu. Status określa, czy pojazd jedzie na załadunek, czy na rozładunek.

Na liście aktywne karty są wyraźniej oddzielone. Adresy i kody są nad danymi ładunku, a obok jest jeden blok ETA rozładunku o tej samej wysokości. Dodatkowy planowany termin nie pojawia się na liście. Po kliknięciu „GPS pojazdu”, statusu, całego kafelka ETA lub dowolnego miejsca na karcie zlecenia lista zwęża się do lewej kolumny, a po prawej otwiera się mapa i podgląd zlecenia. Obie kolumny przewijają się niezależnie; wybór kolejnego transportu podmienia jeden podgląd bez przewijania całej strony. Nagłówek podglądu wyróżnia kraje i kody pocztowe oraz aktualny status. Nad mapą są widoczne towar, waga, palety, rejestracja oraz numery klienta i AMG. Na komputerze dane najbliższej operacji są po lewej stronie mapy: rodzaj operacji, ETA z godziną i datą oraz okno ze zlecenia. Status występuje raz w nagłówku. Następna operacja ma osobny pasek pod mapą i danymi operacji; historia i etapy są domyślnie zwinięte. Przy pozycji pojazdu jest link do Google Maps otwierający fikcyjne współrzędne demonstracyjne; przy braku GPS jest nieaktywny. Przy otwartym podglądzie filtry i wyszukiwanie pozostają nad lewą listą. „Pełna lista” przywraca szerokie karty. Na telefonie kolejne zlecenia pozostają w poziomej liście nad przewijanym podglądem, dane operacji poprzedzają mapę, a główne zakładki są na dole. „Powiększ mapę” otwiera większą mapę w oknie nad zleceniem; przybliżanie koncentruje się na pozycji pojazdu lub planowanej trasie, a osobny reset przywraca całą trasę.

Na telefonie załadunek i rozładunek są obok siebie, ładunek zajmuje pełną szerokość, a ETA ma postać krótkiego paska pod nimi. W otwartym zleceniu filtry i wyszukiwanie można rozwinąć przyciskiem; krótki poziomy pas pozostałych transportów pozostaje dostępny podczas przewijania szczegółów. Pola wyszukiwania mają tekst 16 px, a przyciski do dotyku co najmniej 44 px. Faktury są ułożone w bloki z podpisanymi danymi, a nagrody w większe karty. Testy obejmują mały ekran 319 × 568 px oraz telefon w poziomie 844 × 390 px.

Zlecenia, trasy, pozycje pojazdów, czasy dostawy, dokumenty, kwoty i punkty są fikcyjne i oznaczone jako dane demonstracyjne. To podgląd identyfikacji i interfejsu; mapa nie korzysta z GPS, a repozytorium nie zawiera backendu ani danych klientów.

## Ekrany do obejrzenia

- [Widok publiczny i aktywacja](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/)
- [Strona główna](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#home)
- [Zlecenia](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#orders)
- [Śledzenie przykładowego transportu](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#tracking/DEMO-261001)
- [Zlecenie bez pozycji GPS](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#tracking/DEMO-261002)
- [Faktury](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#invoices)
- [Nagrody](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#rewards)

## Testy i publikacja na GitHubie

Workflow [Test and publish preview](https://github.com/zuzanna-amg-trans/amg-miles-design-preview/actions/workflows/preview.yml) wykonuje pełne testy na maszynach GitHuba. Pull request uruchamia sprawdzenie składni i 98 testów przeglądarkowych w widoku komputerowym oraz mobilnym. Testowany jest gotowy pakiet strony: publiczne wejście, okno aktywacji, pulpit klienta, lista i śledzenie zleceń, faktury, nagrody, historia punktów, moje nagrody i zasady programu. Sprawdzane są zachowanie 6-cyfrowego pola kodu, blokada niepełnej aktywacji, pomoc, przywracanie fokusu i przejście do konta demonstracyjnego, a także przejścia ze strony głównej, kolejność najbliższych operacji, pełna i zwężona lista, niezależne przewijanie, przełączanie klawiaturą, widoczne informacje o ładunku i rejestracji, kody pocztowe, osobne czasy dojazdu, filtry i wyszukiwanie, jeden równy wiersz statusów w zwężonej kolumnie na iPadzie, wspólne krawędzie przycisku GPS i kafelka ETA na wszystkich kartach, wyrównanie godziny z datą oraz etykiet i wartości danych ładunku, historia statusów, dokumenty podczas transportu, brak GPS, sterowanie mapą, widoczne powiększanie znacznika pojazdu, powiększony podgląd mapy, status w nagłówku, nazwa firmy, czytelność ETA i okna ze zlecenia, układ trasy nad ładunkiem, jednakowa wysokość bloku ETA i zawartości karty na komputerze oraz pełny pasek ETA na telefonie, rozdzielenie aktywnych zleceń i szerokość telefonu 319 px, kliknięcie poza przyciskiem GPS, otwieranie zlecenia przez GPS, status i cały kafelek ETA myszą, dotykiem oraz klawiaturą, delikatne podświetlenie statusu i ETA bez przesuwania elementów, powrót fokusu do użytego przycisku, skupienie na najbliższej operacji, osobny pasek następnej operacji, rozwijana historia, link do Google Maps i brak linku przy braku GPS, kontakt, wybór celu, FAQ, nawigacja, ładowanie zasobów i brak przewijania całej strony w poziomie. Aktualny wynik konkretnego wykonania znajduje się w GitHub Actions.

Po zmianie `main` ten sam workflow publikuje przetestowany pakiet przez GitHub Pages, odczytuje publiczny identyfikator commita i sumy kontrolne zasobów oraz ponownie wykonuje testy na publicznej stronie. Nieudane testy przed publikacją blokują nowe wdrożenie. Źródłem Pages jest **GitHub Actions**.

Raporty poprawnych testów wygasają po **7 dniach**, diagnostyka błędów po **14 dniach**, a pakiet do publikacji po **1 dniu**. Wygaśnięcie pakietu nie usuwa opublikowanej strony. Screenshoty i ślady są zachowywane tylko przy błędzie; nagrywanie wideo jest wyłączone. Ważne materiały do nadal nierozwiązanego problemu trzeba zachować osobno przed ich wygaśnięciem.

Pełne testy i pakowanie strony mają blokadę uruchamiania poza GitHub Actions. Nie ma potrzeby instalowania testowych przeglądarek ani zależności npm na Macu. Raportów nie pobieramy automatycznie. Wyniki testów, cache zależności i pakiet `_site` są wykluczone z historii Git; istniejące ilustracje w `design-preview/screenshots` pozostają dokumentacją wcześniejszego kierunku. Aktualny wygląd można obejrzeć w działającym podglądzie.

## Opcjonalny podgląd lokalny

```sh
python3 design-preview/server.py
```

Otwórz `http://127.0.0.1:4318`. GitHub Pages publikuje pakiet przetestowany przez GitHub Actions po zmianie `main`.

Serwer jest opcjonalny; na co dzień korzystamy z opublikowanego podglądu. Zatrzymaj go klawiszami `Ctrl+C` po zakończeniu pracy. Kod i warunki przyszłej integracji znajdują się w [design-preview](design-preview/README.md). Ten projekt stanowi osobny podgląd; do przeniesienia zmian do rzeczywistego frontu potrzebny jest dostęp do właściwego repozytorium dev AMG Miles.

## Zasoby

Logo AMG Trans pochodzi z oficjalnej strony AMG Trans. Nazwa i znak AMG pozostają własnością ich właściciela. Font Onest jest dystrybuowany na licencji [SIL Open Font License 1.1](design-preview/assets/OFL-Onest.txt). Mapa i ilustracje nagród są autorskimi wektorami przygotowanymi do prezentacji wyglądu.
