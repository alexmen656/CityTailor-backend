const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createApi } = require('unsplash-js');
const fetch = require('node-fetch');
const app = express();
const port = 4040;

dotenv.config();

app.use(express.json());
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
  fetch: fetch
});

async function getCityImage(cityName) {
  try {
    const result = await unsplash.search.getPhotos({
      query: `${cityName} city`,
      orientation: 'landscape',
      perPage: 1
    });
    
    if (result.errors) {
      console.error('Unsplash API Fehler:', result.errors[0]);
      return null;
    }
    
    if (result.response && result.response.results && result.response.results.length > 0) {
      const photo = result.response.results[0];
      return {
        url: photo.urls.regular,
        description: photo.alt_description || `Foto von ${cityName}`,
        photographer: photo.user.name,
        photographerLink: photo.user.links.html
      };
    }
    
    return null;
  } catch (error) {
    console.error('Fehler beim Abrufen des Stadtbildes:', error);
    return null;
  }
}

function cleanupResponseData(data) {
  if (typeof data === 'string') {
    return data.replace(/(\*\*|__)/g, '');
  } else if (Array.isArray(data)) {
    return data.map(item => cleanupResponseData(item));
  } else if (data !== null && typeof data === 'object') {
    const cleanedObj = {};
    for (const key in data) {
      cleanedObj[key] = cleanupResponseData(data[key]);
    }
    return cleanedObj;
  }
  return data;
}

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

