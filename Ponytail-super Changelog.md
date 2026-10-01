# Ponytail-super Changelog

Tämä raportti kuvaa Ponytail-super-forkkiin toteutetut ohjemuutokset, niiden perustelut, agenttikohtaiset toimitusreitit ja tehdyt tarkistukset. Muutosten tavoitteena on säilyttää YAGNI ja tarpeettoman monimutkaisuuden ehkäisy siten, ettei lyhyyden tavoittelu syrjäytä vaatimuksia, luettavuutta, testejä tai suorituskykyä.

Raportti on laadittu projektin omistajalle toteutettujen muutosten katselmointia ja jatkoylläpitoa varten. Se kuvaa paikallisen toteutuksen, ei julkaistua uutta upstream-versiota tai empiirisesti osoitettua parannusta mallien toimintaan.

## Lähtökohta ja rajaus

- Raportin päivämäärä: 1.10.2026.
- Forkki: `https://github.com/tabulius-ux/ponytail-super`.
- Työhaara: `main`.
- Tarkastettu lähtöversio: `4.10.0`.
- Lähtöcommit: `e3ba2aa6f1e6f0bc4d69eb09c9f0d0a93af56156`, `chore: release v4.10.0 (#870)`.
- Versionumeroita ei muutettu. Kyseessä on ohjeiden ja niiden välityksen päivitys, ei version julkaisu.

Paikallinen lähtötilanne vastasi käyttäjän mainitsemaa commitia. Ennen muokkaamista selvitettiin ydinskillit, tiiviit sääntökopiot, komentomäärittelyt, ohjeita muodostavat JavaScript- ja Python-toteutukset, MCP-reitti, OpenClaw-generointi sekä nykyiset yhdenmukaisuus- ja integraatiotestit.

Työ painottui nykyisten ohjeiden muuttamiseen. Uutta sääntömoottoria, konfiguraatiojärjestelmää, arviointikehystä tai tuotantoriippuvuutta ei lisätty. Toteutuskoodin muutokset koskevat ohjetekstien välittämistä ja varatekstejä. Ponytailia ei asennettu eikä aktivoitu globaalisti. Maksullista mallivertailua ei käynnistetty.

## Yksinkertaisuuden uusi määritelmä

[Ydinskillin](skills/ponytail/SKILL.md) aiempi lyhyyttä suosiva ohje korvattiin periaatteella, jonka mukaan yksinkertaisin sopiva toteutus täyttää vaatimukset, säilyttää tarvittavan käyttäytymisen ja on helppo ymmärtää sekä muuttaa. Koodin, tiedostojen ja tokenien määrä on toissijainen eikä itsenäinen onnistumiskriteeri.

Päätösportaista poistettiin yhden rivin toteutuksen oma etusija. Jäljelle jäi kuusi askelta: todellinen tarve, olemassa oleva projektin ratkaisu, sopiva standardikirjasto, sopiva natiiviominaisuus, sopiva jo asennettu riippuvuus ja lopuksi selkeä toteutus jäljelle jäävään tarpeeseen.

Käytännön ohje täsmentää seuraavat seuraukset:

- Kuvaavia nimiä, selkeää monirivistä logiikkaa ja hyödyllisiä apufunktioita säilytetään.
- Vastuita ei yhdistetä suureen funktioon tai tiedostoon lukumäärän vähentämiseksi.
- Tiedoston jakaminen on perusteltua, kun se selkeyttää nykyisiä vastuita ja riippuvuuksia.
- Uusia kerroksia ei tehdä pelkästään lyhyiden tiedostojen tai tulevaisuudessa ehkä tarvittavan joustavuuden vuoksi.
- Pieni diffi on etu vasta, kun muutos tehdään oikeaan vastuukohtaan.
- Funktioille tai tiedostoille ei aseteta mielivaltaisia enimmäisrivimääriä.

