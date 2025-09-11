/**
 * Basic Strapi Client for Dynamic Content
 * Simple client for fetching dynamic content from Strapi
 */

import qs from 'qs';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dev.strapi.zymptek.com';

/**
 * Basic Strapi API Client
 */
export class StrapiClient {
  private baseURL: string;
  private apiToken?: string;

  constructor(baseURL: string = STRAPI_URL, apiToken?: string) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.apiToken = apiToken;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const baseHeaders = new Headers(this.getHeaders());

    if (options.headers) {
      new Headers(options.headers).forEach((v, k) => baseHeaders.set(k, v));
    }

    // Remove headers from options, but do not assign to an unused variable
    const rest = { ...options };
    delete rest.headers;
    const config: RequestInit = { ...rest, headers: baseHeaders };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(
          `Strapi API Error: ${response.status} ${response.statusText}`
        );
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
    const queryString = params
      ? qs.stringify(params, { encodeValuesOnly: true })
      : '';
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request<T>(fullEndpoint, { method: 'GET' });
  }

  /**
   * Get content from Strapi
   */
  async getContent<T>(
    contentType: string,
    params?: {
      populate?: string | string[];
      filters?: Record<string, unknown>;
      sort?: string | string[];
      pagination?: {
        page?: number;
        pageSize?: number;
      };
      locale?: string;
    }
  ): Promise<T> {
    const endpoint = `/api/${contentType}`;
    return this.get<T>(endpoint, params);
  }

  /**
   * Get single content item by ID
   */
  async getContentById<T>(
    contentType: string,
    id: string | number
  ): Promise<T> {
    const endpoint = `/api/${contentType}/${id}`;
    return this.get<T>(endpoint);
  }
}

// Create public Strapi client instance (no API token for client-side use)
export const strapiClient = new StrapiClient();

// Create server Strapi client instance (with API token for server-side use)
export const createServerStrapiClient = (baseURL?: string) => {
  const apiToken = process.env.STRAPI_API_TOKEN;
  return new StrapiClient(baseURL, apiToken);
};

// Export utility function for custom client creation
export const createStrapiClient = (baseURL?: string, apiToken?: string) =>
  new StrapiClient(baseURL, apiToken);
