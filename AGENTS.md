# AMG Miles — testy i publikacja

- Ten projekt jest statycznym prototypem z fikcyjnymi danymi. Nie podłączaj rzeczywistych kont, faktur ani backendu bez osobnego zadania.
- Pełne testy przeglądarkowe uruchamiaj w GitHub Actions, na maszynach GitHuba. Domyślnie nie instaluj lokalnie zależności npm ani przeglądarek testowych i nie uruchamiaj lokalnych serii screenshotów. Lekkie sprawdzenie składni jest dozwolone; wyjątek dla pełnych testów lokalnych wymaga wyraźnej prośby użytkownika.
- Zmiany przygotowuj na gałęzi i sprawdzaj przez pull request. Po integracji z `main` workflow `Test and publish preview` testuje pakiet strony, publikuje go i ponownie sprawdza publiczny podgląd.
- Pages musi mieć źródło `GitHub Actions`. Nie przełączaj publikacji na bezpośrednie wdrażanie gałęzi ani nie omijaj zależności publikacji od testów.
- Raporty poprawnych testów przechowuj przez 7 dni, diagnostykę nieudanych testów przez 14 dni, pakiet do publikacji przez 1 dzień. Materiały potrzebne do nierozwiązanego problemu zachowaj osobno przed wygaśnięciem.
- Screenshoty powstają tylko przy błędzie, ślady wykonania są zachowywane tylko przy błędzie, nagrywanie wideo jest wyłączone. Nie pobieraj wszystkich raportów automatycznie na Maca i nie dodawaj surowych wyników testów do historii Git.
- Zachowaj istniejące, wybrane ilustracje dokumentacyjne w `design-preview/screenshots`. Nie są katalogiem kolejnych wyników testów.
- Każdy uruchomiony przez siebie serwer, test lub proces wyszukiwania doprowadź do zakończenia albo zatrzymaj i potwierdź zakończenie. Nie usuwaj starszych katalogów innych projektów w ramach tego workflow.
- Publikację potwierdzaj sukcesem workflow oraz publicznym odczytem `deployment.json` dla właściwego commita. Sam push nie potwierdza publikacji.