YAGNI, olemassa olevan koodin tutkiminen, tavanomaiset ratkaisut ja bugien juurisyiden korjaaminen säilyivät. Muutos poistaa lyhyyden ja muiden tavoitteiden välisiä ristiriitaisia kannustimia; se ei itsessään todista syntyvän koodin laadun parantuneen.

## Käyttäytymisen säilyttäminen ja abstraktiot

Korvaavaa standardikirjaston toimintoa, natiiviominaisuutta tai riippuvuutta ei hyväksytä pelkän saatavuuden tai lyhyyden perusteella. Ohje edellyttää muutoksen kannalta olennaisten syötteiden, reunatapausten, virheiden, paluuarvojen, sivuvaikutusten ja kutsujien odotusten tarkistamista. Julkiset sopimukset, tietoturva, tietojen eheys, saavutettavuus ja tarvittava suorituskyky säilytetään. Tarkistuksen laajuus suhteutetaan korvaamisen riskiin.

Pyydetyn ominaisuuden hiljainen supistaminen erotettiin toteutustavan yksinkertaistamisesta. Vaatimuksen muuttaminen edellyttää sopimista käyttäjän kanssa.

Yhden toteutuksen rajapintaa tai yhden kutsujan kerrosta ei enää nimetä automaattisesti tarpeettomaksi. Abstraktion nykyinen tehtävä ratkaisee: ulkoisen I/O:n erottaminen, liiketoimintasäännön keskittäminen, testattavuus tai kytkentöjen vähentäminen voi perustella rajan. Rajapinnat ja riippuvuuksien injektointi eivät kuitenkaan muutu oletusvaatimuksiksi.

Yhteisen funktion kaikki kutsujat on edelleen tutkittava ennen muutosta. Aiempi suositus yhdestä yhteisestä guardista korvattiin vastuuta ja sopimuksia huomioivalla ohjeella: eri kutsujat voivat tarvita erilaista validointia, joten kaikkea validointia ei siirretä yhteiseen funktioon automaattisesti.

## Testiohjeen muutokset

Yhden ajettavan tarkistuksen korostaminen, yleinen testikehysten ja fixturejen torjunta sekä yksirivisten muutosten testivapautus poistettiin aktiivisista ohjeista.

Uusi ohje käyttää projektin olemassa olevaa testikehystä ja käytäntöjä. Uutta kehystä ei lisätä ilman tarvetta. Testien yhdistäminen ja parametrointi ovat sallittuja, kun käyttäytymistapaukset, olennaiset väittämät, kuvaavat nimet ja epäonnistumisten paikannettavuus säilyvät.

Testin poistaminen edellyttää konkreettista perustelua, kuten muualla jo olevaa vastaavaa kattavuutta tai muuttunutta vaatimusta. Toteutuksen lyheneminen ei itsessään oikeuta testien vähentämiseen. Bugikorjaukseen lisätään mahdollisuuksien mukaan kohdennettu regressiotesti, joka epäonnistuu alkuperäisellä bugilla.

Tarkistusten tarve riippuu muuttuneesta käyttäytymisestä ja riskistä. Myös yhden rivin muutos voi vaatia testin esimerkiksi käyttöoikeuksissa, raja-arvoissa, rahalaskennassa tai tietojen käsittelyssä. Testien määrälle ei aseteta keinotekoista ylärajaa eikä jokaiseen triviaalimuutokseen vaadita raskasta testisarjaa.

## Suorituskyvyn säilyttäminen

Ydinohjeeseen, tiiviisiin kopioihin, fallbackeihin sekä review- ja audit-ohjeisiin lisättiin rajattu suorituskyvyn tarkastelu. Se koskee tietokantoja, verkkokutsuja, kokoelmia, rinnakkaisuutta ja suuria aineistoja koskevia muutoksia.

