import casual from 'casual';

casual.define('address', function() {
  return casual.random_element([ 
    "Phnom Penh", "Siem Reap", "Battambang",
    "Kompong Thom", "Ta Keov", "Kratie", "Kompong Cham",
    "Kompong Sper", "Prey Veng", "Steng Traeng"
  ]);
});

casual.define('sex', function() {
  return casual.random_element([ "M", "F" ]);
});

casual.define('card', function() {
  return casual.random_element([ "Visa", "Master" ]);
});