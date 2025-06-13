const ep = {
  location: "London",
  period: { startDate: "2025-06-13", endDate: "2025-06-16", durationInDays: 4 },
  travelPreferences: {
    travelType: "solo",
    transportationType: "walking",
    travelMode: "moderate",
  },
  dailyPlans: [
    {
      date: "2025-06-13",
      dayNumber: 1,
      activities: [
        {
          time: "09:00 - 12:00",
          title: "Hyde Park",
          description:
            "Spaziergang durch den Hyde Park und Besuch des Speakers' Corner (optional).",
          displayAddress: "Hyde Park",
          mapAddress: "Hyde Park, London, UK",
          category: "Sightseeing",
          imageUrl:
            "https://images.unsplash.com/photo-1630208208637-d553a59d1632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxIeWRlJTIwUGFyayUyMFNpZ2h0c2VlaW5nfGVufDB8MHx8fDE3NDk3NTk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "12:00 - 13:00",
          title: "Mittagessen",
          description:
            "Mittagessen im Hyde Park oder in einem nahegelegenen Restaurant.",
          displayAddress: "Restaurant in der Nähe des Hyde Parks",
          mapAddress: "",
          category: "Gastronomie",
          imageUrl:
            "https://images.unsplash.com/photo-1557499305-bd68d0ad468d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxNaXR0YWdlc3NlbiUyMEdhc3Ryb25vbWllfGVufDB8MHx8fDE3NDk3NTk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "13:00 - 15:00",
          title: "Kensington Gardens",
          description: "Spaziergang durch die Kensington Gardens.",
          displayAddress: "Kensington Gardens",
          mapAddress: "Kensington Gardens, London, UK",
          category: "Sightseeing",
          imageUrl:
            "https://images.unsplash.com/photo-1734427102239-7363cf65337d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxLZW5zaW5ndG9uJTIwR2FyZGVucyUyMFNpZ2h0c2VlaW5nfGVufDB8MHx8fDE3NDk4MDA3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "15:00 - 17:00",
          title: "Rückreisevorbereitungen",
          description:
            "Gepäck verstauen und zum Flughafen fahren (falls zutreffend).",
          displayAddress: "",
          mapAddress: "",
          category: "Sonstiges",
          imageUrl:
            "https://images.unsplash.com/photo-1614926781997-9ca2e6d2785a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxSJUMzJUJDY2tyZWlzZXZvcmJlcmVpdHVuZ2VuJTIwU29uc3RpZ2VzfGVufDB8MHx8fDE3NDk4MDA3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
      ],
    },
    {
      date: "2025-06-14",
      dayNumber: 2,
      activities: [
        {
          time: "09:00 - 12:00",
          title: "Hyde Park",
          description:
            "Spaziergang durch den Hyde Park und Besuch des Speakers' Corner (optional).",
          displayAddress: "Hyde Park",
          mapAddress: "Hyde Park, London, UK",
          category: "Sightseeing",
          imageUrl:
            "https://images.unsplash.com/photo-1630208208637-d553a59d1632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxIeWRlJTIwUGFyayUyMFNpZ2h0c2VlaW5nfGVufDB8MHx8fDE3NDk3NTk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "12:00 - 13:00",
          title: "Mittagessen",
          description:
            "Mittagessen im Hyde Park oder in einem nahegelegenen Restaurant.",
          displayAddress: "Restaurant in der Nähe des Hyde Parks",
          mapAddress: "",
          category: "Gastronomie",
          imageUrl:
            "https://images.unsplash.com/photo-1557499305-bd68d0ad468d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxNaXR0YWdlc3NlbiUyMEdhc3Ryb25vbWllfGVufDB8MHx8fDE3NDk3NTk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "13:00 - 15:00",
          title: "Kensington Gardens",
          description: "Spaziergang durch die Kensington Gardens.",
          displayAddress: "Kensington Gardens",
          mapAddress: "Kensington Gardens, London, UK",
          category: "Sightseeing",
          imageUrl:
            "https://images.unsplash.com/photo-1734427102239-7363cf65337d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxLZW5zaW5ndG9uJTIwR2FyZGVucyUyMFNpZ2h0c2VlaW5nfGVufDB8MHx8fDE3NDk4MDA3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "15:00 - 17:00",
          title: "Rückreisevorbereitungen",
          description:
            "Gepäck verstauen und zum Flughafen fahren (falls zutreffend).",
          displayAddress: "",
          mapAddress: "",
          category: "Sonstiges",
          imageUrl:
            "https://images.unsplash.com/photo-1614926781997-9ca2e6d2785a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxSJUMzJUJDY2tyZWlzZXZvcmJlcmVpdHVuZ2VuJTIwU29uc3RpZ2VzfGVufDB8MHx8fDE3NDk4MDA3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
      ],
    },
    {
      date: "2025-06-15",
      dayNumber: 3,
      activities: [
        {
          time: "09:00 - 12:00",
          title: "Hyde Park",
          description:
            "Spaziergang durch den Hyde Park und Besuch des Speakers' Corner (optional).",
          displayAddress: "Hyde Park",
          mapAddress: "Hyde Park, London, UK",
          category: "Sightseeing",
          imageUrl:
            "https://images.unsplash.com/photo-1630208208637-d553a59d1632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxIeWRlJTIwUGFyayUyMFNpZ2h0c2VlaW5nfGVufDB8MHx8fDE3NDk3NTk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "12:00 - 13:00",
          title: "Mittagessen",
          description:
            "Mittagessen im Hyde Park oder in einem nahegelegenen Restaurant.",
          displayAddress: "Restaurant in der Nähe des Hyde Parks",
          mapAddress: "",
          category: "Gastronomie",
          imageUrl:
            "https://images.unsplash.com/photo-1557499305-bd68d0ad468d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxNaXR0YWdlc3NlbiUyMEdhc3Ryb25vbWllfGVufDB8MHx8fDE3NDk3NTk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "13:00 - 15:00",
          title: "Kensington Gardens",
          description: "Spaziergang durch die Kensington Gardens.",
          displayAddress: "Kensington Gardens",
          mapAddress: "Kensington Gardens, London, UK",
          category: "Sightseeing",
          imageUrl:
            "https://images.unsplash.com/photo-1734427102239-7363cf65337d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxLZW5zaW5ndG9uJTIwR2FyZGVucyUyMFNpZ2h0c2VlaW5nfGVufDB8MHx8fDE3NDk4MDA3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "15:00 - 17:00",
          title: "Rückreisevorbereitungen",
          description:
            "Gepäck verstauen und zum Flughafen fahren (falls zutreffend).",
          displayAddress: "",
          mapAddress: "",
          category: "Sonstiges",
          imageUrl:
            "https://images.unsplash.com/photo-1614926781997-9ca2e6d2785a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxSJUMzJUJDY2tyZWlzZXZvcmJlcmVpdHVuZ2VuJTIwU29uc3RpZ2VzfGVufDB8MHx8fDE3NDk4MDA3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
      ],
    },
    {
      date: "2025-06-16",
      dayNumber: 4,
      activities: [
        {
          time: "09:00 - 12:00",
          title: "Hyde Park",
          description:
            "Spaziergang durch den Hyde Park und Besuch des Speakers' Corner (optional).",
          displayAddress: "Hyde Park",
          mapAddress: "Hyde Park, London, UK",
          category: "Sightseeing",
          imageUrl:
            "https://images.unsplash.com/photo-1630208208637-d553a59d1632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxIeWRlJTIwUGFyayUyMFNpZ2h0c2VlaW5nfGVufDB8MHx8fDE3NDk3NTk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "12:00 - 13:00",
          title: "Mittagessen",
          description:
            "Mittagessen im Hyde Park oder in einem nahegelegenen Restaurant.",
          displayAddress: "Restaurant in der Nähe des Hyde Parks",
          mapAddress: "",
          category: "Gastronomie",
          imageUrl:
            "https://images.unsplash.com/photo-1557499305-bd68d0ad468d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxNaXR0YWdlc3NlbiUyMEdhc3Ryb25vbWllfGVufDB8MHx8fDE3NDk3NTk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "13:00 - 15:00",
          title: "Kensington Gardens",
          description: "Spaziergang durch die Kensington Gardens.",
          displayAddress: "Kensington Gardens",
          mapAddress: "Kensington Gardens, London, UK",
          category: "Sightseeing",
          imageUrl:
            "https://images.unsplash.com/photo-1734427102239-7363cf65337d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxLZW5zaW5ndG9uJTIwR2FyZGVucyUyMFNpZ2h0c2VlaW5nfGVufDB8MHx8fDE3NDk4MDA3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          time: "15:00 - 17:00",
          title: "Rückreisevorbereitungen",
          description:
            "Gepäck verstauen und zum Flughafen fahren (falls zutreffend).",
          displayAddress: "",
          mapAddress: "",
          category: "Sonstiges",
          imageUrl:
            "https://images.unsplash.com/photo-1614926781997-9ca2e6d2785a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxSJUMzJUJDY2tyZWlzZXZvcmJlcmVpdHVuZ2VuJTIwU29uc3RpZ2VzfGVufDB8MHx8fDE3NDk4MDA3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
      ],
    },
  ],
  recommendations: {
    food: [
      "Fish and Chips",
      "Full English Breakfast",
      "Sunday Roast",
      "Afternoon Tea",
      "Scotch Egg",
    ],
    transport: [
      "Nutzen Sie die Tube (U-Bahn) für längere Strecken.",
      "Spazieren Sie so viel wie möglich – London ist eine sehr begehbare Stadt.",
      "Verwenden Sie die Oyster Card oder Contactless Payment für öffentliche Verkehrsmittel.",
    ],
    tips: [
      "Kaufen Sie eine Oyster Card oder nutzen Sie Contactless Payment für einfache und kostengünstige Fahrten mit öffentlichen Verkehrsmitteln.",
      "Informieren Sie sich über die Öffnungszeiten von Sehenswürdigkeiten im Voraus.",
      "Tragen Sie bequeme Schuhe, da Sie viel zu Fuß unterwegs sein werden.",
    ],
  },
  image: {
    url: "https://images.unsplash.com/photo-1575323734774-d6c47992c537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU2NzF8MHwxfHNlYXJjaHwxfHxMb25kb24lMjBjaXR5fGVufDB8MHx8fDE3NDk3NTk2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "aerial photography of city",
    photographer: "Jude Arubi",
    photographerLink: "https://unsplash.com/@judearubi",
  },
};