Ohje käskee tarkastamaan työn ja ulkoisten kutsujen kasvun syötteen mukana. Erähakua ei korvata rivikohtaisilla kyselyillä ilman perusteltua syytä. Tarpeellinen sivutus, rinnakkaisuusrajat ja muut nykyiset suojaukset säilytetään. Huonompaa aikavaativuutta ei hyväksytä pelkän lyhyyden vuoksi.

N+1-ongelman välttäminen tunnistetaan nykyisen toiminnan asianmukaiseksi toteuttamiseksi, ei automaattisesti ennenaikaiseksi optimoinniksi. Aidosti pienelle ja rajatulle aineistolle yksinkertainen algoritmi voi olla oikea valinta, mutta oleellinen kokoraja tai oletus on nimettävä.

Näyttö voi olla koodin tarkastelu, kyselymäärää tarkistava testi tai kohdennettu mittaus. Jokaiseen muutokseen ei vaadita benchmarkia.

## Review ja audit

[Review](skills/ponytail-review/SKILL.md) ja [audit](skills/ponytail-audit/SKILL.md) säilyttävät fokuksensa tarpeettomassa monimutkaisuudessa. Ne eivät muutu yleisiksi kaiken kattaviksi katselmoinneiksi, mutta niiden omien poistamis- ja korvaamisehdotusten oikeellisuus-, turvallisuus- ja suorituskykyvaikutukset kuuluvat tarkasteluun.

Merkittävästä ehdotuksesta pitää ilmetä sijainti, ehdotettu muutos, vähenevä nykyinen monimutkaisuus, poiston tarpeettomuuden tai korvauksen riittävyyden perustelu, säilytettävä käyttäytyminen sekä havainto tai vielä tarvittava tarkistus.

- `supported` merkitsee näytöllä perusteltua ehdotusta.
- `candidate` merkitsee lisäselvitystä tarvitsevaa ehdokasta.
- Epävarmuus ei oikeuta poistamaan koodia.
- Tärkeysjärjestys perustuu nykyiseen ylläpitohyötyyn, varmuuteen ja riskiin.
- Rivi- ja riippuvuusmäärät voivat olla lisätietoa, mutta eivät ainoa mittari.
- Perusteettoman tarkkoja säästöarvioita ei anneta.
- Tarpeelliset testit ja fixturet eivät ole ylimitoitusta.

Molemmat toiminnot raportoivat eivätkä sovella korjauksia automaattisesti. Tilanne, jossa perusteltuja yksinkertaistuksia ei löydy, ei enää tuota yleiseksi hyväksynnäksi tulkittavaa kehotusta julkaista muutokset.

Review-esimerkeistä poistettiin sähköpostin yleisen validoinnin korvaaminen pelkällä @-merkin etsimisellä. Kokoelmaoperaation korvausesimerkki edellyttää pituuserojen, duplikaattiavainten ja virhesyötteiden käyttäytymisen selvittämistä ennen muutosta.

## Selitykset ja näkyvä tekninen velka

Kiinteä kolmen rivin vastausraja ja selityksen vertaaminen koodin pituuteen poistettiin. Lyhyys säilyy oletuksena, mutta syyt, ulkoiset rajoitteet, olennaiset oletukset, kompromissit, tehdyt tarkistukset ja tärkeät tarkistamatta jääneet asiat on voitava kuvata. Käyttäjän pyytämät raportit ja selitykset annetaan pyydetyssä laajuudessa.

`ponytail:`-merkintä säilytettiin tietoisille oikopoluille. Sen on nimettävä konkreettinen rajoite tai oletus ja ehto uudelleenarvioinnille. Kommentti ei tee vaatimuksen rikkovasta ratkaisusta hyväksyttävää.

[Debt-skill](skills/ponytail-debt/SKILL.md) erottaa merkittyjen oikopolkujen inventaarion kaikesta teknisestä velasta. Puuttuva uudelleenarviointiehto saa `no-trigger`-merkinnän, puuttuva konkreettinen rajoite `no-ceiling`-merkinnän. Tyhjä tulos kertoo, ettei merkintöjä löytynyt; se ei todista velattomuutta.

