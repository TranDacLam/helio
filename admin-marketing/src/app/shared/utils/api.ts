import { env } from '../../../environments/environment';

export const api = {
  	promotion_list: env.api_domain + 'promotion_list/', 
  	promotion_detail: env.api_domain + 'promotion/',
  	user_promotion: env.api_domain + 'user_promotion/',
    notification: env.api_domain + 'notification/',
    user_notification: env.api_domain + 'user_notification/',
    notification_list: env.api_domain + 'notification_list/',
    user: env.api_domain + 'user/',
    user_embed: env.api_domain + 'user_embed/',
    relate: env.api_domain + 'relate/',
    delete_relate: env.api_domain + 'delete_relate/',
    summary: env.api_domain + 'summary/',
};
