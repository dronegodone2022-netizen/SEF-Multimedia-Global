
import { Service, Project, Testimonial, FAQItem, Course } from './types';

// Placeholder image URLs to avoid missing local asset files in this environment.


const photograp = '/src/assests/photograp.jpg';
const photograp1 = '/src/assests/photograp1.jpeg';
const photograp2 = '/src/assests/photograp2.jpeg';
const photograp3 = '/src/assests/photograp3.jpeg';
const photograp4 = '/src/assests/photograp4.jpeg';
const photograp5 = '/src/assests/photograp5.jpeg';
const photograp6 = '/src/assests/photograp6.jpg';
const photograp7 = '/src/assests/photograp7.jpg';
const photograp8 = '/src/assests/photograp8.jpg';
const videograp = '/src/assests/videograp.jpg';
const graphic = '/src/assests/graphic.jpg';
const website1 = '/src/assests/website (1).jpeg';
const website2 = '/src/assests/website (2).jpeg';
const website3 = '/src/assests/website (3).jpeg';
const website4 = '/src/assests/website (4).jpeg';
const website5 = '/src/assests/website(5).jpg';
const website6 = '/src/assests/website(6).jpg';
const LogoDesign1 = '/src/assests/LogoDesign1.jpg';
const LogoDesign2 = '/src/assests/LogoDesign2.jpg';
const LogoDesign3 = '/src/assests/LogoDesign3.jpg';
const LogoDesign4 = '/src/assests/LogoDesign4.jpg';
const LogoDesign5 = '/src/assests/LogoDesign5.jpg';
const LogoDesign6 = '/src/assests/LogoDesign6.jpg';
const LogoDesign7 = '/src/assests/LogoDesign7.jpg';
const LogoDesign9 = '/src/assests/LogoDesign9.jpg';
const LogoDesign10 = '/src/assests/LogoDesign10.jpg';
const LogoDesign11 = '/src/assests/LogoDesign11.jpg';
const LogoDesign12 = '/src/assests/LogoDesign12.jpg';
const clients = '/src/assests/clients.jpg';
const ClothD1 = '/src/assests/clothDesign1.jpg';
const ClothD2 = '/src/assests/clothDesign2.jpg';
const ClothD3 = '/src/assests/clothDesign3.jpg';
const ClothD4 = '/src/assests/clothDesign4.jpg';
const ClothD5 = '/src/assests/clothDesign5.jpg';
const ClothD6 = '/src/assests/clothDesign6.jpg';
const ClothD7 = '/src/assests/clothDesign7.jpg';
const Flyer1 = '/src/assests/FlyerDesign1.jpg';
const Flyer2 = '/src/assests/FlyerDesign2.jpg';
const Flyer3 = '/src/assests/FlyerDesign3.jpg';
const Flyer4 = '/src/assests/FlyerDesign4.jpg';
const Flyer5 = '/src/assests/FlyerDesign5.jpg';
const Flyer6 = '/src/assests/FlyerDesign6.jpg';
const Flyer7 = '/src/assests/FlyerDesign7.jpg';
const Flyer8 = '/src/assests/FlyerDesign8.jpg';
const Flyer9 = '/src/assests/FlyerDesign9.jpg';
const Flyer10 = '/src/assests/FlyerDesign10.jpg';
const Flyer11 = '/src/assests/FlyerDesign11.jpg';
const Flyer12 = '/src/assests/FlyerDesign12.jpg';
const Flyer13 = '/src/assests/FlyerDesign13.jpg';
const Flyer14 = '/src/assests/FlyerDesign14.jpg';
const Flyer15 = '/src/assests/FlyerDesign15.jpg';
const Flyer16 = '/src/assests/FlyerDesign16.jpg';
const Flyer17 = '/src/assests/FlyerDesign17.jpg';
const Flyer18 = '/src/assests/FlyerDesign18.jpg';
const Flyer19 = '/src/assests/FlyerDesign19.jpg';
const Flyer20 = '/src/assests/FlyerDesign20.jpg';
const certificate1 = '/src/assests/crtificate1.jpg';
const certificate2 = '/src/assests/crtificate2.jpg';
const certificate3 = '/src/assests/crtificate3.jpg';
const certificate4 = '/src/assests/crtificate4.jpg';
const clients2 = '/src/assests/clients2.jpg';
const clients1 = '/src/assests/clients1.jpg';

