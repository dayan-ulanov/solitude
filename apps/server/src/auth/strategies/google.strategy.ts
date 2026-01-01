import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  StrategyOptions,
} from 'passport-google-oauth20';
import googleOauthConfig from '../configs/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { Profile } from 'passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private config: ConfigType<typeof googleOauthConfig>;

  constructor(
    @Inject(googleOauthConfig.KEY)
    config: ConfigType<typeof googleOauthConfig>,
  ) {
    const options: StrategyOptions = {
      clientID: config.clientId ?? '',
      clientSecret: config.clientSecret ?? '',
      callbackURL: config.callbackUrl ?? '',
      scope: ['email', 'profile'],
    };
    super(options);
    this.config = config;
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { name, emails, id } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : undefined;

    const user = {
      googleId: id,
      email: email,
      name: name ? `${name.givenName} ${name.familyName}` : '',
    };
    done(null, user);
  }
}
