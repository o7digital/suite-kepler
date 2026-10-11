export type Language = 'es' | 'en';
export type LocalizedPaths = Record<Language, string>;

export const hotel = {
  name: 'Business Suites Kepler',
  url: 'https://www.businesssuiteskepler.com',
  telephone: '+525536668535',
  email: 'reservaskepler@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kepler 147, colonia Verónica Anzúres',
    addressLocality: 'Miguel Hidalgo',
    addressRegion: 'Ciudad de México',
    postalCode: '11590',
    addressCountry: 'MX',
  },
  // Coordinates published by the hotel's official reservation engine:
  // https://hotels.cloudbeds.com/reservation/lSYkcf (verified 2026-10-10).
  geo: { '@type': 'GeoCoordinates', latitude: 19.43460464, longitude: -99.1808548 },
  numberOfRooms: 13,
};

export const homePaths: LocalizedPaths = { es: '/', en: '/en/' };
export const privacyPaths: LocalizedPaths = { es: '/privacy-policy/', en: '/en/privacy-policy/' };
export const bookingUrl = (lang: Language) =>
  `https://hotels.cloudbeds.com/${lang}/reservation/lSYkcf?currency=mxn`;
export const absoluteUrl = (path: string) => new URL(path, hotel.url).href;
export const mapUrl = 'https://www.google.com/maps/search/?api=1&query=Kepler+147%2C+Ver%C3%B3nica+Anz%C3%BAres%2C+Ciudad+de+M%C3%A9xico';

export const commonAmenities: Record<Language, string[]> = {
  es: ['Wi-Fi en las habitaciones', 'Limpieza diaria', 'Espacio para trabajar', 'Caja de seguridad', 'Estacionamiento limitado', 'Facturación disponible'],
  en: ['In-room Wi-Fi', 'Daily housekeeping', 'Space to work', 'Safety deposit box', 'Limited parking', 'Invoices available'],
};

export function hotelSchema(lang: Language) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': absoluteUrl('/#hotel'),
    name: hotel.name,
    url: absoluteUrl('/'),
    description: lang === 'es'
      ? 'Habitaciones y suites con cocina en Verónica Anzúres, cerca de Polanco, Ciudad de México.'
      : 'Rooms and suites with kitchens in Verónica Anzúres, near Polanco, Mexico City.',
    image: ['/assets/fachada.webp', '/assets/grand-suite-four.webp', '/assets/king.webp', '/assets/queen.webp'].map(absoluteUrl),
    telephone: hotel.telephone,
    email: hotel.email,
    address: hotel.address,
    geo: hotel.geo,
    hasMap: mapUrl,
    numberOfRooms: hotel.numberOfRooms,
    amenityFeature: commonAmenities[lang].map(name => ({
      '@type': 'LocationFeatureSpecification', name, value: true,
    })),
  };
}
