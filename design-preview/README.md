# AMG Miles — podgląd panelu klienta

Klikalny projekt wizualny panelu. Najważniejszy przepływ: **zlecenia → śledzenie pojedynczego transportu → statusy i dokumenty**. Punktów i nagród można szukać w zakładce Nagrody, a historii punktów i zasad — w jej podrzędnej nawigacji.

## Uruchomienie

```sh
python3 design-preview/server.py
```

Adres lokalny: `http://127.0.0.1:4318`. Serwer nasłuchuje wyłącznie na `127.0.0.1`.

Publiczny podgląd: https://zuzanna-amg-trans.github.io/amg-miles-design-preview/

Pełne testy przeglądarkowe wykonuje GitHub Actions przez pull request. Po integracji z `main` workflow testuje pakiet, publikuje go i sprawdza publiczny podgląd. Nie instaluj lokalnie zależności testowych ani nie uruchamiaj lokalnych serii zrzutów; zasady procesu określa [AGENTS.md](../AGENTS.md).

## Widoki i interakcje

- Lista zleceń z filtrami realizacji/archiwum i wyszukiwaniem numeru, numeru klienta lub miasta.
- Szczegóły zlecenia: mapa poglądowa, przykładowa pozycja pojazdu, czas dostawy, okno dostawy, etapy i historia statusów.
- Zlecenie dostarczone z miejscem na podgląd CMR i faktury.
- Faktury z filtrowaniem, wyszukiwaniem i szczegółami.
- Katalog nagród, demonstracyjny wybór celu, historia punktów, moje nagrody i zasady programu.
- Kontakt, okna szczegółów i obsługa klawiaturą; trzy główne zakładki są widoczne również na telefonie.

Wszystkie rekordy w `demoSource` są fikcyjne. Publiczny kod, ilustracje i zrzuty ekranu nie zawierają danych z zalogowanego konta Miles. Prototyp nie uwierzytelnia użytkowników, nie pobiera GPS, nie przelicza rzeczywistych rozliczeń, nie wysyła wiadomości ani nie zamawia nagród. Zapis celu pozostaje w pamięci bieżącej karty i znika po przeładowaniu.

## Identyfikacja

Onest, grafit, ciepły pomarańcz `#ff8145`, jasne powierzchnie oraz zaokrąglone przyciski z osobnym kółkiem na ikonę. Logo i font pozyskano z oficjalnej strony AMG Trans 6 października 2026.

Schemat statusów inspirowano rzeczywistym widokiem zleceń i jego historią po zalogowaniu 7 października 2026. Zalogowane konto pokazywało zlecenia archiwalne; rzeczywisty ekran GPS i pola ETA dla aktywnego zlecenia nie zostały jeszcze zweryfikowane. Ilustracja mapy, ETA oraz pola pojazdu i ładunku są propozycją interfejsu, a nie potwierdzonym kontraktem API.

Publiczna strona programu podaje 5 punktów za 1 EUR netto, bonus 100% przy płatności do 10 dni, bonus 30% do połowy terminu oraz 12 miesięcy ważności. Prototyp prezentuje te informacje bez implementowania nowej logiki rozliczeń.

## Przeniesienie do właściwego frontu

Ten katalog nie jest kopią repozytorium dev AMG Miles. Do integracji potrzebny jest link i dostęp do właściwego repozytorium oraz potwierdzenie jego gałęzi.

1. Sprawdzić framework, istniejące komponenty, uwierzytelnienie i rzeczywiste odpowiedzi API.
2. Przenieść tokeny i komponenty do istniejącej architektury, zachowując aktualne uprawnienia.
3. Pobierać listę zleceń i pełną historię statusów z backendu. Cztery etapy w projekcie są wizualnym skrótem; oryginalne statusy i daty muszą być zachowane w historii.
4. Potwierdzić dostawcę mapy, źródło GPS, częstotliwość aktualizacji oraz dostępność i znaczenie ETA. Pokazać wiek pozycji; dla brakującej pozycji lub ETA wyświetlić jawny stan braku danych.
5. Udostępniać CMR i faktury według faktycznej dostępności dokumentów i uprawnień, niezależnie od samego statusu transportu.
6. Pobierać kwoty, waluty, statusy płatności, punkty i bonusy z właściwego systemu rozliczeń. Zachować rozróżnienie kwot netto/brutto i istniejące warunki naliczania.
7. Obsłużyć ładowanie, brak aktywnych zleceń, błędy, brak danych GPS i brak uprawnień bez podstawiania danych demo.

Kod celowo nie wymaga narzędzi buildowych, aby można było ocenić kierunek przed integracją z backendem.