## Käyttötilat ja ohjeiden toimitusreitit

Kaikki aktiiviset intensiteetit säilyttävät samat käyttäytymisen, luettavuuden, testauksen, suorituskyvyn ja turvallisuuden suojaukset. Lite ehdottaa sopivia vaihtoehtoja, full soveltaa päätösportaita ja ultra kyseenalaistaa spekulatiivista laajuutta voimakkaammin. Ultra ei oikeuta pudottamaan pyydettyä käyttäytymistä.

Välimuistiesimerkki muutettiin pyynnöksi, jossa on 60 sekunnin vanheneminen. Jokainen tila säilyttää vanhenemisen ja invalidointisopimuksen; välimuisti ilman vaadittua vanhenemista ei käy lyhyemmäksi korvaajaksi.

| Reitti | Lähde ja toteutettu muutos | Yhdenmukaisuuden tarkistus |
|---|---|---|
| Suoraan ladattavat skillit | Kuusi `skills/*/SKILL.md`-tiedostoa päivitettiin. | Sisältösopimuksia ja kopioita tarkistavat testit. |
| JavaScript-ohjeenmuodostus | `hooks/ponytail-instructions.js` lukee ydinskillin ja suodattaa tilarivit sekä esimerkit. Sisäinen varateksti päivitettiin. | Jokaisen intensiteetin normaali teksti, suodatus ja todellinen tiedostonlukuvirheen fallback. |
| Jaetun muodostajan käyttäjät | Hookit, Pi, OpenCode ja MCP saavat uuden ydinohjeen yhteisen muodostajan kautta. | Olemassa olevat hook- ja integraatiotestit sekä laajennetut sisältötarkistukset. |
| Jaetun muodostajan review-tila | Pelkkä viittaus review-skilliin korvattiin varsinaisen review-ohjeen lukemisella. Lukemisen epäonnistuessa välitetään raportoiva varateksti suojauksineen. | Normaali review-sisältö ja puuttuvan review-tiedoston tapaus. |
| Hermes | `__init__.py` lukee skillit omalla Python-reitillään. Sen erilliset core- ja review-fallbackit päivitettiin. | JavaScriptin ja Pythonin normaalien tekstien sekä fallbackien vertailu. |
| Tiiviit staattiset säännöt | `AGENTS.md` ja seitsemän käsin ylläpidettyä agenttikopiota päivitettiin. Agenttikohtainen frontmatter säilytettiin. | Kopioiden vertailu ja 27 keskeisen ilmauksen tarkistus. |
| Komentomäärittelyt | Kuusi TOML-komentoa ja kuusi OpenCode-komentoa päivitettiin. Peruskomennossa on tiivis ohje, muissa vastaavan skillin sisältö. | Sisältöjen yhtäläisyys ja argumenttipaikkamerkkien säilyminen. |
| OpenClaw | Kuusi kopioita muodostettiin nykyisellä `build-openclaw-skills.js`-skriptillä. Lyhyet kuvaukset päivitettiin. | Generoitujen tiedostojen ajantasaisuustestit. |
| Pluginien kuvaukset | Lyhintä toteutusta ja yhden rivin ratkaisuja suosivat kuvaukset muutettiin vastaamaan uusia periaatteita. | Kohdennettu tekstihaku ja diffikatselmointi. |

Lähteet ja kopiot on dokumentoitu myös [agent-portability.md-tiedostossa](docs/agent-portability.md). Uutta keskitysmekanismia ei rakennettu. Käsin ylläpidettävien kopioiden ja kahden runtime-kielen varatekstien synkronointi on edelleen ylläpitovastuu, jota testit tukevat.

## Dokumentaatio ja esimerkit

