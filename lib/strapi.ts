/**
 * Basic Strapi Client for Dynamic Content
 * Simple client for fetching dynamic content from Strapi
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dev.strapi.zymptek.com';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Basic Strapi API Client
 */
export class StrapiClient {
  private baseURL: string;
  private apiToken?: string;

  constructor(baseURL: string = STRAPI_URL, apiToken?: string) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.apiToken = apiToken || API_TOKEN;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiToken) {
      headers.Authorization = `Bearer ${this.apiToken}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Strapi API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Strapi API Request Failed:', error);
      throw error;
    }
  }

  /**
   * GET request to Strapi API
   */
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request<T>(fullEndpoint, { method: 'GET' });
  }

  /**
   * Get content from Strapi
   */
  async getContent<T>(contentType: string, params?: {
    populate?: string | string[];
    filters?: Record<string, unknown>;
    sort?: string | string[];
    pagination?: {
      page?: number;
      pageSize?: number;
    };
    locale?: string;
  }): Promise<T> {
    const endpoint = `/api/${contentType}`;
    return this.get<T>(endpoint, params);
  }

  /**
   * Get single content item by ID
   */
  async getContentById<T>(contentType: string, id: string | number): Promise<T> {
    const endpoint = `/api/${contentType}/${id}`;
    return this.get<T>(endpoint);
  }
}

// Create default Strapi client instance
export const strapiClient = new StrapiClient();

// Export utility function
export const createStrapiClient = (baseURL?: string, apiToken?: string) => 
  new StrapiClient(baseURL, apiToken);
