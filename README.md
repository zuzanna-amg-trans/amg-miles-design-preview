# AMG Miles — panel klienta

Jasny, klikalny projekt panelu AMG Miles z naciskiem na śledzenie zleceń.

**[Otwórz aktualny podgląd](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/)**

Główne zakładki to **Zlecenia, Faktury i Nagrody**. Ekran startowy pokazuje pełną listę aktywnych transportów, uporządkowaną według najbliższej niewykonanej operacji: załadunku albo rozładunku. Filtry „W realizacji”, „Zakończone” i „Wszystkie” oraz wyszukiwanie pozostają nad listą.

Nowy kierunek wizualny łączy grafitowy pasek górny, jasne karty i pomarańczowe przyciski AMG. Karta zlecenia pokazuje numer klienta, miasta, kody pocztowe poprzedzone krajem, towar, wagę, liczbę palet i rejestrację auta. Załadunek i rozładunek mają osobne godziny dojazdu. Status określa, czy pojazd jedzie na załadunek, czy na rozładunek.

Po kliknięciu „Śledź transport” lista zwęża się do lewej kolumny, a po prawej otwiera się mapa i podgląd zlecenia. Obie kolumny przewijają się niezależnie; wybór kolejnego transportu podmienia jeden podgląd bez przewijania całej strony. Nad mapą są widoczne towar, waga, palety, rejestracja oraz numery klienta i AMG. „Pełna lista” przywraca szerokie karty. Na telefonie kolejne zlecenia pozostają w poziomej liście nad przewijanym podglądem, a główne zakładki — na dole.

Zlecenia, trasy, pozycje pojazdów, czasy dostawy, dokumenty, kwoty i punkty są fikcyjne i oznaczone jako dane demonstracyjne. To podgląd identyfikacji i interfejsu; mapa nie korzysta z GPS, a repozytorium nie zawiera backendu ani danych klientów.

## Ekrany do obejrzenia

- [Zlecenia](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#orders)
- [Śledzenie przykładowego transportu](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#tracking/DEMO-261001)
- [Zlecenie bez pozycji GPS](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#tracking/DEMO-261002)
- [Faktury](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#invoices)
- [Nagrody](https://zuzanna-amg-trans.github.io/amg-miles-design-preview/design-preview/#rewards)

## Testy i publikacja na GitHubie

Workflow [Test and publish preview](https://github.com/zuzanna-amg-trans/amg-miles-design-preview/actions/workflows/preview.yml) wykonuje pełne testy na maszynach GitHuba. Pull request uruchamia sprawdzenie składni i 60 testów przeglądarkowych w widoku komputerowym oraz mobilnym. Testowany jest gotowy pakiet strony: lista i śledzenie zleceń, faktury, nagrody, historia punktów, moje nagrody i zasady programu. Sprawdzane są kolejność najbliższych operacji, pełna i zwężona lista, niezależne przewijanie, przełączanie klawiaturą, widoczne informacje o ładunku i rejestracji, kody pocztowe, osobne czasy dojazdu, filtry i wyszukiwanie, historia statusów, dokumenty podczas transportu, brak GPS, sterowanie mapą, kontakt, wybór celu, FAQ, nawigacja, ładowanie zasobów i brak przewijania całej strony w poziomie. Aktualny wynik konkretnego wykonania znajduje się w GitHub Actions.

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