Englannin-, espanjan- ja koreankieliset README-tiedostot päivitettiin muutettujen periaatteiden ja turvallisuusväitteiden osalta. Yleinen täydellisen turvallisuuden lupaus korvattiin kokeen rajausta kuvaavalla tekstillä. Historiallinen 20/20-tulos on kyseisen adversaarisen testijoukon tulos, ei yleinen turvallisuustakuu.

Dokumentaatio erottaa ohjeiden tavoitteen, historiallisen mittauksen ja asiat, joita koe ei osoita. Uusien sääntöjen vaikutusta mallien laatuun ei väitetä mitatuksi. Gain-skillin kortti kertoo historiallisen viiden tehtävän kokeen luvuista eikä nykyisestä projektista tai uudistettujen sääntöjen vaikutuksesta.

| Esimerkkialue | Muutos |
|---|---|
| Historiallinen sähköpostivalidointi | Alkuperäisen vastauksen eteen lisättiin rajaus: regex ei ole yleinen validointi eikä esimerkin 99 prosentin väite ole tällä kokeella perusteltu. |
| Historialliset debounce-, CSV-, countdown- ja rate-limit-vastaukset | Alkuperäiset vastaukset säilytettiin. Johdantohuomautukset nimeävät olennaiset käyttäytymis- ja käyttöympäristörajaukset. |
| Esimerkkien hakemistosivu | Viisi historiallista mallivastausta erotettiin muista havainnollistavista vertailuista. Rivimääräeroa ei esitetä käyttäytymisvastaavuuden todisteena. |
| Modal dialog | Lisättiin nimen ja kuvauksen saavutettavuuskytkennät. Poistettiin yleinen väite oletusarvoisesta saavutettavuudesta ja täsmennettiin natiiviprimitivin rajat. |
| Infinite scroll | Esimerkki merkitty osittaiseksi näkyvyydentunnistuksen havainnollistukseksi. Se ei korvaa sellaisenaan lataus-, virhe-, sivutus- ja rinnakkaisuuskäyttäytymistä. |
| Group by ja deep clone | Korvaavuus sidottiin kohderuntimeen, paluutyyppeihin, avainkäsittelyyn ja tuettuihin arvoihin. |
| URL-parametrit | Rajattiin esimerkin sopimus merkkijonoihin ja toistuviin avaimiin; parserien vastaavuutta ei oleteta. |
| Numeroiden muotoilu | Prosenttiesimerkin desimaalit asetettiin eksplisiittisesti. Täsmennettiin pyöristystä, tarkkaa tulostesopimusta ja rahalaskennan eroa esitysmuotoon. |
| Natiiviratkaisujen opas | Korvauslista muutettiin ehdokkaiden listaksi. Korjattiin muun muassa jaetun debounce-ajastimen oikopolku, matalan ja rekursiivisen yhdistämisen ero, tallennusratkaisujen sopimuserot ja indeksin ero poistettujen rivien suodatukseen. |

`benchmarks/`-hakemiston ohjeita, raakadataa tai vanhoja kokeita ei muutettu. Myös `assets/` säilyi ennallaan. Viiden historiallisen esimerkin alkuperäinen sisältö vertailtiin lähtöcommitiin uusien huomautusten poistamisen jälkeen ja todettiin muuttumattomaksi.

## Skenaarioiden johdonmukaisuusarvio

Seuraava arvio perustuu kirjoitettujen ohjeiden lukemiseen. Se ei ole mallikoe eikä ennuste siitä, että agentti aina toimisi ohjeen mukaisesti.

