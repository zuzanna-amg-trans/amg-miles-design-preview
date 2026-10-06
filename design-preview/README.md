# AMG Miles — niezależny podgląd identyfikacji

Ten katalog zawiera klikalny prototyp wizualny. **Nie jest kopią repozytorium dev AMG Miles**: repozytorium Miles nie było dostępne w podłączonej integracji GitHub podczas rozpoczęcia pracy. Do zastosowania zmian w prawdziwym froncie wymagany jest link do repozytorium i wskazanie właściwej gałęzi.

## Uruchomienie

```sh
python3 design-preview/server.py
```

Otwórz `http://127.0.0.1:4318`. Serwer nasłuchuje wyłącznie lokalnie.

## Dostępne widoki

- Przegląd salda, wygasających punktów i faktur.
- Faktury z filtrowaniem, wyszukiwaniem i oknem szczegółów.
- Historia punktów.
- Katalog nagród z filtrami kategorii, oknem szczegółów i demonstracyjnym wyborem celu.
- Moje nagrody ze stanem pustym.
- Zasady programu z rozwijanymi pytaniami.
- Okna powiadomień i kontaktu; nawigacja mobilna.

**Wszystkie numery faktur, kwoty, salda, nagrody i powiadomienia są fikcyjne** i jawnie oznaczone w interfejsie. Prototyp nie loguje użytkownika, nie rozlicza faktur, nie wysyła wiadomości ani nie składa zamówień. Cel nagrody działa tylko w pamięci bieżącego podglądu i znika po przeładowaniu.

## Źródła identyfikacji

Logo AMG i font Onest pochodzą z zasobów aktualnie wyrenderowanej strony https://amg-trans.eu/, pozyskanych 6 października 2026. Akcent strony głównej: `#ff8145`.

Informacje o punktach w widoku zasad odtwarzają publiczną stronę https://miles.amg-trans.eu/: 5 pkt za 1 EUR netto, bonus 100% przy płatności do 10 dni, bonus 30% do połowy terminu oraz 12 miesięcy ważności. Ich ostateczne zastosowanie i pierwszeństwo reguł musi określać backend. Prototyp nie wprowadza nowej logiki rozliczeń. Ilustracje nagród są autorskimi wektorowymi placeholderami, nie ofertą rzeczywistych produktów.

## Przy integracji z dev

1. Zidentyfikować framework, komponenty i obecne kontrakty API w repozytorium.
2. Przenieść tokeny CSS i wzorce komponentów do istniejącej architektury.
3. Zastąpić `demoSource` danymi właściwego projektu; nie używać danych demonstracyjnych jako fallbacku w panelu produkcyjnym.
4. Pobierać z backendu saldo, statusy, bonusy, daty wygaśnięcia, dostępność i ceny nagród.
5. Zachować dotychczasowy przepływ uwierzytelnienia, uprawnienia i procedurę zamawiania nagród.
6. Dopasować stany ładowania, pustych danych, błędów i braku uprawnień do rzeczywistych odpowiedzi API.

Pliki są celowo bez zależności buildowych, aby kierunek wizualny można było przejrzeć przed poznaniem architektury dev. Podgląd jest przeznaczony do publikacji w osobnym repozytorium `zuzanna-amg-trans/amg-miles-design-preview` przez GitHub Pages. Główna strona AMG i właściwy backend Miles pozostają osobnymi projektami.
