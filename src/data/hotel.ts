export type Language = 'es' | 'en' | 'zh';
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

export const homePaths: LocalizedPaths = { es: '/', en: '/en/', zh: '/zh/' };
export const locationPaths: LocalizedPaths = { es: '/ubicacion/', en: '/en/location/', zh: '/zh/location/' };
export const privacyPaths: LocalizedPaths = { es: '/privacy-policy/', en: '/en/privacy-policy/', zh: '/zh/privacy-policy/' };
export const bookingUrl = (lang: Language) =>
  `https://hotels.cloudbeds.com/${lang === 'zh' ? 'en' : lang}/reservation/lSYkcf?currency=mxn`;
export const absoluteUrl = (path: string) => new URL(path, hotel.url).href;
export const mapUrl = 'https://www.google.com/maps/search/?api=1&query=Kepler+147%2C+Ver%C3%B3nica+Anz%C3%BAres%2C+Ciudad+de+M%C3%A9xico';

export const commonAmenities: Record<Language, string[]> = {
  es: ['Wi-Fi en las habitaciones', 'Limpieza diaria', 'Espacio para trabajar', 'Caja de seguridad', 'Estacionamiento limitado', 'Facturación disponible'],
  zh: ['客房无线网络', '每日客房清洁', '办公空间', '保险箱', '有限停车位', '可提供发票', '入住满5晚免费洗衣'],
  en: ['In-room Wi-Fi', 'Daily housekeeping', 'Space to work', 'Safety deposit box', 'Limited parking', 'Invoices available'],
};

export function hotelSchema(lang: Language) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': absoluteUrl('/#hotel'),
    name: hotel.name,
    url: absoluteUrl('/'),
    description: lang === 'zh' ? '位于墨西哥城 Verónica Anzúres、毗邻 Polanco 的客房与套房。Grand Suite 套房配有厨房，适合商务出行和长期入住。' : lang === 'es'
      ? 'Habitaciones y suites en Verónica Anzúres, cerca de Polanco, Ciudad de México. Grand Suites con cocina equipada para viajes de trabajo y estancias largas.'
      : 'Rooms and suites in Verónica Anzúres, near Polanco, Mexico City. Grand Suites with equipped kitchens for business trips and longer stays.',
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
