# AMG Miles — podgląd panelu klienta

Klikalny projekt wizualny panelu. Najważniejszy przepływ: **wybór grupy statusów → zlecenie → śledzenie rozwinięte pod kartą → statusy i dokumenty**. Punktów i nagród można szukać w zakładce Nagrody, a historii punktów i zasad — w jej podrzędnej nawigacji.

## Uruchomienie

```sh
python3 design-preview/server.py
```

Adres lokalny: `http://127.0.0.1:4318`. Serwer nasłuchuje wyłącznie na `127.0.0.1`.

Publiczny podgląd: https://zuzanna-amg-trans.github.io/amg-miles-design-preview/

Pełne testy przeglądarkowe wykonuje GitHub Actions przez pull request. Po integracji z `main` workflow testuje pakiet, publikuje go i sprawdza publiczny podgląd. Nie instaluj lokalnie zależności testowych ani nie uruchamiaj lokalnych serii zrzutów; zasady procesu określa [AGENTS.md](../AGENTS.md).

## Widoki i interakcje

- Menu statusów po lewej i szersza lista po prawej (proporcja około 1:3 na komputerze). Rozwijane grupy „W realizacji”, „Zakończone”, „Wszystkie” pokazują trasę i numer klienta. Na telefonie menu ma zwijany nagłówek.
- Karta zlecenia z numerem klienta, miastami, kodami pocztowymi i krajem, towarem, wagą i liczbą palet. Wyszukiwanie obejmuje numery klienta i AMG, miasta, kody oraz nazwę towaru; współpracuje z wybraną grupą statusów.
- Dwa osobne terminy: dojazd na załadunek i na rozładunek, z godziną i datą. Nadchodzący termin ma opis „Przewidywany dojazd”; potwierdzony dojazd jest oznaczony jako potwierdzony. Bieżący status rozróżnia jazdę na załadunek i na rozładunek.
- Śledzenie rozwijane bezpośrednio pod kartą zlecenia: mapa poglądowa z przybliżaniem i resetem, przykładowa pozycja, godzina dojazdu właściwa dla etapu, okno załadunku lub dostawy, pięć etapów i historia statusów. Numer AMG jest w nagłówku podglądu. Jedno rozwinięte zlecenie naraz; link `#tracking/ID` otwiera je w kontekście listy.
- Szacunkowy postęp pierwszego transportu, dostępne w trakcie realizacji CMR i zdjęcie załadunku. Zakończone zlecenia pokazują CMR i fakturę. Lista dokumentów pochodzi z osobnego pola danych, niezależnie od statusu.
- Drugie zlecenie prezentuje brak GPS i dokumenty w przygotowaniu; mapa pokazuje wyłącznie planowaną trasę, bez zastępczej pozycji pojazdu.
- Rozwijane szczegóły auta, ładunku i punktów trasy, w tym demonstracyjny punkt pośredni.
- Faktury z filtrowaniem, wyszukiwaniem i szczegółami.
- Katalog nagród, demonstracyjny wybór celu, historia punktów, moje nagrody i zasady programu.
- Kontakt, okna szczegółów i obsługa klawiaturą. Na komputerze trzy zakładki są w górnym pasku, na telefonie — w stałej nawigacji dolnej. Na telefonie bieżący termin dojazdu poprzedza mapę.

Wszystkie rekordy w `demoSource` są fikcyjne. Publiczny kod, ilustracje i zrzuty ekranu nie zawierają danych z zalogowanego konta Miles. Prototyp nie uwierzytelnia użytkowników, nie pobiera GPS, nie przelicza rzeczywistych rozliczeń, nie wysyła wiadomości ani nie zamawia nagród. Zapis celu pozostaje w pamięci bieżącej karty i znika po przeładowaniu.

## Identyfikacja

Onest, grafit, ciepły pomarańcz `#ff8145`, jasne powierzchnie oraz zaokrąglone przyciski z osobnym kółkiem na ikonę. Logo i font pozyskano z oficjalnej strony AMG Trans 6 października 2026.

Układ inspirowano rzeczywistymi widokami aktywnego i archiwalnego zlecenia po zalogowaniu 7 października 2026. W aktywnym zleceniu obejrzano mapę, szacunkowy postęp i dostawę, historię statusów, pojazd, punkty trasy oraz dokumenty dostępne jeszcze podczas transportu. Publiczny projekt odtwarza tę hierarchię na samodzielnie przygotowanych fikcyjnych rekordach. Ilustracja mapy, model danych i komponenty są propozycją interfejsu; nie stanowią potwierdzonego kontraktu API.

Publiczna strona programu podaje 5 punktów za 1 EUR netto, bonus 100% przy płatności do 10 dni, bonus 30% do połowy terminu oraz 12 miesięcy ważności. Prototyp prezentuje te informacje bez implementowania nowej logiki rozliczeń.

## Przeniesienie do właściwego frontu

Ten katalog nie jest kopią repozytorium dev AMG Miles. Do integracji potrzebny jest link i dostęp do właściwego repozytorium oraz potwierdzenie jego gałęzi.

1. Sprawdzić framework, istniejące komponenty, uwierzytelnienie i rzeczywiste odpowiedzi API.
2. Przenieść tokeny i komponenty do istniejącej architektury, zachowując aktualne uprawnienia.
3. Pobierać listę zleceń i pełną historię statusów z backendu. Pięć etapów w projekcie rozróżnia jazdę na załadunek i na rozładunek; pełne oryginalne statusy i daty muszą być zachowane w historii. Numer klienta, numer AMG, towar, waga, opakowania i oba adresy z krajami i kodami muszą pochodzić z właściwych pól API.
4. Potwierdzić dostawcę mapy, źródło GPS, częstotliwość aktualizacji oraz dostępność i znaczenie ETA. Potwierdzić osobne czasy dojazdu na załadunek i rozładunek, ich okna oraz faktyczny/planowany charakter. Pokazać wiek pozycji; dla brakującej pozycji lub ETA wyświetlić jawny stan braku danych.
5. Udostępniać CMR, zdjęcia i faktury według faktycznej dostępności dokumentów i uprawnień, niezależnie od samego statusu transportu. Potwierdzenie weryfikacji dokumentu i opcje pobrania muszą pochodzić z backendu.
6. Pobierać kwoty, waluty, statusy płatności, punkty i bonusy z właściwego systemu rozliczeń. Zachować rozróżnienie kwot netto/brutto i istniejące warunki naliczania.
7. Obsłużyć ładowanie, brak aktywnych zleceń, błędy, brak danych GPS i brak uprawnień bez podstawiania danych demo.

Kod celowo nie wymaga narzędzi buildowych, aby można było ocenić kierunek przed integracją z backendem.
