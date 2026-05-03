const DATA = {
  US: {
    name: "United States",
    locale: "en-US",
    phones: ["+1 (212)", "+1 (305)", "+1 (415)", "+1 (312)"],
    zip: () => 10000 + ((Math.random() * 89999) | 0),
    cities: {
      "New York": ["5th Ave", "Broadway", "Wall Street", "Madison Ave"],
      "Los Angeles": ["Sunset Blvd", "Hollywood Blvd", "Venice Beach"],
      "Chicago": ["Michigan Ave", "Lake Shore Dr"]
    },
    first: ["James","John","Michael","David","Robert","Emma","Olivia","Sophia","Isabella","Mason"],
    last: ["Smith","Johnson","Brown","Williams","Jones","Taylor","Anderson","Thomas","Moore","Martin"],
    emails: ["gmail.com","outlook.com","yahoo.com"]
  },

  DE: {
    name: "Germany",
    locale: "de-DE",
    phones: ["+49 30", "+49 40", "+49 89"],
    zip: () => 10000 + ((Math.random() * 89999) | 0),
    cities: {
      "Berlin": ["Unter den Linden", "Alexanderplatz", "Kurfürstendamm"],
      "Munich": ["Marienplatz", "Leopoldstrasse"],
      "Hamburg": ["Reeperbahn", "Jungfernstieg"]
    },
    first: ["Max","Paul","Leon","Finn","Lukas","Emma","Lena","Hannah","Sofia","Marie"],
    last: ["Müller","Schmidt","Schneider","Fischer","Weber","Becker","Wagner","Hoffmann","Koch","Richter"],
    emails: ["gmail.com","gmx.de","web.de"]
  },

  NL: {
    name: "Netherlands",
    locale: "nl-NL",
    phones: ["+31 20", "+31 10", "+31 70"],
    zip: () => `${1000 + ((Math.random() * 8999) | 0)} AB`,
    cities: {
      "Amsterdam": ["Damrak", "Leidseplein", "Herengracht"],
      "Rotterdam": ["Coolsingel", "Weena"],
      "Utrecht": ["Oudegracht", "Neude"]
    },
    first: ["Daan","Lars","Finn","Milan","Emma","Sophie","Noor","Eva","Lotte","Jesse"],
    last: ["de Jong","Jansen","de Vries","Bakker","Visser","Smit","Meijer","de Boer","Mulder","van Dijk"],
    emails: ["gmail.com","outlook.com","ziggo.nl"]
  },

  JP: {
    name: "Japan",
    locale: "ja-JP",
    phones: ["+81 3", "+81 6", "+81 45"],
    zip: () => 1000000 + ((Math.random() * 8999999) | 0),
    cities: {
      "Tokyo": ["Shibuya", "Shinjuku", "Ginza"],
      "Osaka": ["Namba", "Umeda"],
      "Kyoto": ["Gion", "Arashiyama"]
    },
    first: ["Haruto","Yuto","Sota","Yuki","Ren","Hiro","Kaito","Riku","Aoi","Hina"],
    last: ["Sato","Suzuki","Takahashi","Tanaka","Watanabe","Ito","Yamamoto","Nakamura","Kobayashi","Kato"],
    emails: ["gmail.com","yahoo.co.jp","icloud.com"]
  }
};
