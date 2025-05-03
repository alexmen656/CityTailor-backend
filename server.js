const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const port = 4040;

// .env-Datei laden
dotenv.config();

// Middleware für JSON und CORS
app.use(express.json());
app.use(cors());

// Google Gemini API konfigurieren
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Gemini-Modell initialisieren
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

// Statische Daten für Amsterdam vom 20.-23. Mai 2025
const amsterdamData = {
  location: "Amsterdam",
  period: {
    startDate: "2025-05-20",
    endDate: "2025-05-23",
    durationInDays: 4
  },
  dailyPlans: [
    {
      date: "2025-05-20",
      dayNumber: 1,
      activities: [
        {
          time: "09:00 - 12:00",
          title: "Rijksmuseum",
          description: "Besuche das weltberühmte Rijksmuseum mit Werken von Rembrandt und Vermeer",
          location: "Museumstraat 1",
          category: "Kunst"
        },
        {
          time: "12:30 - 14:00",
          title: "Mittagessen im Vondelpark",
          description: "Genieße ein entspanntes Picknick im berühmten Stadtpark von Amsterdam",
          location: "Vondelpark",
          category: "Gastronomie"
        },
        {
          time: "14:30 - 16:30",
          title: "Grachtenfahrt",
          description: "Erkunde Amsterdam vom Wasser aus mit einer traditionellen Grachtenfahrt",
          location: "Damrak",
          category: "Sightseeing"
        },
        {
          time: "18:00 - 20:00",
          title: "Abendessen im Jordaan",
          description: "Probiere lokale Spezialitäten im historischen Jordaan-Viertel",
          location: "Jordaan",
          category: "Gastronomie"
        }
      ]
    },
    {
      date: "2025-05-21",
      dayNumber: 2,
      activities: [
        {
          time: "10:00 - 12:00",
          title: "Anne-Frank-Haus",
          description: "Besuche das bewegende Museum im ehemaligen Versteck von Anne Frank",
          location: "Prinsengracht 263-267",
          category: "Geschichte"
        },
        {
          time: "12:30 - 14:00",
          title: "Mittagessen am Leidseplein",
          description: "Genieße die lebendige Atmosphäre auf einem der belebtesten Plätze",
          location: "Leidseplein",
          category: "Gastronomie"
        },
        {
          time: "14:30 - 17:00",
          title: "Van Gogh Museum",
          description: "Bewundere die weltgrößte Sammlung von Werken Vincent van Goghs",
          location: "Museumplein 6",
          category: "Kunst"
        },
        {
          time: "19:00 - 21:00",
          title: "Abendessen in Noord",
          description: "Entdecke das aufstrebende Viertel Amsterdam Noord mit innovativen Restaurants",
          location: "NDSM-Werft",
          category: "Gastronomie"
        }
      ]
    },
    {
      date: "2025-05-22",
      dayNumber: 3,
      activities: [
        {
          time: "09:30 - 11:30",
          title: "Bloemenmarkt",
          description: "Besuche den weltberühmten schwimmenden Blumenmarkt",
          location: "Singel",
          category: "Shopping"
        },
        {
          time: "12:00 - 14:00",
          title: "Albert Cuyp Markt",
          description: "Erlebe den größten Tagesmarkt Europas mit lokalen Spezialitäten",
          location: "Albert Cuypstraat",
          category: "Shopping"
        },
        {
          time: "14:30 - 16:30",
          title: "Heineken Experience",
          description: "Tauche ein in die Geschichte des berühmten niederländischen Bieres",
          location: "Stadhouderskade 78",
          category: "Kultur"
        },
        {
          time: "18:00 - 20:00",
          title: "Abendessen im De Pijp",
          description: "Genieße das multikulturelle Gastronomieangebot im trendigen Viertel De Pijp",
          location: "De Pijp",
          category: "Gastronomie"
        },
        {
          time: "21:00 - 23:00",
          title: "Nachtleben im Leidseplein",
          description: "Erlebe das pulsierende Nachtleben Amsterdams",
          location: "Leidseplein",
          category: "Nachtleben"
        }
      ]
    },
    {
      date: "2025-05-23",
      dayNumber: 4,
      activities: [
        {
          time: "10:00 - 12:00",
          title: "Stadtwanderung durch die Grachten",
          description: "Erkundung der malerischen Grachtengürtel und versteckten Höfe",
          location: "Zentrum",
          category: "Architektur"
        },
        {
          time: "12:30 - 14:00",
          title: "Mittagessen in einem Bruin Café",
          description: "Erlebe die gemütliche Atmosphäre eines traditionellen niederländischen Cafés",
          location: "Spui",
          category: "Gastronomie"
        },
        {
          time: "14:30 - 16:00",
          title: "Begijnhof",
          description: "Besuche einen der ältesten Innenhöfe Amsterdams, eine Oase der Ruhe",
          location: "Begijnhof",
          category: "Geschichte"
        },
        {
          time: "16:30 - 18:00",
          title: "Einkaufen in den Neun Straßen",
          description: "Entdecke die charmanten Boutiquen in diesem Shoppingviertel",
          location: "De Negen Straatjes",
          category: "Shopping"
        }
      ]
    }
  ],
  recommendations: {
    food: ["Stroopwafel", "Bitterballen", "Holländischer Käse", "Poffertjes", "Hering"],
    transport: ["OV-Chipkaart kaufen", "Fahrrad mieten", "Canal Bus nutzen"],
    tips: ["Museumspass erwägen für mehrere Museumsbesuche", "Bei Sonnenuntergang die Westergasfabriek besuchen", "Früh buchen für Anne-Frank-Haus"]
  }
};