| Tilanne | Ohjeen mukainen ratkaisu | Peruste |
|---|---|---|
| Viisi merkitykseltään erillistä testiä korvataan yhdellä onnistuvan polun testillä. | Hylätään kattavuutta heikentävä korvaus. | Tapaukset, väittämät ja epäonnistumisten paikannettavuus on säilytettävä. |
| Erähaku korvataan lyhyemmällä silmukalla, joka tekee yhden kyselyn jokaiselle riville. | Lyhyys ei kelpaa perusteluksi. | Ulkoisten kutsujen kasvu ja N+1-riski on arvioitava; tarvittava erähaku säilytetään. |
| Yhden toteutuksen rajapinta erottaa ulkoisen palvelun liiketoimintalogiikasta. | Sitä ei poisteta toteutusmäärän perusteella. | Nykyinen I/O-raja voi olla hyödyllinen yhdelläkin toteutuksella. |
| Pitkä tiedosto sisältää useita erillisiä vastuita. | Perusteltu jakaminen sallitaan. | Nykyisten vastuiden selkeys ratkaisee, ei tiedostojen minimimäärä. |
| Uusi kerros palvelisi vain mahdollista tulevaa tarvetta. | Hylätään nykyisen tarpeen puuttuessa. | YAGNI ja spekulatiivisten kerrosten torjunta säilyvät. |
| Selvä monirivinen ehto muutetaan vaikealukuiseksi yhdeksi lausekkeeksi. | Hylätään luettavuuden heikentyminen. | Selkeä logiikka menee rivimäärän edelle. |

## Tarkistukset ja tulokset

### Automaattiset testit

Koko testiketju ajettiin onnistuneesti komennolla `PATH=/tmp/ponytail-test-env/bin:$PATH npm test`. Testiympäristössä käytettiin Node.js-versiota `24.19.0` ja Python-versiota `3.14.7` Linuxissa.

| Testikokonaisuus | Läpäisty | Epäonnistunut |
|---|---:|---:|
| Päätason `tests/*.test.js` | 164 | 0 |
| Pi-laajennuksen testit | 23 | 0 |
| MCP-integraation testit | 6 | 0 |
| Yhteensä | 193 | 0 |

Testiajon yhteenvedoissa ei ollut peruutettuja tai ohitettuja testitapauksia. Tämä ei tarkoita, että kaikkien käyttöjärjestelmien ja agenttisovellusten natiivit suorituspolut olisi ajettu: ympäristökohtaiset testit voivat rajata toimintaansa alustansa mukaan.

Uusi `tests/instructions.test.js` tarkistaa keskeisten suojausten välittymisen kaikissa kolmessa intensiteetissä ja fallbackeissa, tilasuodatuksen, todellisen lukuvirheen reitin sekä review- ja audit-ohjeiden raportoivan ja perusteluja vaativan sopimuksen. Testit käyttävät projektin nykyistä Node-testikehystä.

Nykyisiä testejä päivitettiin vastaamaan uutta sopimusta. Esimerkiksi Cursorin ultra-rivin testi tarkistaa uuden rivin säilymisen eikä vanhaa YAGNI extremist -sanamuotoa. Pi:n suodatustesti säilyttää kaksoispisteellisten sääntöjen regressiotarkistuksen ja käyttää päivitettyjä välimuistiesimerkkejä. Hermesiin lisättiin vertailu yhteisen muodostajan teksteihin ja fallbackeihin. MCP-testit tarkistavat jokaisen intensiteetin sisällön vastaavuuden yhteiseen muodostajaan.

### Muut tarkistukset

| Tarkistus | Tulos ja tulkinta |
|---|---|
| `node scripts/check-rule-copies.js` | Seitsemän agenttikopiota vastaavat tiivistä lähdettä. Ydinskillistä ja AGENTS-tiedostosta löytyvät 27 tarkistettua keskeistä ilmausta. |
| `node scripts/check-versions.js` | Kahdeksan versiotiedostoa ovat edelleen yhdenmukaisesti versiossa 4.10.0. |
| OpenClaw-generointi ja sen testit | Kuusi generoitua skilliä vastaavat lähteitä. |
| Komentokopioiden testit | Kuusi TOML- ja kuusi OpenCode-komentoa vastaavat soveltuvaa lähdetekstiä; argumenttipaikkamerkit säilyvät. |
| TOML-jäsennys Pythonin `tomllib`-moduulilla | Kaikki kuusi komentotiedostoa jäsentyvät ja sisältävät ei-tyhjän promptin. |
| Vanhojen ongelmailmausten kohdennettu haku | Aktiivisiin ohjeisiin ei löytynyt haettuja ristiriitaisia minimointikäskyjä. Historialliset aineistot ja niiden testit rajattiin erikseen. |
| `git diff --check` | Ei havaittuja whitespace-virheitä. |
| Historiallisten esimerkkien vertailu lähtöcommitiin | Viiden mallivastauksen alkuperäinen sisältö säilyi; vain ulkopuoliset rajaukset lisättiin. |
| Prosenttimuotoilun esimerkin suora tarkistus | Päivitetty esimerkki tuottaa dokumentoidun arvon `74.5%`. |
| Diffin katselmointi | Muutokset keskittyvät ohjeisiin, niiden välitykseen, dokumentaatioon ja niitä tarkistaviin testeihin. |

