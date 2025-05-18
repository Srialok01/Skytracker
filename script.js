// Simulated price history data (in a real app, this would come from the API)
const mockPriceHistory = {
  'IndiGo': [
    { date: '2023-06-15', price: 5500 },
    { date: '2023-06-22', price: 5200 },
    { date: '2023-06-29', price: 4900 },
    { date: '2023-07-05', price: 4800 },
    { date: '2023-07-12', price: 4500 }
  ],
  'Air India': [
    { date: '2023-06-15', price: 6200 },
    { date: '2023-06-22', price: 5800 },
    { date: '2023-06-29', price: 5500 },
    { date: '2023-07-05', price: 5300 },
    { date: '2023-07-12', price: 5200 }
  ],
  'SpiceJet': [
    { date: '2023-06-15', price: 5100 },
    { date: '2023-06-22', price: 4800 },
    { date: '2023-06-29', price: 4600 },
    { date: '2023-07-05', price: 4300 },
    { date: '2023-07-12', price: 3900 }
  ],
  'Vistara': [
    { date: '2023-06-15', price: 6500 },
    { date: '2023-06-22', price: 6300 },
    { date: '2023-06-29', price: 6100 },
    { date: '2023-07-05', price: 5900 },
    { date: '2023-07-12', price: 5800 }
  ],
  'GoAir': [
    { date: '2023-06-15', price: 4800 },
    { date: '2023-06-22', price: 4600 },
    { date: '2023-06-29', price: 4400 },
    { date: '2023-07-05', price: 4200 },
    { date: '2023-07-12', price: 4100 }
  ]
};

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

// DOM elements
document.addEventListener('DOMContentLoaded', () => {
  // Set default values for price range inputs
  document.getElementById('min-price').value = 1000;
  document.getElementById('max-price').value = 10000;

  // Set up autocomplete for origin and destination fields
  setupAutocomplete('origin');
  setupAutocomplete('destination');

  // Search form submission
  const searchForm = document.getElementById('flight-search-form');
  searchForm.addEventListener('submit', handleSearch);

  // Price slider
  const priceSlider = document.getElementById('price-range');
  priceSlider.addEventListener('input', handlePriceChange);

  // Reset filters button
  const resetFiltersBtn = document.getElementById('reset-filters');
  resetFiltersBtn.addEventListener('click', resetFilters);

  // Retry button for errors
  const retryBtn = document.getElementById('retry-btn');
  retryBtn.addEventListener('click', () => {
    document.getElementById('results-error').style.display = 'none';
    handleSearch(lastSearchEvent);
  });

  // Price alert modal
  const alertModal = document.getElementById('alert-modal');
  const closeModal = document.querySelector('.close-modal');
  const createAlertBtn = document.getElementById('create-alert-btn');
  const cancelBtn = document.getElementById('cancel-alert');

  createAlertBtn.addEventListener('click', openAlertModal);
  closeModal.addEventListener('click', () => alertModal.style.display = 'none');
  cancelBtn.addEventListener('click', () => alertModal.style.display = 'none');

  // Alert form submission
  const alertForm = document.getElementById('alert-form');
  alertForm.addEventListener('submit', handleCreateAlert);

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === alertModal) {
      alertModal.style.display = 'none';
    }
  });

  // Initialize destination links
  initDestinationLinks();
});

// Store last search parameters and event
let lastSearchParams = {};
let lastSearchEvent = null;
let selectedFlight = null;
let currentFlights = [];
let filteredFlights = [];
let currentAirlines = [];