// Funktion zum Generieren eines individuellen Reiseplans mit Gemini
async function generateTripWithGemini(city, startDate, endDate, interests = []) {
  // Berechne Anzahl der Tage
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // +1 um Enddatum einzuschließen
  
  // Formatiere die Interessen für den Prompt
  let interestsText = "";
  if (interests && interests.length > 0) {
    const sortedInterests = [...interests].sort((a, b) => b.rating - a.rating);
    interestsText = `\n\nBenutzerinteressen (Skala 1-10, höher = wichtiger):\n${sortedInterests.map(
      interest => `- ${interest.name}: ${interest.rating}`
    ).join('\n')}`;
  }
  
  // Erstelle einen strukturierten Prompt für Gemini
  const prompt = `Erstelle einen detaillierten Reiseplan für ${city} von ${startDate} bis ${endDate} (${durationInDays} Tage).${interestsText}
  
  Gib die Antwort in diesem exakten JSON-Format zurück:
  {
    "location": "${city}",
    "period": {
      "startDate": "${startDate}",
      "endDate": "${endDate}",
      "durationInDays": ${durationInDays}
    },
    "dailyPlans": [
      /* Ein Objekt pro Tag mit:
        - date: das Datum im Format YYYY-MM-DD
        - dayNumber: 1, 2, 3 usw.
        - activities: Array von 4-5 Aktivitäten pro Tag, jede mit:
          - time: z.B. "09:00 - 12:00"
          - title: Name der Aktivität/Sehenswürdigkeit
          - description: Eine kurze Beschreibung
          - location: Der genaue Ort in der Stadt
          - category: Eine Kategorie wie "Kunst", "Geschichte", "Gastronomie", "Sightseeing" usw.
      */
    ],
    "recommendations": {
      "food": ["5 typische lokale Spezialitäten für diese Stadt"],
      "transport": ["3 Transporttipps für diese Stadt"],
      "tips": ["3 allgemeine Reisetipps für diese Stadt"]
    }
  }

  Achte auf folgende Punkte:
  1. Berücksichtige tatsächlich existierende, bekannte Sehenswürdigkeiten und Attraktionen in ${city}
  2. Erstelle eine logistische sinnvolle Reihenfolge der Aktivitäten
  3. Passe die Empfehlungen an die Besonderheiten von ${city} an
  4. Achte auf korrekte deutschsprachige Beschreibungen
  5. Achte auf ein realistisches Zeitmanagement zwischen den Aktivitäten
  6. Berücksichtige die Benutzerinteressen bei der Auswahl der Aktivitäten - bevorzuge Aktivitäten aus Kategorien mit höherem Rating`;

  console.log(prompt);
  
  try {
    // Gemini-API aufrufen
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    // Extrahiere den JSON-Teil
    let jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                    textResponse.match(/\{[\s\S]*\}/);
    
    let jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textResponse;
    
    // Entferne eventuelle Markdown-Code-Marker und bereinige das JSON
    jsonText = jsonText.replace(/```json|```/g, '').trim();
    
    // Parse das JSON
    const tripData = JSON.parse(jsonText);
    console.log("Gemini-generierter Reiseplan erstellt");
    return tripData;
  } catch (error) {
    console.error("Fehler bei der Erstellung des Reiseplans mit Gemini:", error);
    throw new Error("Konnte keinen Reiseplan mit Gemini erstellen");
  }
}

// API Endpunkte
app.post('/api/trips', async (req, res) => {
  console.log('Empfangene Daten:', req.body);
  
  // Überprüfen, ob es sich um Amsterdam handelt und im Zeitraum 20-23. Mai liegt
  const location = req.body.location?.toLowerCase();
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const interests = req.body.interests || [];
  
  try {
    if (location && location.includes('amsterdam') && 
        startDate === '2025-05-20' && endDate === '2025-05-23') {
      console.log('Statische Amsterdam-Daten werden zurückgegeben');
      // Die vorgefertigten Amsterdam-Daten zurückgeben
      res.status(201).json({
        success: true,
        message: "Reiseplan erstellt",
        data: amsterdamData
      });
    } else if (location && startDate && endDate) {
      // Für alle anderen Städte Gemini verwenden
      console.log(`Generiere Reiseplan für ${location} mit Gemini`);
      console.log(`Benutzerinteressen:`, interests);
      
      try {
        const tripData = await generateTripWithGemini(
          req.body.location,
          startDate,
          endDate,
          interests
        );
        
        res.status(201).json({
          success: true,
          message: "Reiseplan mit Gemini erstellt",
          data: tripData
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Fehler bei der Erstellung des Reiseplans",
          error: error.message
        });
      }
    } else {
      // Fehlende Parameter
      res.status(400).json({
        success: false,
        message: "Fehlende Parameter: location, startDate und endDate werden benötigt"
      });
    }
  } catch (error) {
    console.error("Server-Fehler:", error);
    res.status(500).json({
      success: false,
      message: "Interner Serverfehler",
      error: error.message
    });
  }
});

// Einfacher Status-Endpunkt
app.get('/api/status', (req, res) => {
  res.json({
    status: "online",
    message: "CityTailor-Backend läuft mit Gemini-Integration"
  });
});

// Server starten
app.listen(port, '0.0.0.0', () => {
  console.log(`Server läuft auf http://localhost:${port}`);
  console.log(`Server ist im Netzwerk erreichbar unter http://[DEINE-IP-ADRESSE]:${port}`);
  console.log(`Gemini-Integration ist aktiv. API-Key ${API_KEY === "DEIN_GEMINI_API_KEY" ? "FEHLT NOCH" : "wurde konfiguriert"}`);
});