# AMG Miles — podgląd panelu klienta

Klikalny projekt wizualny panelu. Najważniejszy przepływ: **aktywne zlecenia według najbliższej operacji → wybór zlecenia → lista po lewej i mapa po prawej → szybkie przełączanie transportów**. Punktów i nagród można szukać w zakładce Nagrody, a historii punktów i zasad — w jej podrzędnej nawigacji.

## Uruchomienie

```sh
python3 design-preview/server.py
```

Adres lokalny: `http://127.0.0.1:4318`. Serwer nasłuchuje wyłącznie na `127.0.0.1`.

Publiczny podgląd: https://zuzanna-amg-trans.github.io/amg-miles-design-preview/

Pełne testy przeglądarkowe wykonuje GitHub Actions przez pull request. Po integracji z `main` workflow testuje pakiet, publikuje go i sprawdza publiczny podgląd. Nie instaluj lokalnie zależności testowych ani nie uruchamiaj lokalnych serii zrzutów; zasady procesu określa [AGENTS.md](../AGENTS.md).

## Widoki i interakcje

- Powitanie „Dzień dobry!” i nazwa firmy w środkowej części nagłówka na komputerze. Dane firmy w prototypie są fikcyjne.
- Pełna lista aktywnych zleceń po wejściu. Transport oczekujący na załadunek jest sortowany po planowanym dojeździe na załadunek; po potwierdzeniu załadunku — po dojeździe na rozładunek. Zakończone zlecenia są uporządkowane od ostatnio rozładowanych. W „Wszystkich” aktywne są przed zakończonymi.
- Karta zlecenia z numerem klienta, dużymi krajami i kodami pocztowymi przed nazwami miast, towarem, wagą, liczbą palet, rejestracją i typem auta. Wyszukiwanie obejmuje numery klienta i AMG, miasta, kraje, kody, nazwę towaru i rejestrację; współpracuje z filtrami „W realizacji”, „Zakończone”, „Wszystkie”.
- Szeroka karta ma dwa główne obszary: trasę z kodami i krajem, a pod nią towar, wagę, palety i pojazd; obok jeden blok „ETA na rozładunek” z godziną i datą o tej samej wysokości. Dodatkowy planowany termin został usunięty z listy. Aktywne karty mają wyraźniejszy obrys, wąski akcent i większy odstęp. Na telefonie oba punkty trasy są obok siebie, dane ładunku zajmują pełną szerokość, a ETA jest krótkim paskiem pod nimi. Status jest po lewej, numer klienta na środku, a GPS w nagłówku na komputerze lub pod treścią na telefonie. Wąska lista również pokazuje ETA rozładunku. Sortowanie nadal używa najbliższej niezakończonej operacji. Przycisk „GPS pojazdu” i kliknięcie w pozostałą część karty otwierają jeden podgląd.
- Po wyborze zlecenia lista zwęża się do lewej kolumny, a po prawej otwiera się jeden podgląd. Lista i szczegóły mają niezależne przewijanie w wysokości ekranu. Pozostałe zlecenia są stale dostępne, bez przewijania całej strony. Na telefonie lista tworzy krótki poziomy pas z trasą, numerem klienta i towarem nad szczegółami. Dodatkowe dane wybranego zlecenia pozostają w podglądzie. Filtry i wyszukiwanie rozwija przycisk „Filtry i wyszukiwanie”; przełączenie transportu zamyka ten obszar, zachowując wybrany filtr i zapytanie.
- Towar, waga, palety, rejestracja i typ pojazdu są widoczne nad mapą. Nagłówek pokazuje kraje i kody pocztowe, aktualny status oraz numery klienta i AMG. Rejestracje „DEMO 001”–„DEMO 005” są fikcyjne.
- Podgląd skupia się na najbliższej operacji. Status zastępuje napis „Podgląd zlecenia” w nagłówku i nie powtarza się w panelu. Po lewej stronie mapy są rodzaj operacji, duże ETA z godziną i datą oraz okno ze zlecenia. Pasek „Następna operacja” jest pod mapą i panelem. Przy załadunku pokazuje przyszły rozładunek; przy ostatnim rozładunku informuje o zakończeniu transportu, bez wymyślania następnej operacji. Historia i etapy realizacji są domyślnie zwinięte. Status jest odczytany z pola zlecenia, także dla stanów takich jak „Załadowany”. Filtry i wyszukiwarka pozostają nad lewą listą.
- Mapa poglądowa ma osobne przybliżanie, oddalanie, reset całej trasy oraz przycisk „Powiększ mapę”. Przybliżanie centruje grafikę na pozycji pojazdu lub środku planowanej trasy. Powiększony widok działa w oknie nad zleceniem i zachowuje zoom w obu mapach; Escape lub „Wróć do zlecenia” przywraca fokus. Pięć etapów i historia statusów są dostępne po rozwinięciu „Historia i etapy realizacji”. Link `#tracking/ID` zachowuje wybrane zlecenie po przeładowaniu. Strzałki oraz Home/End umożliwiają zmianę zlecenia w zwężonej liście; „Pełna lista” przywraca szerokie karty.
- Szacunkowy postęp pierwszego transportu, dostępne w trakcie realizacji CMR i zdjęcie załadunku. Zakończone zlecenia pokazują CMR i fakturę. Lista dokumentów pochodzi z osobnego pola danych, niezależnie od statusu.
- Przycisk „Link do pozycji pojazdu” otwiera Google Maps w nowej karcie na podstawie fikcyjnych współrzędnych z `positionCoordinates`. Nie wyszukuje miasta zamiast brakującego GPS. Format linku opisuje [dokumentacja Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).
- Drugie zlecenie prezentuje brak GPS, nieaktywny link do pozycji i dokumenty w przygotowaniu; mapa pokazuje wyłącznie planowaną trasę, bez zastępczej pozycji pojazdu.
- Rozwijane szczegóły auta, ładunku i punktów trasy, w tym demonstracyjny punkt pośredni.
- Faktury z filtrowaniem, wyszukiwaniem i szczegółami. Na telefonie każdy wiersz jest czytelnym blokiem z podpisami, bez przewijania tabeli w poziomie.
- Katalog nagród, demonstracyjny wybór celu, historia punktów, moje nagrody i zasady programu. Na telefonie nagrody mają szerokie karty z ilustracją i danymi obok; przyciski do dotyku mają co najmniej 44 px, a wyszukiwarki tekst 16 px.
- Kontakt, okna szczegółów i obsługa klawiaturą. Na komputerze trzy zakładki są w górnym pasku, na telefonie — w stałej nawigacji dolnej. Na telefonie najpierw widać dane bieżącej i następnej/poprzedniej operacji, potem mapę. Lista zleceń pozostaje dostępna podczas przewijania szczegółów.