export const SERVICES: Service[] = [
  {
    id: 'videography',
    title: 'Videography',
    description: 'We craft compelling videos from weddings and documentaries to corporate promos that tell stories and leave lasting impressions.',
    icon: 'Video',
    color: 'bg-teal-500',
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'From portraits and events to product and brand photography, we capture moments with precision, creativity, and elegance.',
    icon: 'Camera',
    color: 'bg-orange-500',
  },
  {
    id: 'web-dev',
    title: 'Computer Training & Repair',
    description: 'Comprehensive computer training and repair services to keep your technology running smoothly.',
    icon: 'Monitor',
    color: 'bg-blue-500',
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Logos, branding, marketing materials, and digital graphics designed to visually communicate your message and identity.',
    icon: 'PenTool',
    color: 'bg-rose-500',
  }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'BANJE NATASHA Official 4K Video',
    category: 'Videography',
    imageUrl: videograp,
    description: 'A stunning 4K music video production featuring BANJE NATASHA with cinematic visuals and professional editing.',
    link: 'https://www.youtube.com/watch?v=DaEN_WnQiwI'
  },
  {
    id: '2',
    title: 'Your Love - SL BIG STATE ft. LIAM',
    category: 'Videography',
    imageUrl: videograp,
    description: 'Official music video for SL BIG STATE featuring LIAM, showcasing dynamic storytelling and high-quality production.',
    link: 'https://www.youtube.com/watch?v=uTNuCJJNqTw'
  },
  {
    id: 'v3',
    title: 'Fadah Cross x Internet Man',
    category: 'Videography',
    imageUrl: videograp,
    description: 'Collaborative music video production bringing together Fadah Cross and Internet Man in an epic visual experience.',
    link: 'https://www.youtube.com/watch?v=7QN1PIEljzk'
  },
  {
    id: 'v4',
    title: 'LADY NANCY - NA GOD',
    category: 'Videography',
    imageUrl: videograp,
    description: 'Official music video for LADY NANCY\'s track "NA GOD" with compelling visuals and professional cinematography.',
    link: 'https://www.youtube.com/watch?v=PLbEOYxe1TU'
  },
  {
    id: 'v5',
    title: 'Fadah Cross - INSIE SALONE',
    category: 'Videography',
    imageUrl: videograp,
    description: 'Cinematic music video for Fadah Cross\'s "INSIE SALONE" featuring authentic storytelling and cultural elements.',
    link: 'https://www.youtube.com/watch?v=B0NasuLh5gw'
  },
  {
    id: 'v6',
    title: 'SHAWARMA DANCE - STUNT MAN',
    category: 'Videography',
    imageUrl: videograp,
    description: 'Energetic music video for STUNT MAN\'s "SHAWARMA DANCE" with dynamic choreography and vibrant visuals.',
    link: 'https://www.youtube.com/watch?v=Mt4Oa7ADQQ0'
  },
 


  {
    id: 'web1',
    title: 'Ogramic Heair Online Product Store',
    category: 'Web Development',
    imageUrl: website1,
    description: 'An online store for Ogramic Heair, featuring a modern design and seamless shopping experience.',
  },
  {
    id: 'web2',
    title: 'Bluetooth Sound Device Company Website',
    category: 'Web Development',
    imageUrl: website2,
    description: 'A modern website for a Bluetooth sound device company, showcasing their products and features.',
  },
  {
    id: 'web3',
    title: 'Dog Care Service Website',
    category: 'Web Development',
    imageUrl: website3,
    description: 'A website for a dog care service, providing information about their offerings and contact details.',
  },
  {
    id: 'web4',
    title: 'Online Airtime Subscription Platform',
    category: 'Web Development',
    imageUrl: website4,
    description: 'A platform for subscribing to online airtime services with a user-friendly interface.',
  },
  {
    id: 'web5',
    title: 'Real Estate Agency Website',
    category: 'Web Development',
    imageUrl: website5,
    description: 'A modern website for a real estate agency, showcasing properties and providing a seamless user experience.',
  },
  {
    id: 'web6',
    title: 'FinTech Startup Landing Page',
    category: 'Web Development',
    imageUrl: website6,
    description: 'A landing page for a FinTech startup, designed to attract investors and customers with a sleek, professional look.',
  },
  {
    id: '5',
    title: 'Fashion Photography',
    category: 'Photography',
    imageUrl: photograp1,
    description: 'High-end fashion photography session for a seasonal collection, focusing on style, elegance, and visual storytelling.',
  },
  
  {
    id: '8',
    title: 'Lifestyle Shoot',
    category: 'Photography',
    imageUrl: photograp2,
    description: 'Natural lifestyle photography capturing real moments in beautiful, candid compositions.',
  },
  {
    id: '9',
    title: 'Product Detail Photography',
    category: 'Photography',
    imageUrl: photograp3,
    description: 'Clean, high-quality product photography created for catalogs and online shops.',
  },

  {
    id: '11',
    title: 'Creative Editorial Frame',
    category: 'Photography',
    imageUrl: photograp4,
    description: 'A creative editorial-style image with bold framing and dramatic lighting.',
  },
  {
    id: '12',
    title: 'Fashion Shoot Highlight',
    category: 'Photography',
    imageUrl: photograp5,
    description: 'A fashion-forward photography set with bold styling and striking visuals.',
  },
  {
    id: '13',
    title: 'Fine Art Portrait',
    category: 'Photography',
    imageUrl: photograp6,
    description: 'An elegant portrait image focused on mood, texture, and editorial storytelling.',
  },
   {
    id: '14',
    title: 'Fine Art Portrait',
    category: 'Photography',
    imageUrl: photograp7,
    description: 'An elegant portrait image focused on mood, texture, and editorial storytelling.',
  },
   {
    id: '15',
    title: 'Fine Art Portrait',
    category: 'Photography',
    imageUrl: photograp8,
    description: 'An elegant portrait image focused on mood, texture, and editorial storytelling.',
  },
  {
    id: '6',
    title: 'FaNEA Aword Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign1,
    description: 'Professional AWORD logo design featuring creative, modern aesthetics and a memorable brand identity for an event planning company.',
  },
  {
    id: '14',
    title: 'Association Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign2,
    description: 'A modern logo design for an association, combining contemporary aesthetics with a sense of unity.',
  },
  {
    id: '21',
    title: 'Komse Design Clothing Brand Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign3,
    description: 'A contemporary clothing brand logo that blends modern aesthetics with stylish, professional branding elements.',
  },
  {
    id: '22',
    title: 'Music Artist Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign4,
    description: 'A modern logo design for a music artist, combining contemporary aesthetics with a professional, memorable brand identity.',
  },
  {
    id: '23',
    title: 'E-Commerce Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign5,
    description: 'Energetic logo design for an e-commerce business, promoting sales and customer engagement through dynamic visuals.',
  },
  {
    id: '24',
    title: 'Church Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign6,
    description: 'A meaningful logo design for a church, combining spiritual elements with a professional brand identity.',
  },
 
  {
    id: '25',
    title: 'Precision Drone Company Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign7,
    description: 'A modern logo design for a precision drone company, combining cutting-edge technology with a professional brand identity.',
  },
  {
    id: '26',
    title: 'Car Rental Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign9,
    description: 'Modern, stylish logo design for a car rental company. The design combines contemporary aesthetics with a professional, memorable brand identity.',
  },
  
  {
    id: '28',
    title: 'Family Legacy Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign10,
    description: 'A modern logo design for a family foundation, combining contemporary style with a warm, professional brand identity.',
  },
  {
    id: '29',
    title: 'Event Planning Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign11,
    description: 'Stylish logo design for an event planning company, combining contemporary aesthetics with a professional, memorable brand identity.',
  },
 
  {
    id: '31',
    title: 'Agric Farm Logo Design',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    imageUrl: LogoDesign12,
    description: 'A modern logo design for an agricultural business, combining contemporary aesthetics with a professional, memorable brand identity that reflects growth and sustainability.',
  },
  
  {
    id: '34',
    title: 'Eid Mubarak Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer1,
    description: ' Vibrant Eid Mubarak flyer design with festive typography and eye-catching visuals to celebrate the holiday season.',
  },
  {
    id: '35',
    title: 'Event Participant Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer2,
    description: 'A vibrant flyer design for event participants, featuring modern typography and engaging visuals.',
  },
  {
    id: '40',
    title: 'Music Release Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer3,
    description: 'Dynamic music release flyer design with bold graphics and compelling call-to-action to promote the new album.',
  },
  {
    id: '41',
    title: 'Campaign Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer4,
    description: 'Strategic campaign flyer design featuring compelling imagery and messaging to drive engagement and support.',
  },
  {
    id: '42',
    title: 'Event Speaker Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer5,
    description: 'Professional event speaker flyer design with elegant typography and effective call-to-action to maximize attendance.',
  },
  {
    id: '43',
    title: 'Services Advertisement Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer6,
    description: 'Creative services advertisement flyer design with eye-catching visuals and strong branding to promote business offerings.',
  },
  {
    id: '44',
    title: 'Fashion Event Poster Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer7,
    description: 'A stylish fashion event poster design combining vibrant colors with compelling typography to create a memorable promotional piece.',
  },
  {
    id: '45',
    title: 'Social Media Live Session Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer8,
    description: 'Engaging social media live session flyer design with bold graphics and clear messaging to maximize online attendance and interaction.',
  },
  {
    id: '46',
    title: 'Easter Wishes Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer9,
    description: 'A vibrant Easter wishes flyer design with festive typography and eye-catching visuals to celebrate the holiday season.',
  },
  {
    id: '47',
    title: 'Good Friday Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer10,
    description: 'A thoughtful Good Friday flyer design with meaningful imagery and heartfelt messaging.',
  },
  {
    id: '48',
    title: 'Program Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer11,
    description: 'Professional program flyer design with strategic layout and compelling visual hierarchy to effectively communicate event details.',
  },
  {
    id: '49',
    title: 'March 8th Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer12,
    description: 'A vibrant March 8th flyer design celebrating International Women’s Day with bold graphics and empowering messaging.',
  },
  {
    id: '50',
    title: 'Nations Cup Next Match Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer13,
    description: 'A vibrant Nations Cup next match flyer design with bold graphics and compelling messaging to promote the upcoming game.',
  },
  {
    id: '51',
    title: 'Church Service Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer14,
    description: 'Dynamic church service flyer design with bold graphics and compelling call-to-action to promote the upcoming service.',
  },
  {
    id: '52',
    title: 'Photo Studio Service Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer15,
    description: 'Professional photo studio service flyer design with elegant typography and effective call-to-action to maximize attendance and community engagement.',
  },
  {
    id: '53',
    title: 'Nations Cup Next Match Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer16,
    description: 'A vibrant Nations Cup next match flyer design with bold graphics and compelling messaging to promote the upcoming game.',
  },
  {
    id: '54',
    title: 'Event Finalist Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer17,
    description: 'Dynamic event finalist flyer design with bold graphics and compelling call-to-action to promote the upcoming event.',
  },
  {
    id: '55',
    title: 'Call for Audition Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer18,
    description: 'A vibrant call for audition flyer design with bold graphics and compelling messaging to promote the upcoming audition.',
  },
   {
    id: '56',
    title: 'Call for Audition Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer19,
    description: 'A vibrant call for audition flyer design with bold graphics and compelling messaging to promote the upcoming audition.',
  },
 
  {
    id: '57',
    title: 'Event Host Flyer Design',
    category: 'Graphic Design',
    subcategory: 'Flyers/Posters',
    imageUrl: Flyer20,
    description: 'Engaging event host flyer design with bold graphics and clear messaging to attract talented participants and maximize response.',
  },
  
  {
    id: '64',
    title: 'Komse Design 1961 Teacksuit',
    category: 'Graphic Design',
    subcategory: 'Cloth Branding',
    imageUrl: ClothD1,
    description: 'A modern tracksuit branding design for Komse Design, featuring bold fashion-forward elements and a strong retail aesthetic.',
  },
  {
    id: '65',
    title: 'Komse Design 1961 Sommer Shirt Green',
    category: 'Graphic Design',
    subcategory: 'Cloth Branding',
    imageUrl: ClothD2,
    description: 'A summer shirt branding design for Komse Design, featuring bold fashion-forward elements and a strong retail aesthetic.',
  },
  {
    id: '66',
    title: 'Komse Design Nan Slaone Sweater',
    category: 'Graphic Design',
    subcategory: 'Cloth Branding',
    imageUrl: ClothD3,
    description: 'A creative sweater branding design for Komse Design, featuring distinctive print and label treatments.',
  },
  {
    id: '67',
    title: 'Komse Design 1961 Sommer Shirt Blue',
    category: 'Graphic Design',
    subcategory: 'Cloth Branding',
    imageUrl: ClothD4,
    description: 'A summer shirt branding design for Komse Design, featuring bold fashion-forward elements and a strong retail aesthetic.',
  },
  {
    id: '68',
    title: 'Komse Design Naw Slone Hat',
    category: 'Graphic Design',
    subcategory: 'Cloth Branding',
    imageUrl: ClothD5,
    description: 'A stylish hat branding design for Komse Design, featuring distinctive print and label treatments.',
  },

  {
    id: '69',
    title: 'Komse Design 1961 Sommer Shirt Layout',
    category: 'Graphic Design',
    subcategory: 'Cloth Branding',
    imageUrl: ClothD6,
    description: 'A summer shirt branding design for Komse Design, featuring bold fashion-forward elements and a strong retail aesthetic.',
  },
  {
    id: '70',
    title: 'Komse Design Hoodie Branding',
    category: 'Graphic Design',
    subcategory: 'Cloth Branding',
    imageUrl: ClothD7,
    description: 'A stylish hoodie branding design for Komse Design, featuring bold fashion-forward elements and a strong retail aesthetic.',
  },
  
  {
    id: '82',
    title: 'Certificate Design 1',
    category: 'Graphic Design',
    subcategory: 'Certificate/Invitation',
    imageUrl: certificate1,
    description: 'A modern certificate layout with refined borders, gold accents, and clean typography for formal presentations.',
  },
  {
    id: '83',
    title: 'Certificate Design 2',
    category: 'Graphic Design',
    subcategory: 'Certificate/Invitation',
    imageUrl: certificate2,
    description: 'A polished certificate design featuring elegant text hierarchy and a professional finish for achievements and awards.',
  },
  {
    id: '84',
    title: 'Acknowledgement Certificate 1',
    category: 'Graphic Design',
    subcategory: 'Certificate/Invitation',
    imageUrl: certificate3,
    description: 'A stylish acknowledgement certificate design with a subtle, premium paper texture and modern layout.',
  },
  {
    id: '85',
    title: 'Acknowledgement Certificate 2',
    category: 'Graphic Design',
    subcategory: 'Certificate/Invitation',
    imageUrl: certificate4,
    description: 'A clean and elegant certificate format created to celebrate recognition and appreciation with a refined visual style.',
  },
  
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Komse Komba',
    role: 'CEO, Komse Design',
    service: 'Logo Design & Cloth Branding',
    content: 'SEF Multimedia Global delivered exceptional logo design and clothing branding for our fashion line. Their creativity and professionalism exceeded our expectations, resulting in a strong brand identity that resonates with our customers.',
    avatar: clients,
    rating: 5
  },
  {
    id: '2',
    name: 'S. Bah',
    role: 'SuperLife Sales Manager SL',
    service: 'Graphic Design & Promotional Materials',
    content: 'SEF Multimedia Global provided outstanding graphic design services for our promotional materials. Their innovative designs and attention to detail significantly enhanced our marketing campaigns, leading to increased brand visibility and customer engagement.',
    avatar: clients2,
    rating: 5
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'Marketing Director',
    service: 'Graphic Design',
    content: 'SEF Multimedia Global transformed our marketing materials with their creative graphic design. Their ability to understand our brand and deliver visually stunning designs has been instrumental in our successful campaigns.',
    avatar: clients1,
    rating: 4
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'What services do you offer?',
    answer: 'We offer comprehensive multimedia services including professional photography, videography, graphic design, and web development.'
  },
  {
    question: 'How do I book your services?',
    answer: 'You can book our services by clicking the "Book a Session" button or contacting us via WhatsApp (+23275510770).'
  },
  {
    question: 'Do you travel for projects?',
    answer: 'Yes, we are available for projects both locally and internationally. Travel costs will be discussed during project estimation.'
  }
];

