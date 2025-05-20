import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initLogger, log } from 'control-center-logger';
import { createApi } from 'unsplash-js';
import fetch from 'node-fetch';

const app = express();
const port = 4040;

dotenv.config();

initLogger({
  apiUrl: 'https://alex.polan.sk/control-center/api/service_logs.php',
  projectId: '3RBl3LlTd463yHS8Zcoa',
  apiKey: process.env.CONTROL_CENTER_API_KEY || '',
  environment: 'production',
  service: 'backend'
})

app.use(express.json());
app.use(cors());
log.success('App Stated!')

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
    log.error('Fehler beim Abrufen des Stadtbildes:', { error });
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

async function generateTripWithGemini(city, startDate, endDate, interests = [], language = 'DE', travelType = 'solo', transportationType = 'mixed', travelMode = 'moderate') {
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
      travelTypeMap: {
        solo: 'Einzelreisender',
        couple: 'Paar',
        family: 'Familie',
        business: 'Geschäftsreisender',
        friends: 'Freundesgruppe'
      },
      transportationTypeMap: {
        walking: 'zu Fuß',
        publicTransport: 'öffentliche Verkehrsmittel',
        car: 'Auto',
        bicycle: 'Fahrrad',
        mixed: 'gemischte Verkehrsmittel'
      },
      travelModeMap: {
        relaxed: 'entspannt',
        moderate: 'moderat',
        intensive: 'intensiv'
      },
      travelPrefs: `Reisetyp: %TRAVELTYPE%, Fortbewegungsart: %TRANSPORTATIONTYPE%, Reiseintensität: %TRAVELMODE%`,
      interestsTitle: 'Benutzerinteressen (Skala 1-10, höher = wichtiger):',
      jsonFormat: 'Gib die Antwort in diesem exakten JSON-Format zurück:',
      guidelines: [
        `Berücksichtige tatsächlich existierende, bekannte Sehenswürdigkeiten und Attraktionen in ${city}`,
        'Erstelle eine logistische sinnvolle Reihenfolge der Aktivitäten',
        `Passe die Empfehlungen an die Besonderheiten von ${city} an`,
        'Achte auf korrekte deutschsprachige Beschreibungen',
        'Achte auf ein realistisches Zeitmanagement zwischen den Aktivitäten',
        'Berücksichtige die Benutzerinteressen bei der Auswahl der Aktivitäten - bevorzuge Aktivitäten aus Kategorien mit höherem Rating',
        'Passe die Aktivitäten an den Reisetyp an (z.B. familienfreundlich für Familien, romantisch für Paare)',
        'Berücksichtige die bevorzugte Fortbewegungsart bei der Planung der Tagesrouten',
        'Passe die Anzahl und Intensität der Aktivitäten an die gewünschte Reiseintensität an'
      ],
      food: "5 typische lokale Spezialitäten für diese Stadt",
      transport: "3 Transporttipps für diese Stadt",
      tips: "3 allgemeine Reisetipps für diese Stadt"
    },
    'EN': {
      promptTitle: `Create a detailed travel plan for ${city} from ${startDate} to ${endDate} (${durationInDays} days).`,
      travelTypeMap: {
        solo: 'Solo traveler',
        couple: 'Couple',
        family: 'Family',
        business: 'Business traveler',
        friends: 'Group of friends'
      },
      transportationTypeMap: {
        walking: 'walking',
        publicTransport: 'public transport',
        car: 'car',
        bicycle: 'bicycle',
        mixed: 'mixed transportation'
      },
      travelModeMap: {
        relaxed: 'relaxed',
        moderate: 'moderate',
        intensive: 'intensive'
      },
      travelPrefs: `Travel type: %TRAVELTYPE%, Transportation mode: %TRANSPORTATIONTYPE%, Travel intensity: %TRAVELMODE%`,
      interestsTitle: 'User interests (scale 1-10, higher = more important):',
      jsonFormat: 'Provide the answer in this exact JSON format:',
      guidelines: [
        `Include actually existing, well-known sights and attractions in ${city}`,
        'Create a logistically sensible order of activities',
        `Adapt the recommendations to the specifics of ${city}`,
        'Ensure correct English descriptions',
        'Ensure realistic time management between activities',
        'Consider user interests when selecting activities - prefer activities from categories with higher ratings',
        'Tailor activities to the travel type (e.g. family-friendly for families, romantic for couples)',
        'Consider the preferred transportation mode when planning daily routes',
        'Adjust the number and intensity of activities according to the desired travel intensity'
      ],
      food: "5 typical local specialties for this city",
      transport: "3 transportation tips for this city",
      tips: "3 general travel tips for this city"
    },
    'ES': {
      promptTitle: `Crea un plan de viaje detallado para ${city} desde ${startDate} hasta ${endDate} (${durationInDays} días).`,
      travelTypeMap: {
        solo: 'Viajero individual',
        couple: 'Pareja',
        family: 'Familia',
        business: 'Viajero de negocios',
        friends: 'Grupo de amigos'
      },
      transportationTypeMap: {
        walking: 'a pie',
        publicTransport: 'transporte público',
        car: 'coche',
        bicycle: 'bicicleta',
        mixed: 'transporte mixto'
      },
      travelModeMap: {
        relaxed: 'relajado',
        moderate: 'moderado',
        intensive: 'intensivo'
      },
      travelPrefs: `Tipo de viaje: %TRAVELTYPE%, Modo de transporte: %TRANSPORTATIONTYPE%, Intensidad del viaje: %TRAVELMODE%`,
      interestsTitle: 'Intereses del usuario (escala 1-10, mayor = más importante):',
      jsonFormat: 'Proporciona la respuesta en este formato JSON exacto:',
      guidelines: [
        `Incluye atracciones y lugares de interés conocidos que realmente existan en ${city}`,
        'Crea un orden de actividades lógico y sensato',
        `Adapta las recomendaciones a las características específicas de ${city}`,
        'Asegúrate de que las descripciones en español sean correctas',
        'Garantiza una gestión realista del tiempo entre actividades',
        'Considera los intereses del usuario al seleccionar actividades - prefiere actividades de categorías con calificaciones más altas',
        'Adapta las actividades al tipo de viaje (p.ej. actividades familiares para familias, románticas para parejas)',
        'Considera el modo de transporte preferido al planificar las rutas diarias',
        'Ajusta el número e intensidad de las actividades según la intensidad de viaje deseada'
      ],
      food: "5 especialidades locales típicas de esta ciudad",
      transport: "3 consejos de transporte para esta ciudad",
      tips: "3 consejos generales de viaje para esta ciudad"
    },
    'IT': {
      promptTitle: `Crea un piano di viaggio dettagliato per ${city} dal ${startDate} al ${endDate} (${durationInDays} giorni).`,
      travelTypeMap: {
        solo: 'Viaggiatore singolo',
        couple: 'Coppia',
        family: 'Famiglia',
        business: 'Viaggiatore d\'affari',
        friends: 'Gruppo di amici'
      },
      transportationTypeMap: {
        walking: 'a piedi',
        publicTransport: 'trasporto pubblico',
        car: 'auto',
        bicycle: 'bicicletta',
        mixed: 'trasporto misto'
      },
      travelModeMap: {
        relaxed: 'rilassato',
        moderate: 'moderato',
        intensive: 'intensivo'
      },
      travelPrefs: `Tipo di viaggio: %TRAVELTYPE%, Modalità di trasporto: %TRANSPORTATIONTYPE%, Intensità del viaggio: %TRAVELMODE%`,
      interestsTitle: 'Interessi dell\'utente (scala 1-10, più alto = più importante):',
      jsonFormat: 'Fornisci la risposta in questo formato JSON esatto:',
      guidelines: [
        `Considera attrazioni e luoghi di interesse realmente esistenti e conosciuti a ${city}`,
        'Crea un ordine logisticamente sensato delle attività',
        `Adatta i consigli alle specificità di ${city}`,
        'Assicurati che le descrizioni in italiano siano corrette',
        'Assicurati che la gestione del tempo tra le attività sia realistica',
        'Considera gli interessi dell\'utente nella scelta delle attività - preferisci attività di categorie con valutazioni più alte',
        'Adatta le attività al tipo di viaggio (es. attività familiari per famiglie, romantiche per coppie)',
        'Considera la modalità di trasporto preferita nella pianificazione degli itinerari giornalieri',
        'Regola il numero e l\'intensità delle attività in base all\'intensità di viaggio desiderata'
      ],
      food: "5 specialità locali tipiche di questa città",
      transport: "3 consigli sui trasporti per questa città",
      tips: "3 consigli generali di viaggio per questa città"
    },
    'FR': {
      promptTitle: `Crée un plan de voyage détaillé pour ${city} du ${startDate} au ${endDate} (${durationInDays} jours).`,
      travelTypeMap: {
        solo: 'Voyageur individuel',
        couple: 'Couple',
        family: 'Famille',
        business: 'Voyageur d\'affaires',
        friends: 'Groupe d\'amis'
      },
      transportationTypeMap: {
        walking: 'à pied',
        publicTransport: 'transports en commun',
        car: 'voiture',
        bicycle: 'vélo',
        mixed: 'transports mixtes'
      },
      travelModeMap: {
        relaxed: 'détendu',
        moderate: 'modéré',
        intensive: 'intensif'
      },
      travelPrefs: `Type de voyage: %TRAVELTYPE%, Mode de transport: %TRANSPORTATIONTYPE%, Intensité du voyage: %TRAVELMODE%`,
      interestsTitle: 'Intérêts de l\'utilisateur (échelle 1-10, plus élevé = plus important):',
      jsonFormat: 'Fournis la réponse dans ce format JSON exact:',
      guidelines: [
        `Inclus des sites touristiques et attractions réellement existants et connus à ${city}`,
        'Crée un ordre d\'activités logistiquement sensé',
        `Adapte les recommandations aux spécificités de ${city}`,
        'Assure-toi que les descriptions en français sont correctes',
        'Assure une gestion réaliste du temps entre les activités',
        'Prends en compte les intérêts de l\'utilisateur lors du choix des activités - préfère les activités de catégories avec des notes plus élevées',
        'Adapte les activités au type de voyage (ex. activités familiales pour les familles, romantiques pour les couples)',
        'Prends en compte le mode de transport préféré lors de la planification des itinéraires quotidiens',
        'Ajuste le nombre et l\'intensité des activités en fonction de l\'intensité de voyage souhaitée'
      ],
      food: "5 spécialités locales typiques de cette ville",
      transport: "3 conseils de transport pour cette ville",
      tips: "3 conseils généraux de voyage pour cette ville"
    }
  };
  
  const langConfig = languageConfig[language] || languageConfig['EN'];
  
  const travelTypeLocalized = langConfig.travelTypeMap[travelType] || langConfig.travelTypeMap.solo;
  const transportationTypeLocalized = langConfig.transportationTypeMap[transportationType] || langConfig.transportationTypeMap.mixed;
  const travelModeLocalized = langConfig.travelModeMap[travelMode] || langConfig.travelModeMap.moderate;
  
  const travelPrefs = langConfig.travelPrefs
    .replace('%TRAVELTYPE%', travelTypeLocalized)
    .replace('%TRANSPORTATIONTYPE%', transportationTypeLocalized)
    .replace('%TRAVELMODE%', travelModeLocalized);
  
  if (interests && interests.length > 0) {
    const sortedInterests = [...interests].sort((a, b) => b.rating - a.rating);
    interestsText = `\n\n${langConfig.interestsTitle}\n${sortedInterests.map(
      interest => `- ${interest.name}: ${interest.rating}`
    ).join('\n')}`;
  }
  
  const prompt = `${langConfig.promptTitle}
  
  ${travelPrefs}${interestsText}
  
  ${langConfig.jsonFormat}
  {
    "location": "${city}",
    "period": {
      "startDate": "${startDate}",
      "endDate": "${endDate}",
      "durationInDays": ${durationInDays}
    },
    "travelPreferences": {
      "travelType": "${travelType}",
      "transportationType": "${transportationType}",
      "travelMode": "${travelMode}"
    },
    "dailyPlans": [
      /* Ein Objekt pro Tag mit:
        - date: das Datum im Format YYYY-MM-DD
        - dayNumber: 1, 2, 3 usw.
        - activities: Array von 4-5 Aktivitäten pro Tag, jede mit:
          - time: z.B. "09:00 - 12:00"
          - title: Name der Aktivität/Sehenswürdigkeit
          - description: Eine kurze Beschreibung
          - displayAddress: Eine benutzerfreundliche Adresse zur Anzeige (z.B. "Museumsinsel (Am Lustgarten)"), wichtig keine genauen Postleitzahlen oder Straßenangaben wenn nich nötig
          - mapAddress: Eine für Kartenanwendungen optimierte Adresse (z.B. "Museumsinsel, 11111 Berlin, Germany"),
          - category: Eine Kategorie wie "Kunst", "Geschichte", "Gastronomie", "Sightseeing" usw.
      */
    ],
    "recommendations": {
      "food": ["${langConfig.food}"],
      "transport": ["${langConfig.transport}"],
      "tips": ["${langConfig.tips}"]
    }
  }

  Achte auf folgende Punkte:
  ${langConfig.guidelines.map((guideline, index) => `${index + 1}. ${guideline}`).join('\n  ')}
  
  Wichtig: Für jede Aktivität musst du zwei verschiedene Adressformate angeben:
  1. displayAddress: Eine benutzerfreundliche, lesbare Adresse mit Details (z.B. "Museumsinsel (Am Lustgarten)"), aber keine genauen Postleitzahlen oder Straßenangaben wenn nich nötig
  2. mapAddress: Eine für Kartenanwendungen optimierte Adresse im Format "Name, Stadt, Land" (z.B. "Museumsinsel, 11111 ${city}, Germany"), am besten in der lokalen Sprache, wichtig ist, dass es manchmal Orte gibt die den gleichen Namenhaben, also achte darauf dass du den Stadtteil dazuschreibst wenn nötig, damit Apple Maps die Adresse auflösen kann. Sollte es keine Adresse geben, dann lass das Feld leer.`;

  console.log(prompt);
  log.info(prompt);
  // - mapAddress: Eine für Kartenanwendungen optimierte Adresse (z.B. "Museumsinsel, Berlin, Germany"), wichtig es dürfen nie 2 mal die gleiche am selben tag sein, sonst werden bugs auf der map erzeugt, aber auch zB Old Town und Old Town Square könnten zur gleicher Pin Position führen also bitte verhindere es, es muss Apple Maps auflösen können! Passe auch auf nie Namen an zB Petrin in Prag gibt mehrmals, du musst zB den Stadtteil dazuschreiben
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
    log.info(`Gemini-generierter Reiseplan in ${language} erstellt`, { data: tripData });
    
    const cleanedTripData = cleanupResponseData(tripData);
    return cleanedTripData;
  } catch (error) {
    console.error(`Fehler bei der Erstellung des Reiseplans mit Gemini in ${language}:`, error);
    log.error(`Fehler bei der Erstellung des Reiseplans mit Gemini in ${language}:`, { error });
    throw new Error(`Konnte keinen Reiseplan mit Gemini in ${language} erstellen`);
  }
}

