export const categories = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'HVAC Technician',
  'Mason',
  'Roofing Specialist',
  'Landscaper/Gardener',
  'Pest Control',
  'Appliance Repair Technician'
];

export const districts = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna'
];

export const serviceProviders = [
  {
    id: 1,
    name: 'John Silva',
    category: 'Plumber',
    experience: '8 years',
    district: 'Colombo',
    address: 'No. 123, Main Street, Colombo 03',
    hourlyRate: 'Rs. 1,500',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    description: 'Professional plumber with expertise in residential and commercial plumbing. Specialized in emergency repairs and maintenance.',
    reviews: [
      { rating: 5, comment: 'Excellent service, very professional' },
      { rating: 4, comment: 'Good work, reasonable rates' }
    ],
    previousWorks: [
      'Apartment complex in Colombo 03',
      'Office building in Fort',
      'Residential house in Mount Lavinia'
    ]
  },
  {
    id: 2,
    name: 'Priya Fernando',
    category: 'Electrician',
    experience: '12 years',
    district: 'Kandy',
    address: 'No. 45, Peradeniya Road, Kandy',
    hourlyRate: 'Rs. 2,000',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    description: 'Licensed electrician with extensive experience in both residential and commercial electrical work. Certified in safety standards.',
    reviews: [
      { rating: 5, comment: 'Very knowledgeable and professional' },
      { rating: 5, comment: 'Great work on our office renovation' }
    ],
    previousWorks: [
      'Hotel renovation in Kandy',
      'Factory electrical system upgrade',
      'Residential wiring projects'
    ]
  },
  {
    id: 3,
    name: 'Ravi Perera',
    category: 'Carpenter',
    experience: '15 years',
    district: 'Gampaha',
    address: 'No. 78, Negombo Road, Gampaha',
    hourlyRate: 'Rs. 1,800',
    profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    description: 'Master carpenter specializing in custom furniture and home renovations. Expert in both traditional and modern woodworking.',
    reviews: [
      { rating: 5, comment: 'Beautiful custom cabinets' },
      { rating: 4, comment: 'Very skilled craftsman' }
    ],
    previousWorks: [
      'Custom kitchen cabinets',
      'Wooden deck installation',
      'Furniture restoration'
    ]
  },
  {
    id: 4,
    name: 'Samantha Rajapakse',
    category: 'Painter',
    experience: '6 years',
    district: 'Galle',
    address: 'No. 34, Beach Road, Galle',
    hourlyRate: 'Rs. 1,200',
    profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
    description: 'Professional painter with expertise in both interior and exterior painting. Specialized in decorative finishes and murals.',
    reviews: [
      { rating: 5, comment: 'Excellent attention to detail' },
      { rating: 4, comment: 'Very clean work' }
    ],
    previousWorks: [
      'Hotel interior painting',
      'Residential exterior painting',
      'Mural projects'
    ]
  },
  {
    id: 5,
    name: 'Dilshan Jayawardena',
    category: 'HVAC Technician',
    experience: '10 years',
    district: 'Colombo',
    address: 'No. 56, Union Place, Colombo 02',
    hourlyRate: 'Rs. 2,500',
    profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
    description: 'Certified HVAC technician with expertise in installation, maintenance, and repair of all types of air conditioning systems.',
    reviews: [
      { rating: 5, comment: 'Very professional and efficient' },
      { rating: 5, comment: 'Great service at reasonable rates' }
    ],
    previousWorks: [
      'Office building AC installation',
      'Shopping mall maintenance',
      'Residential AC repairs'
    ]
  },
  {
    id: 6,
    name: 'Kumara Bandara',
    category: 'Mason',
    experience: '20 years',
    district: 'Matale',
    address: 'No. 89, Dambulla Road, Matale',
    hourlyRate: 'Rs. 2,200',
    profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg',
    description: 'Experienced mason specializing in brickwork, concrete work, and stone masonry. Expert in both traditional and modern techniques.',
    reviews: [
      { rating: 5, comment: 'Excellent craftsmanship' },
      { rating: 5, comment: 'Very reliable and skilled' }
    ],
    previousWorks: [
      'House foundation work',
      'Retaining wall construction',
      'Stone wall installation'
    ]
  },
  {
    id: 7,
    name: 'Malini Wickramasinghe',
    category: 'Roofing Specialist',
    experience: '9 years',
    district: 'Kalutara',
    address: 'No. 12, Beach Road, Kalutara',
    hourlyRate: 'Rs. 2,800',
    profilePicture: 'https://randomuser.me/api/portraits/women/7.jpg',
    description: 'Professional roofing specialist with expertise in installation, repair, and maintenance of various roofing systems.',
    reviews: [
      { rating: 5, comment: 'Very thorough and professional' },
      { rating: 4, comment: 'Good quality work' }
    ],
    previousWorks: [
      'House roof replacement',
      'Commercial building roofing',
      'Leak repairs'
    ]
  },
  {
    id: 8,
    name: 'Chaminda Perera',
    category: 'Landscaper/Gardener',
    experience: '7 years',
    district: 'Nuwara Eliya',
    address: 'No. 23, St. Andrews Road, Nuwara Eliya',
    hourlyRate: 'Rs. 1,500',
    profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg',
    description: 'Professional landscaper and gardener with expertise in garden design, maintenance, and plant care.',
    reviews: [
      { rating: 5, comment: 'Beautiful garden design' },
      { rating: 4, comment: 'Very knowledgeable about plants' }
    ],
    previousWorks: [
      'Residential garden design',
      'Hotel landscaping',
      'Garden maintenance'
    ]
  },
  {
    id: 9,
    name: 'Thilina Rathnayake',
    category: 'Pest Control',
    experience: '11 years',
    district: 'Colombo',
    address: 'No. 67, Marine Drive, Colombo 03',
    hourlyRate: 'Rs. 2,000',
    profilePicture: 'https://randomuser.me/api/portraits/men/9.jpg',
    description: 'Licensed pest control specialist with expertise in both residential and commercial pest management.',
    reviews: [
      { rating: 5, comment: 'Very effective treatment' },
      { rating: 5, comment: 'Professional and thorough' }
    ],
    previousWorks: [
      'Hotel pest control',
      'Residential pest management',
      'Commercial building treatment'
    ]
  },
  {
    id: 10,
    name: 'Dinesh Kumar',
    category: 'Appliance Repair Technician',
    experience: '13 years',
    district: 'Gampaha',
    address: 'No. 45, Negombo Road, Gampaha',
    hourlyRate: 'Rs. 1,800',
    profilePicture: 'https://randomuser.me/api/portraits/men/10.jpg',
    description: 'Expert appliance repair technician specializing in repairing various household appliances and electronics.',
    reviews: [
      { rating: 5, comment: 'Fixed my refrigerator quickly' },
      { rating: 4, comment: 'Good service at reasonable rates' }
    ],
    previousWorks: [
      'Refrigerator repairs',
      'Washing machine maintenance',
      'Air conditioner repairs'
    ]
  }
]; 