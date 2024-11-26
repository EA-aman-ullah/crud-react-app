import apiClient from "./api-client";

interface Entity {
  id: string;
}

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll<T>() {
    const controller = new AbortController();
    const request = apiClient.get<T[]>(this.endpoint, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
  delete(id: string) {
    return apiClient.delete(this.endpoint + "/" + id);
  }
  add<T>(user: T) {
    return apiClient.post(this.endpoint, user);
  }
  update<T extends Entity>(user: T) {
    return apiClient.put(this.endpoint + "/" + user.id, user);
  }
}

const creat = (endpoint: string) => new HttpService(endpoint);

export default creat;
