/**
 * Driver model to standardize driver data structure
 */
class Driver {
  constructor(data) {
    this.id = data.id ? data.id.toString() : null;
    this.name = data.name || 'Unknown Driver';
    this.image = data.image || '/drivers/default.jpg';
    this.rating = Number(data.rating) || 0;
    this.experience = data.experience || '0 years';
    this.location = data.location || 'Unknown';
    this.vehicle = data.vehicle || 'Standard';
    this.status = data.status || 'Unavailable';
    this.price = Number(data.price) || 0;
  }

  // Factory method to create driver from API or mock data
  static fromData(data) {
    return new Driver(data);
  }

  // Factory method to create mock driver (for testing)
  static createMock(id) {
    return new Driver({
      id: id || 1,
      name: 'Mock Driver',
      image: '/drivers/default.jpg',
      rating: 4.5,
      experience: '3+ years',
      location: 'Mumbai',
      vehicle: 'Toyota Camry',
      status: 'Available',
      price: 599,
    });
  }

  // Utility to check if driver has valid data
  isValid() {
    return Boolean(this.id) && Boolean(this.name);
  }
}

export default Driver; 