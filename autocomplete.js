// List of Indian cities with airport codes
const indianAirports = [
  { code: 'DEL', city: 'Delhi' },
  { code: 'BOM', city: 'Mumbai' },
  { code: 'BLR', city: 'Bangalore' },
  { code: 'HYD', city: 'Hyderabad' },
  { code: 'MAA', city: 'Chennai' },
  { code: 'CCU', city: 'Kolkata' },
  { code: 'GOI', city: 'Goa' },
  { code: 'COK', city: 'Kochi' },
  { code: 'PNQ', city: 'Pune' },
  { code: 'AMD', city: 'Ahmedabad' },
  { code: 'JAI', city: 'Jaipur' },
  { code: 'LKO', city: 'Lucknow' },
  { code: 'IXC', city: 'Chandigarh' },
  { code: 'PAT', city: 'Patna' },
  { code: 'BBI', city: 'Bhubaneswar' },
  { code: 'GAU', city: 'Guwahati' },
  { code: 'IXZ', city: 'Port Blair' },
  { code: 'IXB', city: 'Bagdogra' },
  { code: 'ATQ', city: 'Amritsar' },
  { code: 'VTZ', city: 'Visakhapatnam' }
];

// Create datalists for autocomplete on page load
document.addEventListener('DOMContentLoaded', function() {
  setupAirportAutocomplete('origin');
  setupAirportAutocomplete('destination');
});

// Function to setup autocomplete for airport fields
function setupAirportAutocomplete(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // Create a datalist element
  const datalistId = `${fieldId}-list`;
  let datalist = document.getElementById(datalistId);
  
  // If datalist doesn't exist, create it
  if (!datalist) {
    datalist = document.createElement('datalist');
    datalist.id = datalistId;
    document.body.appendChild(datalist);
  }
  
  // Clear existing options
  datalist.innerHTML = '';
  
  // Add options to datalist
  indianAirports.forEach(airport => {
    const option = document.createElement('option');
    option.value = `${airport.city} (${airport.code})`;
    datalist.appendChild(option);
  });
  
  // Connect datalist to input field
  field.setAttribute('list', datalistId);
  
  // Handle selection
  field.addEventListener('input', function() {
    const value = this.value;
    const match = value.match(/\(([A-Z]{3})\)/);
    
    if (match) {
      this.dataset.code = match[1];
    } else {
      this.dataset.code = '';
    }
  });
}