export const LEARNING_FAQS: FAQItem[] = [
  {
    question: 'Are the courses online or in-person?',
    answer: 'We offer both options. Most of our technical courses have online components, while hands-on sessions like photography and videography include in-person workshops at our studio.'
  },
  {
    question: 'Do I get a certificate after completion?',
    answer: 'Yes, all students who successfully complete their course requirements and final project receive a professional certificate from SEF Academy.'
  },
  {
    question: 'What equipment do I need to start?',
    answer: 'For beginner courses, we provide basic equipment. For intermediate and advanced levels, we recommend having your own gear, but we also offer equipment rental for students.'
  },
  {
    question: 'Can I pay in installments?',
    answer: 'Yes, we offer flexible payment plans for our longer courses. You can discuss the details with our learning consultants during enrollment.'
  }
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Photography Masterclass',
    category: 'Photography',
    description: 'Master the art of lighting, camera, composition, and post-processing in this comprehensive photography course.',
    duration: '4 Weeks',
    price: '$199',
    imageUrl: photograp,
    level: 'Beginner',
  },
  {
    id: 'c2',
    title: 'Cinematic Videography & Editing',
    category: 'Videography',
    description: 'Learn to shoot and edit cinematic videos that tell powerful stories. Includes Premiere Pro & DaVinci Resolve training.',
    duration: '6 Weeks',
    price: '$299',
    imageUrl: videograp,
    level: 'Intermediate',
  },
  {
    id: 'c3',
    title: 'Graphic Design ',
    category: 'Graphic Design',
    description: 'Learn the fundamentals of graphic design, including typography, color theory, and layout, using Adobe Photoshop and Illustrator.',
    duration: '4 Weeks',
    price: '$200',
    imageUrl: graphic,
    level: 'Beginner',
  },
  
];
