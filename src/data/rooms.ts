import { absoluteUrl, homePaths, hotelSchema, privacyPaths, type Language, type LocalizedPaths } from './hotel';

type RoomContent = {
  name: string;
  title: string;
  description: string;
  heading: string;
  emphasis: string;
  lead: string;
  introTitle: string;
  paragraphs: string[];
  facts: string[];
  amenities: string[];
  imageAlt: string;
  galleryAlts?: string[];
  bed: string;
};

export type Room = {
  id: string;
  paths: LocalizedPaths;
  image: string;
  width: number;
  height: number;
  size: number | { minValue: number; maxValue: number };
  gallery?: { image: string; width: number; height: number }[];
  es: RoomContent;
  en: RoomContent;
};

export const rooms: Room[] = [
  {
    id: 'grand-suite',
    paths: { es: '/habitaciones/grand-suite/', en: '/en/rooms/grand-suite/' },
    image: '/assets/grand-suite-four.webp', width: 1501, height: 1000,
    size: { minValue: 80, maxValue: 95 },
    gallery: [
      { image: '/assets/grand-suite-two.webp', width: 1334, height: 1000 },
      { image: '/assets/grand-suite.webp', width: 667, height: 1000 },
    ],
    es: {
      name: 'Grand Suite',
      title: 'Grand Suite con cocina cerca de Polanco | Business Suites Kepler',
      description: 'Grand Suite de 80–95 m² con dos camas, cocina equipada, sala y comedor en Verónica Anzúres, CDMX. Consulta disponibilidad en Business Suites Kepler.',
      heading: 'Grand Suite', emphasis: 'con cocina.',
      lead: 'Entre 80 y 95 m² para instalarte en Ciudad de México: dos camas, cocina equipada, sala y comedor, en Verónica Anzúres, cerca de Polanco.',
      introTitle: 'Un departamento para tu estancia en CDMX.',
      paragraphs: [
        'La Grand Suite es el espacio más amplio de Business Suites Kepler. Su cocina está dentro de la suite, junto con una sala y un comedor: ambientes para preparar alimentos, compartir una mesa y descansar sin limitar toda tu estancia a la habitación.',
        'Es una opción para quienes buscan espacio durante un viaje de trabajo o una visita más larga a Ciudad de México. Puedes organizar el día entre la sala y el comedor y volver a tu propio espacio después de recorrer la zona.',
        'Las Grand Suites tienen superficies de entre 80 y 95 m². Al consultar fechas en el motor de reservas podrás revisar las unidades disponibles y sus características antes de elegir tu estancia.',
      ],
      facts: ['80–95 m²', 'Dos camas', 'Cocina dentro de la suite', 'Sala y comedor'],
      amenities: ['Cocina equipada', 'Sala', 'Comedor'],
      imageAlt: 'Sala y comedor de una Grand Suite en Business Suites Kepler',
      galleryAlts: ['Sala y comedor de una Grand Suite de la propiedad', 'Mesa de comedor de una Grand Suite'],
      bed: 'Dos camas',
    },
    en: {
      name: 'Grand Suite',
      title: 'Grand Suite with kitchen near Polanco | Business Suites Kepler',
      description: 'Discover an 80–95 m² Grand Suite with two beds, an equipped kitchen, living room and dining area in Verónica Anzúres, Mexico City. Check availability.',
      heading: 'Grand Suite', emphasis: 'with a kitchen.',
      lead: 'Settle into 80–95 m² in Mexico City: two beds, an equipped kitchen, a living room and a dining area in Verónica Anzúres, near Polanco.',
      introTitle: 'An apartment for your Mexico City stay.',
      paragraphs: [
        'The Grand Suite is the most spacious accommodation at Business Suites Kepler. The kitchen is inside the suite, alongside a living room and dining area, giving you separate spaces to prepare food, share a meal and unwind.',
        'It is an option for guests who want more space during a business trip or a longer visit to Mexico City. Spend time in the living and dining areas and return to your own space after exploring the neighborhood.',
        'Grand Suites range from 80 to 95 m². Enter your dates in the booking engine to review the available units and their individual features before choosing your stay.',
      ],
      facts: ['80–95 m²', 'Two beds', 'Kitchen inside the suite', 'Living and dining areas'],
      amenities: ['Equipped kitchen', 'Living room', 'Dining area'],
      imageAlt: 'Living and dining area in a Grand Suite at Business Suites Kepler',
      galleryAlts: ['Living and dining area in a Grand Suite at the property', 'Dining table in a Grand Suite'],
      bed: 'Two beds',
    },
  },
  {
    id: 'king',
    paths: { es: '/habitaciones/king/', en: '/en/rooms/king/' },
    image: '/assets/king.webp', width: 1439, height: 942, size: 30,
    es: {
      name: 'Habitación King',
      title: 'Habitación King cerca de Polanco | Business Suites Kepler',
      description: 'Habitación King de 30 m² con balcón, escritorio y acceso a cocineta fuera de la habitación en Verónica Anzúres, CDMX. Consulta disponibilidad.',
      heading: 'Habitación', emphasis: 'King.',
      lead: 'Una habitación de 30 m² con cama King, escritorio y balcón para descansar o trabajar en Verónica Anzúres, cerca de Polanco.',
      introTitle: 'Espacio para descansar y trabajar.',
      paragraphs: [
        'La Habitación King combina una cama amplia con espacio para trabajar durante tu visita a Ciudad de México. Sus 30 m² incluyen un escritorio y un balcón para alternar entre tu rutina de trabajo y los momentos de descanso.',
        'Esta habitación tiene acceso a una cocineta situada fuera de la habitación. Es una alternativa para preparar alimentos durante la estancia sin reservar una suite con cocina interior.',
        'Si buscas un departamento con sala y comedor separados, puedes comparar esta opción con la Grand Suite. Para una estancia en una habitación más compacta, también está disponible la Habitación Queen.',
      ],
      facts: ['30 m²', 'Cama King', 'Balcón', 'Escritorio', 'Acceso a cocineta fuera de la habitación'],
      amenities: ['Balcón', 'Escritorio', 'Acceso a cocineta fuera de la habitación'],
      imageAlt: 'Habitación King con cama y escritorio en Business Suites Kepler',
      bed: 'Cama King',
    },
    en: {
      name: 'King Room',
      title: 'King Room near Polanco, Mexico City | Business Suites Kepler',
      description: 'A 30 m² King Room with a balcony, desk and access to a kitchenette outside the room in Verónica Anzúres, Mexico City. Check availability.',
      heading: 'King', emphasis: 'Room.',
      lead: 'A 30 m² room with a King bed, desk and balcony for work or rest in Verónica Anzúres, near Polanco, Mexico City.',
      introTitle: 'Room to rest and work.',
      paragraphs: [
        'The King Room brings together a spacious bed and a place to work during your visit to Mexico City. Its 30 m² include a desk and a balcony, giving you space for both your daily routine and time to unwind.',
        'The room has access to a kitchenette located outside the room. This is an option for preparing food during your stay without choosing a suite with an indoor kitchen.',
        'If you would prefer an apartment with separate living and dining areas, compare the King Room with the Grand Suite. The Queen Room is another option for guests looking for a more compact room.',
      ],
      facts: ['30 m²', 'King bed', 'Balcony', 'Desk', 'Access to a kitchenette outside the room'],
      amenities: ['Balcony', 'Desk', 'Access to a kitchenette outside the room'],
      imageAlt: 'King room with a bed and desk at Business Suites Kepler',
      bed: 'King bed',
    },
  },
  {
    id: 'queen',
    paths: { es: '/habitaciones/queen/', en: '/en/rooms/queen/' },
    image: '/assets/queen.webp', width: 1334, height: 1000, size: 27,
    es: {
      name: 'Habitación Queen',
      title: 'Habitación Queen cerca de Polanco | Business Suites Kepler',
      description: 'Habitación Queen de 27 m² con escritorio y baño privado en Verónica Anzúres, cerca de Polanco, CDMX. Consulta disponibilidad en Business Suites Kepler.',
      heading: 'Habitación', emphasis: 'Queen.',
      lead: 'Un espacio de 27 m² con cama Queen, escritorio y baño privado para tu estancia en Verónica Anzúres, cerca de Polanco, Ciudad de México.',
      introTitle: 'Lo esencial para disfrutar la ciudad.',
      paragraphs: [
        'La Habitación Queen es la opción más compacta de Business Suites Kepler. Reúne una cama Queen, un escritorio y un baño privado en un espacio de 27 m², pensado para quienes buscan una habitación funcional como punto de partida en Ciudad de México.',
        'El escritorio permite organizar tu jornada o preparar el siguiente recorrido. Al volver, tendrás tu propio espacio para descansar, con Wi-Fi en la habitación y servicio de limpieza diaria.',
        'Puedes comparar sus características con la Habitación King, que ofrece 30 m², balcón y acceso a una cocineta exterior. La Grand Suite es la alternativa cuando necesitas cocina interior, sala y comedor.',
      ],
      facts: ['27 m²', 'Cama Queen', 'Escritorio', 'Baño privado'],
      amenities: ['Escritorio', 'Baño privado'],
      imageAlt: 'Habitación Queen con cama y área de trabajo en Business Suites Kepler',
      bed: 'Cama Queen',
    },
    en: {
      name: 'Queen Room',
      title: 'Queen Room near Polanco, Mexico City | Business Suites Kepler',
      description: 'A 27 m² Queen Room with a desk and private bathroom in Verónica Anzúres, near Polanco, Mexico City. Check availability at Business Suites Kepler.',
      heading: 'Queen', emphasis: 'Room.',
      lead: 'A 27 m² space with a Queen bed, desk and private bathroom for your stay in Verónica Anzúres, near Polanco, Mexico City.',
      introTitle: 'The essentials for enjoying the city.',
      paragraphs: [
        'The Queen Room is the most compact accommodation at Business Suites Kepler. It brings together a Queen bed, desk and private bathroom in 27 m² for guests who want a practical room as their base in Mexico City.',
        'Use the desk to plan your day or prepare for your next outing. When you return, you will have your own space to rest, with in-room Wi-Fi and daily housekeeping.',
        'Compare it with the King Room, which offers 30 m², a balcony and access to an external kitchenette. The Grand Suite is an alternative when you need an indoor kitchen, living room and dining area.',
      ],
      facts: ['27 m²', 'Queen bed', 'Desk', 'Private bathroom'],
      amenities: ['Desk', 'Private bathroom'],
      imageAlt: 'Queen room with a bed and workspace at Business Suites Kepler',
      bed: 'Queen bed',
    },
  },
];

export const localizedPages: LocalizedPaths[] = [homePaths, privacyPaths, ...rooms.map(room => room.paths)];

export function roomSchema(room: Room, lang: Language) {
  const content = room[lang];
  const url = absoluteUrl(room.paths[lang]);
  const hotel = hotelSchema(lang);
  const { '@context': _context, ...hotelNode } = hotel;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      hotelNode,
      {
        '@type': 'HotelRoom', '@id': `${url}#room`, url,
        name: content.name, description: content.lead,
        image: [room.image, ...(room.gallery || []).map(photo => photo.image)].map(absoluteUrl),
        containedInPlace: { '@id': hotel['@id'] },
        bed: content.bed,
        floorSize: {
          '@type': 'QuantitativeValue', unitCode: 'MTK',
          ...(typeof room.size === 'number' ? { value: room.size } : room.size),
        },
        amenityFeature: content.amenities.map(name => ({
          '@type': 'LocationFeatureSpecification', name, value: true,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Business Suites Kepler', item: absoluteUrl(homePaths[lang]) },
          { '@type': 'ListItem', position: 2, name: content.name, item: url },
        ],
      },
    ],
  };
}
