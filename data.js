window.DATA = {
  US: {
    name: "United States",
    locale: "en-US",
    phones: ["+1 (212)", "+1 (305)", "+1 (415)", "+1 (312)"],
    zip: () => 10000 + ((Math.random() * 89999) | 0),
    cities: {
      "New York": ["5th Ave", "Broadway", "Wall Street"],
      "Los Angeles": ["Sunset Blvd", "Hollywood Blvd"],
      "Chicago": ["Michigan Ave", "Lake Shore Dr"]
    },
    first: ["James","John","Michael","David","Robert","Emma","Olivia","Sophia","Mason"],
    last: ["Smith","Johnson","Brown","Williams","Jones","Taylor","Anderson","Thomas"],
    emails: ["gmail.com", "yahoo.com", 
             "outlook.com"]
  },

  DE: {
    name: "Germany",
    locale: "de-DE",
    phones: ["+49 30", "+49 40"],
    zip: () => 10000 + ((Math.random() * 89999) | 0),
    cities: {
      "Berlin": ["Alexanderplatz", "Unter den Linden"],
      "Munich": ["Marienplatz", "Leopoldstrasse"]
    },
    first: ["Max","Paul","Leon","Finn","Lukas","Emma","Lena","Marie"],
    last: ["Müller","Schmidt","Fischer","Weber","Becker","Wagner"],
    emails: ["gmail.com", "gmx.de", 
             "web.de"]
  }
};
