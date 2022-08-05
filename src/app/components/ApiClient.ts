
import axios, {AxiosInstance} from "axios"
import i18next from "i18next";

export type ApiProgressCallback = (inProgress: boolean) => void
export type ApiErrorCallback = (error: any) => void

export  function createApi(url?: string) {

  const api = axios.create({
    baseURL: url,
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });

  const errorHandler = ApiStatusServiceInstance.getErrorHandler();
  const progressHandler = ApiStatusServiceInstance.getProgressHandler();

  const apiConfig: ApiConfig = {
    progressCallback: progressHandler,
    errorHandler: data => {

      let msg = data.message && data.message.length ? data.message : (data.error && data.error.length ? data.error : null)
      let msgEN= 'Username or Password Incorrect!';
      let msgTR='Kullanıcı Adı veya Şifre Hatalı!';
      if(msg === 'Bad credentials' ){
        if (i18next.language=='en') {
          errorHandler(msgEN)
        } else {
          errorHandler(msgTR)
          //console.error(data)
        }
      }
      else  errorHandler(msg);
    }
  };

  // Mock Authentication
  api.interceptors.request.use(config => { 
    let accessToken = window.sessionStorage.getItem('jwt_access_token');
    if (accessToken) {
      config.headers = {
        ...config.headers,
        "Authorization": `Bearer ${accessToken}`
      }
    }
    return config
  })

  applyInterceptors(api, apiConfig)

  return api;
}
export class ApiStatusService {
  private callbacks = {
    progress: new Map<string, ApiProgressCallback>(),
    error: new Map<string, ApiErrorCallback>()
  } as {
    progress: Map<string, ApiProgressCallback>,
    error: Map<string, ApiErrorCallback>
  };

  onProgress(key: string, callback: ApiProgressCallback): boolean {
    let callbacks = this.callbacks.progress;
    if (!callbacks.has(key)) {
      callbacks.set(key, callback);
      return true
    } else {
      return false
    }
  }

  onError(key: string, callback: ApiErrorCallback): boolean {
    let callbacks = this.callbacks.error;
    if (!callbacks.has(key)) {
      callbacks.set(key, callback);
      return true
    } else {
      return false
    }
  }

  getProgressHandler(): ApiProgressCallback {
    const callbacks = this.callbacks.progress;
    return (status) => {
      callbacks.forEach(c => {
        c(status)
      })
    }
  }

  getErrorHandler(): ApiErrorCallback {
    const callbacks = this.callbacks.error;
    return (error) => {
      callbacks.forEach(c => {
        c(error)
      })
    }
  }
}

export const ApiStatusServiceInstance = new ApiStatusService();

export interface ApiOAuthConfig {
  getAccessToken: () => Promise<string>,
  login: () => Promise<void>
}

export interface ApiConfig {
  progressCallback?: ApiProgressCallback,
  errorHandler?: ApiErrorCallback,
  oauth?: ApiOAuthConfig
}

/**
 * @param axios:AxiosInstance
 * @param config:ApiConfig
 * @returns {*}
 */
export function applyInterceptors(axios: AxiosInstance, config: ApiConfig) {
  const interceptors = axios.interceptors;
  //const {t}=useTranslation('LoginPage')
  const inProgress: ApiProgressCallback = typeof config.progressCallback === 'function' ? config.progressCallback : (() => void 0);
  const errorHandler: ApiErrorCallback = typeof config.errorHandler === 'function' ? config.errorHandler : (error) => alert(JSON.stringify(error));
  const oauth: ApiOAuthConfig = config.oauth || {} as ApiOAuthConfig;

  interceptors.request.use(
    requestSuccessInterceptor(inProgress, oauth),
    requestErrorInterceptor(inProgress)
  );

  interceptors.response.use(
    responseSuccessInterceptor(inProgress),
    responseErrorInterceptor(inProgress, oauth, errorHandler)
  );

  return axios
}
function requestSuccessInterceptor(inProgress: ApiProgressCallback, oauth: ApiOAuthConfig): (config: any) => Promise<any> {
  return config => {
    inProgress(true);
    if (oauth && typeof oauth.getAccessToken === 'function') {
      return new Promise((resolve, reject) => {
        oauth.getAccessToken()
          .then(at => {
            config.headers.Authorization = 'Bearer ' + at;
            resolve(config)
          })
          .catch(() => {
            reject('OAuth: Access Token Error')
          })
      })
    } else {
      return config
    }
  }
}

function requestErrorInterceptor(inProgress: ApiProgressCallback): (error: any) => any {
  return error => {
    inProgress(false);
    return error
  }
}

function responseSuccessInterceptor(inProgress: ApiProgressCallback): (res: any) => any {
  return response => {
    inProgress(false);
    if (response.config.responseType === 'blob' && response.config.filename) {
      //saveAs(response.data, response.config.filename)
    }
    return response
  }
}

function responseErrorInterceptor(inProgress: ApiProgressCallback, oauth: ApiOAuthConfig, errorHandler: ApiErrorCallback): (error: any) => any {
  return error => {
    return Promise.reject(error).finally(() => {
      inProgress(false);
      const {response, config} = error;
      if (response) {
        if (response.status === 401) {
          if (oauth && typeof oauth.login === 'function') {
            oauth.login()
          }
        } else {
          if (config.responseType === 'blob') {
            handleBlobError(config, errorHandler, response.data)
          } else {
            handleError(config, errorHandler, response.data)
          }
        }
      } else {
        handleError({}, errorHandler, {message: 'Connection Error'})
      }
    })
  }
}

function handleBlobError(config: any, errorHandler: ApiErrorCallback, errorDataBlob: Blob) {
  readBlob(errorDataBlob)
    .then(data => JSON.parse(data))
    .then(json => {
      handleError(config, errorHandler, json)
    })
}

function handleError(config: any, errorHandler: ApiErrorCallback, errorData: any) {
  if (!config.disableErrorMessage) {
    errorHandler(errorData)
  }
}

function readBlob(blob: Blob): Promise<string> {
  return new Promise(((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      resolve(reader.result as string)
    });
    reader.addEventListener('error', (e) => {
      reject(e)
    });
    reader.readAsText(blob)
  }))
}
