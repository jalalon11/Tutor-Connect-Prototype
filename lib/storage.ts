// Simple in-memory storage for mock data
class MockStorage {
  private store: Record<string, any> = {
    currentUser: null,
    users: { ...require("./mock-data").mockUsers },
    jobs: [...require("./mock-data").mockJobs],
    applications: [...require("./mock-data").mockApplications],
    logs: [...require("./mock-data").mockActivityLogs],
  }

  get(key: string) {
    return this.store[key]
  }

  set(key: string, value: any) {
    this.store[key] = value
  }

  append(key: string, item: any) {
    if (Array.isArray(this.store[key])) {
      this.store[key].push(item)
    }
  }

  update(key: string, id: string, updates: any) {
    if (Array.isArray(this.store[key])) {
      const index = this.store[key].findIndex((item: any) => item.id === id)
      if (index !== -1) {
        this.store[key][index] = { ...this.store[key][index], ...updates }
      }
    }
  }

  reset() {
    this.store = {
      currentUser: null,
      users: { ...require("./mock-data").mockUsers },
      jobs: [...require("./mock-data").mockJobs],
      applications: [...require("./mock-data").mockApplications],
      logs: [...require("./mock-data").mockActivityLogs],
    }
  }
}

export const storage = new MockStorage()