// Handle search form submission
document.getElementById('flightSearchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('/api/flights');
        const flights = await response.json();

        const resultsDiv = document.getElementById('flightResults');
        resultsDiv.innerHTML = flights.map(flight => `
            <div class="flight-card">
                <h3>${flight.airline}</h3>
                <p>${flight.from} → ${flight.to}</p>
                <p>₹${flight.price}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching flights:', error);
    }
});

// Helper function to get city name from airport code
function getAirportCity(code) {
  const airport = indianAirports.find(a => a.code === code);
  return airport ? airport.city : code;
}

// Process search results
function processSearchResults() {
  document.getElementById('search-loader').style.display = 'none';

  if (currentFlights.length === 0) {
    document.getElementById('no-results-message').style.display = 'block';
    document.getElementById('no-results-message').innerHTML = `
      <p>No flights found for ${lastSearchParams.origin} to ${lastSearchParams.destination} on ${formatDate(lastSearchParams.departureDate)}. 
      Please try different search criteria.</p>
    `;
    return;
  }

  // Show results section
  document.getElementById('results-content').style.display = 'block';

  // Update airlines filter
  updateAirlineFilters();

  // Set max price for slider
  const maxPrice = Math.max(...currentFlights.map(flight => flight.price));
  const roundedMaxPrice = Math.ceil(maxPrice / 500) * 500; // Round up to nearest 500

  document.getElementById('price-range').max = roundedMaxPrice;
  document.getElementById('price-range').value = roundedMaxPrice;
  document.getElementById('max-price-label').textContent = `₹${roundedMaxPrice}`;
  document.getElementById('current-price-value').textContent = `₹${roundedMaxPrice}`;

  // Apply initial filters
  applyFilters();

  // Update results summary
  updateResultsSummary();
}

// Update airline filters
function updateAirlineFilters() {
  // Get unique airlines from flights
  currentAirlines = [...new Set(currentFlights.map(flight => flight.airline))];

  // Create checkboxes for each airline
  const airlineFiltersEl = document.getElementById('airline-filters');
  airlineFiltersEl.innerHTML = '';

  currentAirlines.forEach(airline => {
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `airline-${airline.toLowerCase().replace(/\s+/g, '-')}`;
    checkbox.checked = true;
    checkbox.addEventListener('change', applyFilters);

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = airline;

    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(label);
    airlineFiltersEl.appendChild(checkboxDiv);
  });
}

// Handle price slider change
functionfunction handlePriceChange(event) {
  const value = event.target.value;
  document.getElementById('current-price-value').textContent = `₹${value}`;
  applyFilters();
}

// Apply filters to flight results
function applyFilters() {
  // Get current price limit
  const priceLimit = parseInt(document.getElementById('price-range').value);

  // Get selected airlines
  const selectedAirlines = currentAirlines.filter(airline => {
    const checkbox = document.getElementById(`airline-${airline.toLowerCase().replace(/\s+/g, '-')}`);
    return checkbox && checkbox.checked;
  });

  // Get selected stop filters
  const nonStop = document.getElementById('non-stop').checked;
  const oneStop = document.getElementById('one-stop').checked;
  const twoStops = document.getElementById('two-plus-stops').checked;

  // Create array of allowed stops
  const allowedStops = [];
  if (nonStop) allowedStops.push(0);
  if (oneStop) allowedStops.push(1);
  if (twoStops) allowedStops.push(2, 3, 4); // 2+ stops

  // Filter flights
  filteredFlights = currentFlights.filter(flight => 
    flight.price <= priceLimit &&
    selectedAirlines.includes(flight.airline) &&
    allowedStops.includes(flight.stops)
  );

  // Sort flights by price (lowest first)
  filteredFlights.sort((a, b) => a.price - b.price);

  // Update results table
  updateResultsTable();
}

// Update results table
function updateResultsTable() {
  const tableBody = document.getElementById('results-table-body');
  tableBody.innerHTML = '';

  document.getElementById('results-count').textContent = `${filteredFlights.length} results found`;

  if (filteredFlights.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'No flights match your filters. Try adjusting your filters.';
    cell.className = 'text-center py-4';
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  // Add flights to table
  filteredFlights.forEach(flight => {
    const row = document.createElement('tr');

    // Airline column
    const airlineCell = document.createElement('td');
    airlineCell.innerHTML = `
      <div class="airline-container">
        <div class="airline-logo">${flight.airline[0]}</div>
        <span>${flight.airline}</span>
      </div>
    `;

    // Departure column
    const departureCell = document.createElement('td');
    departureCell.innerHTML = `
      <div class="flight-time">${flight.departureTime}</div>
      <div class="flight-location">${flight.origin}</div>
    `;

    // Arrival column
    const arrivalCell = document.createElement('td');
    arrivalCell.innerHTML = `
      <div class="flight-time">${flight.arrivalTime}</div>
      <div class="flight-location">${flight.destination}</div>
    `;

    // Duration column
    const durationCell = document.createElement('td');
    durationCell.innerHTML = `
      <div>${flight.duration}</div>
      <div class="flight-location">${flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</div>
    `;

    // Price column
    const priceCell = document.createElement('td');

    let priceChangeHtml = '';
    if (flight.priceChange !== 0) {
      const priceChangeClass = flight.priceChange < 0 ? 'price-drop' : 'price-rise';
      const priceChangeIcon = flight.priceChange < 0 ? '↓' : '↑';
      priceChangeHtml = `
        <div class="price-change ${priceChangeClass}">
          ${priceChangeIcon} ₹${Math.abs(flight.priceChange)} (last week)
        </div>
      `;
    }

    priceCell.innerHTML = `
      <div class="flight-price">₹${flight.price.toLocaleString('en-IN')}</div>
      ${priceChangeHtml}
    `;

    // Actions column
    const actionsCell = document.createElement('td');
    actionsCell.innerHTML = `
      <div class="action-buttons">
        <button class="btn btn-primary btn-sm track-btn" data-flight-id="${flight.id}">Track</button>
        <button class="btn btn-secondary btn-sm book-btn" data-flight-id="${flight.id}">Book</button>
      </div>
    `;

    // Append cells to row
    row.appendChild(airlineCell);
    row.appendChild(departureCell);
    row.appendChild(arrivalCell);
    row.appendChild(durationCell);
    row.appendChild(priceCell);
    row.appendChild(actionsCell);

    // Append row to table
    tableBody.appendChild(row);
  });

  // Add event listeners to track and book buttons
  document.querySelectorAll('.track-btn').forEach(btn => {
    btn.addEventListener('click', () => handleTrackPrice(parseInt(btn.getAttribute('data-flight-id'))));
  });

  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
      const flightId = parseInt(event.target.getAttribute('data-flight-id'));
      const flight = filteredFlights.find(f => f.id === flightId);
      if (flight) {
        handleBookFlight(flight);
      }
    });
  });
}

// Update results summary
function updateResultsSummary() {
  const { origin, destination, minPrice, maxPrice } = lastSearchParams;

  // Find lowest price
  const lowestPrice = Math.min(...currentFlights.map(flight => flight.price));

  // Group flights by date and count
  const flightsByDate = {};
  currentFlights.forEach(flight => {
    if (!flightsByDate[flight.departureDate]) {
      flightsByDate[flight.departureDate] = [];
    }
    flightsByDate[flight.departureDate].push(flight);
  });

  // Count unique dates
  const uniqueDates = Object.keys(flightsByDate).length;

  // Calculate days range
  let earliestDate = null;
  let latestDate = null;

  for (const dateStr in flightsByDate) {
    const date = new Date(dateStr);
    if (!earliestDate || date < earliestDate) {
      earliestDate = date;
    }
    if (!latestDate || date > latestDate) {
      latestDate = date;
    }
  }

  let dateRangeText = 'Multiple dates available';
  if (earliestDate && latestDate) {
    const daysDiff = Math.round((latestDate - earliestDate) / (1000 * 60 * 60 * 24));
    dateRangeText = `${uniqueDates} dates available over ${daysDiff} days`;
  }

  // Simulate price drop percentage (in a real app this would be calculated from historical data)
  const priceDropPercentage = Math.floor(Math.random() * 25) + 5;

  // Create summary HTML
  const summaryHtml = `
    <div class="summary-header">
      <h2>${origin} to ${destination}</h2>
      <div class="flight-date">Date: ${formatDate(lastSearchParams.departureDate)}</div>
      <div class="summary-price">Price range: ₹${minPrice} - ₹${maxPrice}</div>
      <div class="summary-date">${dateRangeText}</div>
    </div>
    <div class="summary-badges">
      <span class="badge badge-success">↓ Price Drop Alert</span>
      <span class="badge badge-primary">Best Time to Book</span>
      <span class="badge badge-warning">${priceDropPercentage}% Below Average</span>
    </div>
  `;

  document.getElementById('results-summary').innerHTML = summaryHtml;
}

// Reset filters to default
function resetFilters() {
  // Reset price slider to max
  const maxPrice = parseInt(document.getElementById('price-range').max);
  document.getElementById('price-range').value = maxPrice;
  document.getElementById('current-price-value').textContent = `₹${maxPrice}`;

  // Reset airline checkboxes
  currentAirlines.forEach(airline => {
    const checkbox = document.getElementById(`airline-${airline.toLowerCase().replace(/\s+/g, '-')}`);
    if (checkbox) checkbox.checked = true;
  });

  // Reset stops checkboxes
  document.getElementById('non-stop').checked = true;
  document.getElementById('one-stop').checked = true;
  document.getElementById('two-plus-stops').checked = false;

  // Apply filters
  applyFilters();
}

// Handle track price button click
function handleTrackPrice(flightId) {
  selectedFlight = currentFlights.find(flight => flight.id === flightId);
  openAlertModal();
}

// Open price alert modal
function openAlertModal() {
  const modal = document.getElementById('alert-modal');
  const flightDetailsEl = document.getElementById('alert-flight-details');

  // If no flight is selected, use the cheapest flight
  if (!selectedFlight && filteredFlights.length > 0) {
    selectedFlight = filteredFlights[0]; // Cheapest flight (already sorted)
  }

  // If we have a selected flight, fill in the flight details
  if (selectedFlight) {
    flightDetailsEl.innerHTML = `
      <div class="flight-route">
        <p class="font-medium">${selectedFlight.origin} → ${selectedFlight.destination}</p>
        <span class="flight-date">${formatDate(selectedFlight.departureDate)}</span>
      </div>
      <div class="current-price-box">
        <div class="current-price-label">Current lowest price</div>
        <div class="current-price-value">₹${selectedFlight.price.toLocaleString('en-IN')}</div>
      </div>
    `;

    // Set default target price (10% lower than current price)
    const targetPrice = Math.floor(selectedFlight.price * 0.9);
    document.getElementById('target-price').value = targetPrice;
  }

  modal.style.display = 'block';
}

// Handle create alert form submission
function handleCreateAlert(event) {
  event.preventDefault();

  if (!selectedFlight) {
    alert('Please select a flight first');
    return;
  }

  const targetPrice = parseInt(document.getElementById('target-price').value);
  const email = document.getElementById('alert-email').value;

  // Validate inputs
  if (isNaN(targetPrice) || targetPrice <= 0) {
    alert('Please enter a valid price');
    return;
  }

  // Create alert data
  const alertData = {
    origin: selectedFlight.origin,
    destination: selectedFlight.destination,
    departureDate: selectedFlight.departureDate,
    targetPrice,
    email
  };

  // Send data to server
  fetch('/api/price-alerts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alertData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Show success message
    showNotification(`Price alert created! We'll notify you at ${email} when the price drops below ₹${targetPrice}.`);

    // Close modal
    document.getElementById('alert-modal').style.display = 'none';

    // Reset form
    document.getElementById('alert-form').reset();
    selectedFlight = null;
  })
  .catch(error => {
    console.error('Error creating price alert:', error);
    alert('Failed to create price alert. Please try again.');
  });
}

// Handle book flight button click
function handleBookFlight(flight) {
  // Format the flight details for booking
  const bookingUrl = `/booking?` + new URLSearchParams({
    flightId: flight.id,
    origin: flight.origin,
    destination: flight.destination,
    date: flight.departureDate,
    price: flight.price,
    airline: flight.airline
  }).toString();

  // Navigate to booking page
  window.location.href = bookingUrl;
}

// Initialize destination links
function initDestinationLinks() {
  document.querySelectorAll('.text-link[data-destination]').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      // Set search form values
      document.getElementById('origin').value = 'DEL'; // Default origin as Delhi
      document.getElementById('destination').value = link.getAttribute('data-destination');

      // Scroll to search form
      document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// Format date to readable format
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show notification message
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  // Style notification
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'var(--primary)';
  notification.style.color = 'white';
  notification.style.padding = '1rem';
  notification.style.borderRadius = '0.5rem';
  notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  notification.style.zIndex = '2000';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(20px)';
  notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  // Add to body
  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}