### Testiympäristön ongelmat ja ratkaisut

Ensimmäinen hiekkalaatikossa tehty testiajo epäonnistui aliohjelmien `EPERM`-virheisiin ja tyhjiin tulosteisiin. Ongelma toistui myös pienessä aliohjelmadiagnostiikassa. Testit ajettiin siksi hiekkalaatikon ulkopuolella; tuotantokoodia tai testien väittämiä ei muutettu ympäristörajoituksen peittämiseksi.

Seuraava ajo paljasti vanhaan ultra-tekstiin sidotun testin sekä puuttuvan `pandas`-riippuvuuden historiallisessa CSV-tarkistuksessa. Ultra-testi päivitettiin uuteen ohjesopimukseen. Pandas asennettiin erilliseen `/tmp/ponytail-test-env`-virtuaaliympäristöön nykyisen testin suorittamista varten. Projektin riippuvuustiedostoja tai globaalia Ponytail-asennusta ei muutettu. Tämän jälkeen koko testiketju läpäisi.

Väliaikaiset testilokit ja virtuaaliympäristö sijaitsevat `/tmp`-hakemistossa eivätkä kuulu commitiin. Raportti tallentaa niiden olennaiset tulokset. Myöhempi toisto vaatii paikalliset testiedellytykset, kuten Pythonin ja CSV-tarkistuksen tarvitseman pandasin.

## Rajoitukset ja ylläpito

Tekstiä ja kopioita vertaavat testit osoittavat ohjeiden välittymisen ja havaitsevat tiettyjä ristiriitoja. Ne eivät osoita, että kielimalli noudattaisi ohjetta kaikissa tilanteissa, eivätkä mittaa tuotetun koodin laatua, suorituskykyä tai turvallisuutta.

Kaikkia agenttisovelluksia ei käynnistetty erikseen. Hook- ja integraatiotestit eivät korvaa jokaisen hostin käyttöliittymässä, omalla versiolla ja jokaisessa käyttöjärjestelmässä tehtävää päästä päähän -kokeilua. Windowsin natiivia toimintaa tai MCP:n kaikkia ulkoisia hostiyhteyksiä ei tämän työn perusteella voi väittää erikseen varmennetuiksi.

Historiallisissa mallivastauksissa ja benchmark-ohjeissa on tarkoituksellisesti vanhaa tekstiä. Niitä ei kirjoitettu uudelleen uuden ohjesopimuksen mukaisiksi. Nykyinen dokumentaatio nimeää niiden rajat, joten niitä ei pidä käyttää sellaisenaan ajantasaisena toteutusohjeena.

Käsin ylläpidetyt komentotekstit, staattiset säännöt ja fallbackit on jatkossakin päivitettävä yhdessä lähteiden kanssa. OpenClaw-kopiot päivitetään nykyisellä generaattorilla. Muutosten jälkeen tulee ajaa olemassa olevat yhdenmukaisuustarkistukset ja relevantit testit.

