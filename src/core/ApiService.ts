import { App } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { AxiosResponse, AxiosRequestConfig } from "axios";

class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL = import.meta.env.VITE_API
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(
    resource: string,
    params: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios
      .get(resource, params)
      .catch((err: any) => Promise.reject(err))
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    slug = "" as string
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios
      .get(`${resource}/${slug}`)
      .catch((err: any) => Promise.reject(err))
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: any
   * @param config: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(
    resource: string,
    params?: any,
    config?: AxiosRequestConfig | undefined
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios
      .post(`${resource}`, params, config)
      .catch((err: any) => Promise.reject(err))
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(
    resource: string,
    slug: string,
    params: any,
    config?: AxiosRequestConfig | undefined
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios
      .put(`${resource}/${slug}`, params, config)
      .catch((err: any) => Promise.reject(err))
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios
      .delete(resource)
      .catch((err: any) => Promise.reject(err))
  }
}

export default ApiService;