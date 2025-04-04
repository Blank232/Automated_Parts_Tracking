class ApiServiceClass {
  constructor() {
    this.baseUrl = "http://localhost:5000/api";
  }

  async getParts() {
    const response = await fetch(`${this.baseUrl}/parts`);
    if (!response.ok) {
      throw new Error(`Failed to fetch parts: ${response.statusText}`);
    }
    return response.json();
  }

  async getPartById(partId) {
    const response = await fetch(`${this.baseUrl}/parts/${partId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch part: ${response.statusText}`);
    }
    return response.json();
  }

  async addPart(partData) {
    const response = await fetch(`${this.baseUrl}/parts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partData),
    });
    if (!response.ok) {
      throw new Error(`Failed to add part: ${response.statusText}`);
    }
    return response.json();
  }

  async updatePart(partId, partData) {
    const response = await fetch(`${this.baseUrl}/parts/${partId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update part: ${response.statusText}`);
    }
    return response.json();
  }

  async searchParts(query, field) {
    const response = await fetch(
      `${this.baseUrl}/search?q=${encodeURIComponent(query)}&field=${field}`
    );
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    return response.json();
  }

  async getSummary() {
    const response = await fetch(`${this.baseUrl}/reports/summary`);
    if (!response.ok) {
      throw new Error(`Failed to fetch summary: ${response.statusText}`);
    }
    return response.json();
  }
}

export const ApiService = new ApiServiceClass();