Katselmoinnissa ei löytynyt jäljelle jääviä haettujen minimointikäskyjen ristiriitoja aktiivisista ohjeista. Tämä havainto on rajattu tehtyihin hakuihin, testien kattamiin sisältösopimuksiin ja käsin tehtyyn tarkastukseen.

## Commitin sisältö

Tämä raportti sisältyy samaan paikalliseen commitiin kuin toteutetut ohje-, dokumentaatio- ja testimuutokset. Käyttäjän pyynnön mukaisesti mukaan otetaan myös ennestään versionhallinnan ulkopuolella ollut `.directory`, jonka sisältö on työpöydän kansiokuvakkeen asetus `Icon=folder-important`. Se ei vaikuta Ponytailin toimintaan.

Alla on commitia varten tarkistettu tiedostoluettelo. Tilapäiset työskriptit, testilokit, virtuaaliympäristö ja Gitin ohittamat tiedostot eivät kuulu luetteloon.

Luettelo sisältää 70 tiedostoa raportti mukaan lukien.

- `.agents/rules/ponytail.md`
- `.claude-plugin/marketplace.json`
- `.claude-plugin/plugin.json`
- `.clinerules/ponytail.md`
- `.codex-plugin/plugin.json`
- `.cursor/rules/ponytail.mdc`
- `.devin-plugin/plugin.json`
- `.directory`
- `.github/copilot-instructions.md`
- `.github/plugin/marketplace.json`
- `.github/plugin/plugin.json`
- `.grok-plugin/marketplace.json`
- `.kiro/steering/ponytail.md`
- `.openclaw/skills/ponytail-audit/SKILL.md`
- `.openclaw/skills/ponytail-debt/SKILL.md`
- `.openclaw/skills/ponytail-gain/SKILL.md`
- `.openclaw/skills/ponytail-help/SKILL.md`
- `.openclaw/skills/ponytail-review/SKILL.md`
- `.openclaw/skills/ponytail/SKILL.md`
- `.opencode/command/ponytail-audit.md`
- `.opencode/command/ponytail-debt.md`
- `.opencode/command/ponytail-gain.md`
- `.opencode/command/ponytail-help.md`
- `.opencode/command/ponytail-review.md`
- `.opencode/command/ponytail.md`
- `.qoder-plugin/plugin.json`
- `.qoder/rules/ponytail.md`
- `.windsurf/rules/ponytail.md`
- `AGENTS.md`
- `Ponytail-super Changelog.md`
- `README.es.md`
- `README.ko.md`
- `README.md`
- `__init__.py`
- `commands/ponytail-audit.toml`
- `commands/ponytail-debt.toml`
- `commands/ponytail-gain.toml`
- `commands/ponytail-help.toml`
- `commands/ponytail-review.toml`
- `commands/ponytail.toml`
- `docs/agent-portability.md`
- `docs/platform-native.md`
- `examples/README.md`
- `examples/csv-sum.md`
- `examples/debounce.md`
- `examples/deep-clone.md`
- `examples/email-validation.md`
- `examples/group-by.md`
- `examples/infinite-scroll.md`
- `examples/modal-dialog.md`
- `examples/number-formatting.md`
- `examples/rate-limit.md`
- `examples/react-countdown.md`
- `examples/url-params.md`
- `gemini-extension.json`
- `hooks/ponytail-instructions.js`
- `pi-extension/test/helpers.test.js`
- `ponytail-mcp/test/instructions.test.js`
- `scripts/build-openclaw-skills.js`
- `scripts/check-rule-copies.js`
- `skills/ponytail-audit/SKILL.md`
- `skills/ponytail-debt/SKILL.md`
- `skills/ponytail-gain/SKILL.md`
- `skills/ponytail-help/SKILL.md`
- `skills/ponytail-review/SKILL.md`
- `skills/ponytail/SKILL.md`
- `tests/commands.test.js`
- `tests/cursor-hooks.test.js`
- `tests/hermes-plugin.test.js`
- `tests/instructions.test.js`
