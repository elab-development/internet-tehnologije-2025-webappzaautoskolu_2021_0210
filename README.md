# Web aplikacija za auto školu

Ova aplikacija predstavlja web sistem za upravljanje auto školom. Aplikacija omogućava kandidatima da zakazuju časove vožnje i rade testove,instruktori imaju svoj raspored časova i uvid u svoje klijente, kao i administraciji da upravlja podacima o kandidatima i instruktorima.

# Funkcionalnosti

* Registracija i prijava korisnika
* Polaganje testova
* Zakazivanje časova vožnje
* Pregled zakazanih časova
* Raspored vožnji za instruktore 
* Pregled kandidata
* Upravljanje kandidatima i instruktorima
* Pravljenje testova za kandidate

# Tehnologije

Aplikacija je razvijena korišćenjem sledećih tehnologija:

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS

**Backend**

* Node.js
* Express
* MongoDB
* Mongoose
* JWT autentifikacija

**DevOps**

* Docker
* Docker Compose

# Struktura projekta

Projekt je organizovan u sledeće direktorijume:

* client – frontend aplikacija razvijena u React-u
* server – backend API razvijen u Node.js i Express okruženju
* docker-compose.yml – konfiguracija za pokretanje aplikacije u Docker okruženju

# Pokretanje projekta

1. Klonirati repozitorijum:
git clone <link-do-repozitorijuma>

2. Pokrenuti aplikaciju pomoću Docker-a:
docker compose up --build

3. Nakon pokretanja aplikacija je dostupna na sledećim adresama:

Frontend aplikacija:
http://localhost:5173

Backend API:
http://localhost:5000

# Bezbednost

Aplikacija implementira osnovne bezbednosne mehanizme:

* JWT autentifikacija - za zaštitu API ruta i identifikaciju korisnika
* CORS zaštita - za kontrolu pristupa serveru sa drugih domena
* Zaštita od NoSQL Injection napada - korišćenjem Mongoose ORM-a

## Autor

Milica Miladinović
Fakultet organizacionih nauka