async function generateTripWithGemini(city, startDate, endDate, interests = [], language = 'DE') {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  let interestsText = "";
  if (interests && interests.length > 0) {
    const sortedInterests = [...interests].sort((a, b) => b.rating - a.rating);
    interestsText = `\n\nBenutzerinteressen (Skala 1-10, höher = wichtiger):\n${sortedInterests.map(
      interest => `- ${interest.name}: ${interest.rating}`
    ).join('\n')}`;
  }
  
  const languageConfig = {
    'DE': {
      promptTitle: `Erstelle einen detaillierten Reiseplan für ${city} von ${startDate} bis ${endDate} (${durationInDays} Tage).`,
      interestsTitle: 'Benutzerinteressen (Skala 1-10, höher = wichtiger):',
      jsonFormat: 'Gib die Antwort in diesem exakten JSON-Format zurück:',
      guidelines: [
        `Berücksichtige tatsächlich existierende, bekannte Sehenswürdigkeiten und Attraktionen in ${city}`,
        'Erstelle eine logistische sinnvolle Reihenfolge der Aktivitäten',
        `Passe die Empfehlungen an die Besonderheiten von ${city} an`,
        'Achte auf korrekte deutschsprachige Beschreibungen',
        'Achte auf ein realistisches Zeitmanagement zwischen den Aktivitäten',
        'Berücksichtige die Benutzerinteressen bei der Auswahl der Aktivitäten - bevorzuge Aktivitäten aus Kategorien mit höherem Rating'
      ],
      food: "5 typische lokale Spezialitäten für diese Stadt",
      transport: "3 Transporttipps für diese Stadt",
      tips: "3 allgemeine Reisetipps für diese Stadt"
    },
    'EN': {
      promptTitle: `Create a detailed travel plan for ${city} from ${startDate} to ${endDate} (${durationInDays} days).`,
      interestsTitle: 'User interests (scale 1-10, higher = more important):',
      jsonFormat: 'Provide the answer in this exact JSON format:',
      guidelines: [
        `Include actually existing, well-known sights and attractions in ${city}`,
        'Create a logistically sensible order of activities',
        `Adapt the recommendations to the specifics of ${city}`,
        'Ensure correct English descriptions',
        'Ensure realistic time management between activities',
        'Consider user interests when selecting activities - prefer activities from categories with higher ratings'
      ],
      food: "5 typical local specialties for this city",
      transport: "3 transportation tips for this city",
      tips: "3 general travel tips for this city"
    },
    'ES': {
      promptTitle: `Crea un plan de viaje detallado para ${city} desde ${startDate} hasta ${endDate} (${durationInDays} días).`,
      interestsTitle: 'Intereses del usuario (escala 1-10, mayor = más importante):',
      jsonFormat: 'Proporciona la respuesta en este formato JSON exacto:',
      guidelines: [
        `Incluye atracciones y lugares de interés conocidos que realmente existan en ${city}`,
        'Crea un orden de actividades lógico y sensato',
        `Adapta las recomendaciones a las características específicas de ${city}`,
        'Asegúrate de que las descripciones en español sean correctas',
        'Garantiza una gestión realista del tiempo entre actividades',
        'Considera los intereses del usuario al seleccionar actividades - prefiere actividades de categorías con calificaciones más altas'
      ],
      food: "5 especialidades locales típicas de esta ciudad",
      transport: "3 consejos de transporte para esta ciudad",
      tips: "3 consejos generales de viaje para esta ciudad"
    },
    'IT': {
      promptTitle: `Crea un piano di viaggio dettagliato per ${city} dal ${startDate} al ${endDate} (${durationInDays} giorni).`,
      interestsTitle: 'Interessi dell\'utente (scala 1-10, più alto = più importante):',
      jsonFormat: 'Fornisci la risposta in questo formato JSON esatto:',
      guidelines: [
        `Considera attrazioni e luoghi di interesse realmente esistenti e conosciuti a ${city}`,
        'Crea un ordine logisticamente sensato delle attività',
        `Adatta i consigli alle specificità di ${city}`,
        'Assicurati che le descrizioni in italiano siano corrette',
        'Assicurati che la gestione del tempo tra le attività sia realistica',
        'Considera gli interessi dell\'utente nella scelta delle attività - preferisci attività di categorie con valutazioni più alte'
      ],
      food: "5 specialità locali tipiche di questa città",
      transport: "3 consigli sui trasporti per questa città",
      tips: "3 consigli generali di viaggio per questa città"
    },
    'FR': {
      promptTitle: `Crée un plan de voyage détaillé pour ${city} du ${startDate} au ${endDate} (${durationInDays} jours).`,
      interestsTitle: 'Intérêts de l\'utilisateur (échelle 1-10, plus élevé = plus important):',
      jsonFormat: 'Fournis la réponse dans ce format JSON exact:',
      guidelines: [
        `Inclus des sites touristiques et attractions réellement existants et connus à ${city}`,
        'Crée un ordre d\'activités logistiquement sensé',
        `Adapte les recommandations aux spécificités de ${city}`,
        'Assure-toi que les descriptions en français sont correctes',
        'Assure une gestion réaliste du temps entre les activités',
        'Prends en compte les intérêts de l\'utilisateur lors du choix des activités - préfère les activités de catégories avec des notes plus élevées'
      ],
      food: "5 spécialités locales typiques de cette ville",
      transport: "3 conseils de transport pour cette ville",
      tips: "3 conseils généraux de voyage pour cette ville"
    }
  };
  
  const langConfig = languageConfig[language] || languageConfig['EN'];
  
  if (interests && interests.length > 0) {
    const sortedInterests = [...interests].sort((a, b) => b.rating - a.rating);
    interestsText = `\n\n${langConfig.interestsTitle}\n${sortedInterests.map(
      interest => `- ${interest.name}: ${interest.rating}`
    ).join('\n')}`;
  }
  
  const prompt = `${langConfig.promptTitle}${interestsText}
  
  ${langConfig.jsonFormat}
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
          - category: Eine Kategorie wie "Kunst", "Geschichte", "Gastronomie", "Sightseeing" usw. - auf der entsprechenden Sprache des guidelines
      */
    ],
    "recommendations": {
      "food": ["${langConfig.food}"],
      "transport": ["${langConfig.transport}"],
      "tips": ["${langConfig.tips}"]
    }
  }

  Achte auf folgende Punkte:
  ${langConfig.guidelines.map((guideline, index) => `${index + 1}. ${guideline}`).join('\n  ')}`;

  console.log(prompt);
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    let jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                    textResponse.match(/\{[\s\S]*\}/);
    
    let jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textResponse;
    
    jsonText = jsonText.replace(/```json|```/g, '').trim();
    
    const tripData = JSON.parse(jsonText);
    console.log(`Gemini-generierter Reiseplan in ${language} erstellt`);
    
    const cleanedTripData = cleanupResponseData(tripData);
    return cleanedTripData;
  } catch (error) {
    console.error(`Fehler bei der Erstellung des Reiseplans mit Gemini in ${language}:`, error);
    throw new Error(`Konnte keinen Reiseplan mit Gemini in ${language} erstellen`);
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
  // Konvertiere den Sprachcode zu Großbuchstaben, da vom Frontend lowercase codes kommen
  const language = (req.body.language || 'de').toUpperCase();
  
  console.log(`Sprache des Benutzers: ${language}`); // Log für debugging
  
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
      console.log(`Generiere Reiseplan für ${location} mit Gemini in Sprache: ${language}`);
      console.log(`Benutzerinteressen:`, interests);
      
      // Initialisiere Wiederholungsversuch-Zähler
      let attempts = 0;
      let maxAttempts = 3;
      let lastError = null;
      
      // Führe bis zu 3 Versuche durch
      while (attempts < maxAttempts) {
        attempts++;
        try {
          console.log(`Versuch ${attempts} von ${maxAttempts}`);
          
          // Versuche, den Reiseplan zu generieren
          const tripData = await generateTripWithGemini(
            req.body.location,
            startDate,
            endDate,
            interests,
            language
          );

          // Stadtbild von Unsplash abrufen (mit Wiederholungsversuch)
          let cityImage = null;
          let imageAttempts = 0;
          while (imageAttempts < maxAttempts && !cityImage) {
            imageAttempts++;
            try {
              cityImage = await getCityImage(req.body.location);
            } catch (imgError) {
              console.warn(`Fehler beim Abrufen des Stadtbildes (Versuch ${imageAttempts}):`, imgError);
              if (imageAttempts < maxAttempts) {
                // Kurz warten vor dem nächsten Versuch
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
          
          if (cityImage) {
            tripData.image = cityImage;
          }
          
          // Erfolgreiche Generierung - sende Antwort und beende Schleife
          return res.status(201).json({
            success: true,
            message: "Reiseplan mit Gemini erstellt",
            data: tripData
          });
        } catch (error) {
          lastError = error;
          console.error(`Fehler bei der Erstellung des Reiseplans (Versuch ${attempts}):`, error);
          
          if (attempts < maxAttempts) {
            // Warte etwas länger mit jedem Versuch
            const waitTime = 1000 * attempts; // 1s, dann 2s, dann 3s
            console.log(`Warte ${waitTime}ms vor dem nächsten Versuch...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }
      
      // Wenn wir hier ankommen, sind alle Versuche fehlgeschlagen
      console.error(`Alle ${maxAttempts} Versuche zur Erstellung des Reiseplans fehlgeschlagen`);
      res.status(500).json({
        success: false,
        message: `Fehler bei der Erstellung des Reiseplans nach ${maxAttempts} Versuchen`,
        error: lastError?.message || "Unbekannter Fehler"
      });
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

app.get('/api/status', (req, res) => {
  res.json({
    status: "online",
    message: "CityTailor-Backend läuft mit Gemini-Integration"
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server läuft auf http://localhost:${port}`);
  console.log(`Server ist im Netzwerk erreichbar unter http://[DEINE-IP-ADRESSE]:${port}`);
  console.log(`Gemini-Integration ist aktiv. API-Key ${API_KEY === "DEIN_GEMINI_API_KEY" ? "FEHLT NOCH" : "wurde konfiguriert"}`);
});
module.exports = (req, res) => app(req, res);
