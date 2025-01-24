# gh-api-test-task v2

Dalszy rozwój aplikacji z zadania rekrutacyjnego (z branchu gh-api-test-task).

Oryginalne zadanie ze względu na ograniczony czas miało pewne niedociągnięcia, które nie dawały mi spokoju, dlatego pracują nad wyeliminowaniem błędów, poprawą jakości działania aplikacji oraz poprawą jakości i czytelności kodu.


## Usprawnienia względem pierwotnego zadania

**Techniczne & czytelność kodu:**
- w wynikach wyszukiwania repozytoriów: kliknięcie na użytkownika przenosi na podstronę-widok z informacjami o nim, a nie bezpośrednio na profil Github (wcześniej takie działanie było tylko dla wyszukiwania użytkowników)
- usunięto zmianną 'hasUserStarted', a jej funkcję pełni nowa zmienna: 'currentResultsCategory' (co wyeliminowała poniższe błędy)
	- naprawiono błąd, w którym zmiana opcji sort/direction/per-page powodowała nieporządane wywołanie funkcji pobierania danych przed wyświetleniem wyników (przed rozpoczęciem wyszukiwania)
	- w przypadku, kiedy nie znaleziono pasujących rezultatów, zmiana opcji wyszukiwania nie powoduje ponownego zapytania do API
	- zmiana kategorii wyszukiwania z pierwotnej na inną i znów na pierwotną nie powoduje ukrycia komunikatu o braku pasujących wyników

- przeniesiono funkcje odpowiedzialne za komunikację z Github API do hooka 'useSearch'
- zastosowano 'implicit return' w wybranych funkcjach
- poprawiono nazwy zmiennych w funkcjach pobierających dane z API (obecnie nazwa są bardziej spójne)
- 'search input': zastąpiono dyrektywy v-bind & v-on:input dyrektywą v-model
- przeniesiono logikę zawiązaną z zarządzaniem rezultatami wyszukiwania do providera 'useResults'
- 'UserDetails': przeniesiono funkcje pobierające dane z API do hooka "useUser"
- 'UserDetails': dodano gif i style CSS w przypadku, gdy użytkownik nie ma jeszcze żadnego repozytorium

**UX:**
- dodano focus na 'search input' po kliknięciu w przycisk usuwający zawrtość inputu


**Accessibility:**
- dodano atrybut 'aria-label' do 'search input'


**Style:**
- drobne poprawy wizualne (CSS)
- dodano faviconę


<!-- ## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
``` -->