Wszystkie rekordy w `demoSource` są fikcyjne. Publiczny kod, ilustracje i zrzuty ekranu nie zawierają danych z zalogowanego konta Miles. Prototyp nie uwierzytelnia użytkowników, nie pobiera GPS, nie przelicza rzeczywistych rozliczeń, nie wysyła wiadomości ani nie zamawia nagród. Zapis celu pozostaje w pamięci bieżącej karty i znika po przeładowaniu.

## Identyfikacja

Onest, grafit, ciepły pomarańcz `#ff8145`, jasne powierzchnie oraz zaokrąglone przyciski z osobnym kółkiem na ikonę. Logo i font pozyskano z oficjalnej strony AMG Trans 6 października 2026.

Układ inspirowano rzeczywistymi widokami aktywnego i archiwalnego zlecenia po zalogowaniu 7 października 2026. W aktywnym zleceniu obejrzano mapę, szacunkowy postęp i dostawę, historię statusów, pojazd, punkty trasy oraz dokumenty dostępne jeszcze podczas transportu. Publiczny projekt odtwarza tę hierarchię na samodzielnie przygotowanych fikcyjnych rekordach. Ilustracja mapy, model danych i komponenty są propozycją interfejsu; nie stanowią potwierdzonego kontraktu API.

Publiczna strona programu podaje 5 punktów za 1 EUR netto, bonus 100% przy płatności do 10 dni, bonus 30% do połowy terminu oraz 12 miesięcy ważności. Prototyp prezentuje te informacje bez implementowania nowej logiki rozliczeń.

## Przeniesienie do właściwego frontu

Ten katalog nie jest kopią repozytorium dev AMG Miles. Do integracji potrzebny jest link i dostęp do właściwego repozytorium oraz potwierdzenie jego gałęzi.

1. Sprawdzić framework, istniejące komponenty, uwierzytelnienie i rzeczywiste odpowiedzi API.
2. Przenieść tokeny i komponenty do istniejącej architektury, zachowując aktualne uprawnienia. Nazwę firmy w nagłówku pobrać z właściwego, uprawnionego konta klienta.
3. Pobierać listę zleceń i pełną historię statusów z backendu. Pięć etapów w projekcie rozróżnia jazdę na załadunek i na rozładunek; pełne oryginalne statusy i daty muszą być zachowane w historii. Numer klienta, numer AMG, towar, waga, opakowania, rejestracja oraz oba adresy z krajami i kodami muszą pochodzić z właściwych pól API. Sortowanie trzeba oprzeć na rzeczywistej kolejnej niewykonanej operacji i jej terminie w poprawnej strefie czasowej. Daty demo służą tylko porównaniu kolejności; nie opisują bieżących transportów.
4. Potwierdzić dostawcę mapy, źródło GPS, częstotliwość aktualizacji oraz dostępność i znaczenie ETA. Potwierdzić osobne czasy dojazdu na załadunek i rozładunek, ich okna oraz faktyczny/planowany charakter. Pokazać wiek pozycji; dla brakującej pozycji lub ETA wyświetlić jawny stan braku danych.
5. Udostępniać CMR, zdjęcia i faktury według faktycznej dostępności dokumentów i uprawnień, niezależnie od samego statusu transportu. Potwierdzenie weryfikacji dokumentu i opcje pobrania muszą pochodzić z backendu.
6. Pobierać kwoty, waluty, statusy płatności, punkty i bonusy z właściwego systemu rozliczeń. Zachować rozróżnienie kwot netto/brutto i istniejące warunki naliczania.
7. Obsłużyć ładowanie, brak aktywnych zleceń, błędy, brak danych GPS i brak uprawnień bez podstawiania danych demo.

Kod celowo nie wymaga narzędzi buildowych, aby można było ocenić kierunek przed integracją z backendem.
