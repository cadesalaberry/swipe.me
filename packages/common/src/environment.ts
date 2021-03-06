import { ServerConfig } from './types'

export interface AmplifyConfig {
  Auth: {
      region: string;
      userPoolWebClientId: string;
      identityPoolId: string;
      userPoolId: string;
      oauth: {
          domain: string;
          scope: string[];
          redirectSignIn: string;
          redirectSignOut: string;
          responseType: string;
      };
  };
  Storage: {
    AWSS3: {
      region: string;
      bucket: string;
      identityPoolId: string;
    }
  }
}

export class EnvHelper {
  static getAmplifyConfigFromServerConfig (serverConfig: ServerConfig): AmplifyConfig {
    const {
      s3Region,
      s3Bucket,
      cognitoRegion,
      cognitoUserPoolId: userPoolId,
      cognitoUserPoolDomain,
      cognitoUserPoolRedirectUrl,
      cognitoIdentityPoolId: identityPoolId,
      cognitoUserPoolClientId: userPoolWebClientId
    } = serverConfig

    if (EnvHelper.getOriginUrl() !== cognitoUserPoolRedirectUrl) {
      throw new Error('cognitoUserPoolRedirectUrl is invalid')
    }

    const newConfig = {
      Auth: {
        region: cognitoRegion,
        // mandatorySignIn: true,
        userPoolWebClientId,
        identityPoolId,
        userPoolId,
        oauth: {
          domain: cognitoUserPoolDomain,
          scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: EnvHelper.getOriginUrl(),
          redirectSignOut: EnvHelper.getOriginUrl(),
          responseType: 'code'
        }
      },
      Storage: {
        AWSS3: {
          region: s3Region,
          bucket: s3Bucket,
          identityPoolId
        }
      }
    }

    return newConfig
  }

  /**
   * i.e. new URL('https://console.cloud.google.com/apis/credentials/oauthclient/action_bar_section_nav.css.map')
   * {
   *   hash: ""
   *   host: "console.cloud.google.com"
   *   hostname: "console.cloud.google.com"
   *   href: "https://console.cloud.google.com/apis/credentials/oauthclient/action_bar_section_nav.css.map"
   *   origin: "https://console.cloud.google.com"
   *   password: ""
   *   pathname: "/apis/credentials/oauthclient/action_bar_section_nav.css.map"
   *   port: ""
   *   protocol: "https:"
   *   search: ""
   *   searchParams: URLSearchParams {}
   *   username: ""
   * }
   */
  static getOriginUrl (): string {
    return `${window.location.origin}/`
  }
}