app.post('/api/trips', async (req, res) => {
  console.log('Empfangene Daten:', req.body);
  log.info('Empfangene Daten:', { data: req.body });

  const location = req.body.location?.toLowerCase();
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const interests = req.body.interests || [];
  const language = (req.body.language || 'de').toUpperCase();
  
  const travelType = req.body.travelType || 'solo';
  const transportationType = req.body.transportationType || 'mixed';
  
  // Premium-Status aus dem Header auslesen
  const isPremiumUser = req.headers['x-premium-status'] === 'true';
  
  // Reiseintensität nur für Premium-Nutzer frei wählbar, sonst "moderate"
  const requestedTravelMode = req.body.travelMode || 'moderate';
  const travelMode = isPremiumUser ? requestedTravelMode : 'moderate';
  
  console.log(`Sprache des Benutzers: ${language}`);
  log.info(`Sprache des Benutzers: ${language}`, { data: { language } });
  console.log(`Premium-Status: ${isPremiumUser ? 'Premium' : 'Kein Premium'}`);
  log.info(`Premium-Status: ${isPremiumUser ? 'Premium' : 'Kein Premium'}`, { data: { isPremiumUser } });
  console.log(`Reisetyp: ${travelType}, Transportart: ${transportationType}, Reiseintensität: ${travelMode}${!isPremiumUser && requestedTravelMode !== 'moderate' ? ' (auf "moderate" zurückgesetzt, da kein Premium)' : ''}`);
  log.info(`Reisetyp: ${travelType}, Transportart: ${transportationType}, Reiseintensität: ${travelMode}${!isPremiumUser && requestedTravelMode !== 'moderate' ? ' (auf "moderate" zurückgesetzt, da kein Premium)' : ''}`, { data: { travelType, transportationType, travelMode } });
  
  try {
    if (location && startDate && endDate) {
      console.log(`Generiere Reiseplan für ${location} mit Gemini in Sprache: ${language}`);
      log.info(`Generiere Reiseplan für ${location} mit Gemini in Sprache: ${language}`, { data: { location, language } });
      console.log(`Benutzerinteressen:`, interests);
      log.info(`Benutzerinteressen:`, { data: { interests } });
      
      let attempts = 0;
      let maxAttempts = 3;
      let lastError = null;
      
      while (attempts < maxAttempts) {
        attempts++;
        try {
          console.log(`Versuch ${attempts} von ${maxAttempts}`);
          
          log.info(`Versuch ${attempts} von ${maxAttempts}`, { data: { attempts, maxAttempts } });
          const tripData = await generateTripWithGemini(
            req.body.location,
            startDate,
            endDate,
            interests,
            language,
            travelType,
            transportationType,
            travelMode
          );

          let cityImage = null;
          let imageAttempts = 0;
          while (imageAttempts < maxAttempts && !cityImage) {
            imageAttempts++;
            try {
              cityImage = await getCityImage(req.body.location);
            } catch (imgError) {
              console.warn(`Fehler beim Abrufen des Stadtbildes (Versuch ${imageAttempts}):`, imgError);
              log.warn(`Fehler beim Abrufen des Stadtbildes (Versuch ${imageAttempts}):`, { error: imgError });

              if (imageAttempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
          
          if (cityImage) {
            tripData.image = cityImage;
          }
          log.success('Reiseplan mit Gemini erstellt', { data: tripData });
        console.log('Reiseplan mit Gemini erstellt', tripData.dailyPlans[0].activities); 
        console.log('Reiseplan mit Gemini erstellt', tripData.dailyPlans[1].activities); 
        console.log('Reiseplan mit Gemini erstellt', tripData.dailyPlans[2].activities); 
        console.log('Reiseplan mit Gemini erstellt', tripData.dailyPlans[3].activities); 

          return res.status(201).json({
            success: true,
            message: "Reiseplan mit Gemini erstellt",
            data: tripData
          });

        } catch (error) {
          lastError = error;
          console.error(`Fehler bei der Erstellung des Reiseplans (Versuch ${attempts}):`, error);
          log.error(`Fehler bei der Erstellung des Reiseplans (Versuch ${attempts}):`, { error });
          
          if (attempts < maxAttempts) {
            const waitTime = 1000 * attempts;
            console.log(`Warte ${waitTime}ms vor dem nächsten Versuch...`);
            log.info(`Warte ${waitTime}ms vor dem nächsten Versuch...`, { data: { waitTime } });
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }
      
      console.error(`Alle ${maxAttempts} Versuche zur Erstellung des Reiseplans fehlgeschlagen`);
      log.error(`Alle ${maxAttempts} Versuche zur Erstellung des Reiseplans fehlgeschlagen`, { data: { maxAttempts } });
      res.status(500).json({
        success: false,
        message: `Fehler bei der Erstellung des Reiseplans nach ${maxAttempts} Versuchen`,
        error: lastError?.message || "Unbekannter Fehler"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Fehlende Parameter: location, startDate und endDate werden benötigt"
      });
    }
  } catch (error) {
    console.error("Server-Fehler:", error);
    log.error("Server-Fehler:", { error });
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
  log.info(`Server läuft auf http://localhost:${port}`, { data: { port } });
  log.info(`Server ist im Netzwerk erreichbar unter http://[DEINE-IP-ADRESSE]:${port}`, { data: { port } });
  log.info(`Gemini-Integration ist aktiv. API-Key ${API_KEY === "DEIN_GEMINI_API_KEY" ? "FEHLT NOCH" : "wurde konfiguriert"}`);
});

// Export as ES module
export default (req, res) => app(req, res);
